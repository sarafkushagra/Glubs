/**
 * club.js
 * Controller for club-related operations:
 *  - List, create, update, delete clubs
 *  - Show members and events for a club
 *  - Handle club join requests and user-specific join request retrieval
 *
 * General patterns:
 *  - Uses Mongoose models: Club, Event, ClubJoinRequest, User
 *  - Returns JSON responses; standardizes status/message where appropriate
 *  - Some handlers perform notification emails to club admins
 */

const Club = require("../schema/club")
const Event = require("../schema/event")
const mongoose = require("mongoose")
const ClubJoinRequest = require("../schema/clubJoinRequest")
const User = require("../schema/user")
const sendEmail = require("../utils/email")

// ---------------------------------------------------------------------------
// Handler: showAllClubs
// Purpose: Return a list of all clubs.
// Request: none
// Response: JSON array of clubs
// Errors: Unexpected DB errors will propagate (consider try/catch in future)
// ---------------------------------------------------------------------------
module.exports.showAllClubs = async (req, res) => {
  const clubs = await Club.find()
  res.json(clubs)
}

// ---------------------------------------------------------------------------
// Handler: createClub
// Purpose: Create a new club and make the creating user the club admin/member.
// Request: expects authenticated `req.user` (user id or user object) and club data in req.body
// Behaviour:
//  - Validates authentication presence
//  - Creates Club with createdBy and members set to the creator
//  - Adds the club id to the user's adminOfClubs and memberOfClubs arrays
//  - Sets user's isClubMember and club name fields
// Response: 201 with the newly created club
// Errors: 400 for validation/creation errors; returns error.message in JSON
// ---------------------------------------------------------------------------
module.exports.createClub = async (req, res) => {
  try {
    const userId = req.user

    if (!userId) {
      return res.status(400).json({ error: "User not authenticated." })
    }

    // Create club with the user as creator and first member
    const club = new Club({
      ...req.body,
      createdBy: userId,
      members: [userId],
    })

    await club.save()
    // ✅ Add the new club to the user's `adminOfClubs` array
    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        adminOfClubs: club._id,
        memberOfClubs: club._id,
      },
      $set: {
        isClubMember: true,
        club: club.name,
      }
    })
    res.status(201).json(club)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}


// ---------------------------------------------------------------------------
// Handler: showClub
// Purpose: Get details for a specific club by id.
// Request: req.params.id = club ObjectId
// Response: JSON club document (populates createdBy username)
// Errors: If not found, returns null body currently (consider 404 handling)
// ---------------------------------------------------------------------------
module.exports.showClub = async (req, res) => {
  const club = await Club.findById(req.params.id).populate("createdBy", "username")
  res.json(club)
}

// ---------------------------------------------------------------------------
// Handler: updateClub
// Purpose: Update club fields by id.
// Request: req.params.id, req.body contains update payload
// Response: JSON updated club document
// Errors: Unexpected DB errors will propagate (consider try/catch)
// ---------------------------------------------------------------------------
module.exports.updateClub = async (req, res) => {
  const updatedClub = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(updatedClub)
}

// ---------------------------------------------------------------------------
// Handler: deleteClub
// Purpose: Remove a club document by id.
// Request: req.params.id
// Response: JSON with confirmation message and deleted club
// Errors: Unexpected DB errors will propagate (consider try/catch and cleanup of related references)
// ---------------------------------------------------------------------------
module.exports.deleteClub = async (req, res) => {
  const deletedClub = await Club.findByIdAndDelete(req.params.id)
  res.json({
    message: "Club deleted successfully!",
    club: deletedClub,
  })
}

// ---------------------------------------------------------------------------
// Handler: showClubMembers
// Purpose: Return the member list for a club.
// Request: req.params.id (club id)
// Response: JSON array of members (populated)
// Errors: 404 when club not found; 500 for unexpected failures
// ---------------------------------------------------------------------------
module.exports.showClubMembers = async (req, res) => {
  const club = await Club.findById(req.params.id).populate("members")
  if (!club) {
    return res.status(404).json({ error: "Club not found" })
  }
  res.json(club.members)
}

// ---------------------------------------------------------------------------
// Handler: showClubEvents
// Purpose: Fetch all events for a club.
// Request: req.params.clubId
// Response: JSON array of event documents (populates createdBy)
// Errors: 500 with error message when database or other failure occurs
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Handler: sendJoinRequest
// Purpose: Allow a user to request joining a club.
// Request: req.params.clubId, req.body.message (optional), authenticated req.user
// Behaviour:
//  - Validates club exists and user is not already a member
//  - Rejects duplicate pending requests
//  - Creates a ClubJoinRequest and notifies club admins via email
// Response: 201 with created join request
// Errors: 400/404 for user/club/duplicate request; 500 for unexpected failures
// ---------------------------------------------------------------------------
module.exports.sendJoinRequest = async (req, res) => {
  try {
    const { clubId } = req.params
    const { message } = req.body
    const userId = req.user._id || req.user

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

    // Send email notifications to club admins (if email utility exists)
    if (typeof sendEmail === "function") {
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
// ---------------------------------------------------------------------------
// Handler: getUserJoinRequests
// Purpose: Retrieve all join requests created by the authenticated user.
// Request: authenticated req.user (user id)
// Response: JSON { requests: [...] } with populated club and reviewer information
// Errors: 500 on unexpected failures
// ---------------------------------------------------------------------------
module.exports.getUserJoinRequests = async (req, res) => {
  try {
    const userId = req.user._id || req.user

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
