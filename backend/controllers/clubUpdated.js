const Club = require("../schema/club")
const Event = require("../schema/event")
const ClubJoinRequest = require("../models/clubJoinRequest")
const User = require("../schema/user")
const sendEmail = require("../utils/email")
const mongoose = require("mongoose")

// Your existing methods remain the same...
module.exports.showAllClubs = async (req, res) => {
  const clubs = await Club.find()
  res.json(clubs)
}

module.exports.createClub = async (req, res) => {
  try {
    const club = new Club(req.body)
    await club.save()
    res.status(201).json(club)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

module.exports.showClub = async (req, res) => {
  const club = await Club.findById(req.params.id)
  res.json(club)
}

module.exports.updateClub = async (req, res) => {
  const updatedClub = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(updatedClub)
}

module.exports.deleteClub = async (req, res) => {
  const deletedClub = await Club.findByIdAndDelete(req.params.id)
  res.json({
    message: "Club deleted successfully!",
    club: deletedClub,
  })
}

module.exports.showClubMembers = async (req, res) => {
  const club = await Club.findById(req.params.id).populate("members")
  if (!club) {
    return res.status(404).json({ error: "Club not found" })
  }
  res.json(club.members)
}

module.exports.showClubEvents = async (req, res) => {
  try {
    const { clubId } = req.params
    const events = await Event.find({ club: clubId }).populate("createdBy")
    res.json(events)
  } catch (error) {
    console.error("Error in getClubEvents:", error)
    res.status(500).json({ message: "Server error fetching club events", error: error.message })
  }
}

// NEW METHODS FOR JOIN REQUESTS

// Send join request to club
module.exports.sendJoinRequest = async (req, res) => {
  try {
    const { clubId } = req.params
    const { message } = req.body
    const userId = req.user._id

    const club = await Club.findById(clubId)
    if (!club) {
      return res.status(404).json({ message: "Club not found" })
    }

    // Check if user is already a member
    if (club.members.includes(userId)) {
      return res.status(400).json({ message: "You are already a member of this club" })
    }

    // Check if there's already a pending request
    const existingRequest = await ClubJoinRequest.findOne({
      club: clubId,
      user: userId,
      status: "pending",
    })

    if (existingRequest) {
      return res.status(400).json({ message: "You already have a pending request for this club" })
    }

    // Create join request
    const joinRequest = new ClubJoinRequest({
      club: clubId,
      user: userId,
      message: message || "",
    })

    await joinRequest.save()

    // Get club admins for notification
    const clubAdmins = await User.find({
      adminOfClubs: clubId,
      role: "club-admin",
    })

    // Send email notifications to club admins
    for (const admin of clubAdmins) {
      try {
        await sendEmail({
          email: admin.email,
          subject: `New Club Join Request - ${club.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #6366f1;">New Club Join Request</h2>
              <p>Hello ${admin.username},</p>
              <p>A new user has requested to join <strong>${club.name}</strong>.</p>
              <p><strong>User:</strong> ${req.user.username}</p>
              <p><strong>Email:</strong> ${req.user.email}</p>
              ${message ? `<p><strong>Message:</strong> "${message}"</p>` : ""}
              <p>Please review this request in your club admin dashboard.</p>
              <p>Best regards,<br>The Glubs Team</p>
            </div>
          `,
        })
      } catch (emailError) {
        console.error("Error sending notification email:", emailError)
      }
    }

    res.status(201).json({
      message: "Join request sent successfully",
      request: joinRequest,
    })
  } catch (error) {
    console.error("Error sending join request:", error)
    res.status(500).json({ message: "Error sending join request", error: error.message })
  }
}

// Get user's join requests
module.exports.getUserJoinRequests = async (req, res) => {
  try {
    const userId = req.user._id

    const requests = await ClubJoinRequest.find({ user: userId })
      .populate("club", "name category description")
      .populate("reviewedBy", "username")
      .sort({ createdAt: -1 })

    res.json({ requests })
  } catch (error) {
    console.error("Error fetching user join requests:", error)
    res.status(500).json({ message: "Error fetching join requests", error: error.message })
  }
}
