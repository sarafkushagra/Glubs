const Club = require("../schema/club")
const User = require("../schema/user")
const ClubJoinRequest = require("../schema/clubJoinRequest") // Fixed import path
const Event = require("../schema/event")
const sendEmail = require("../utils/email")
const { request } = require("express")

// Get club admin dashboard data
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id

    // Get clubs this user administers
    const adminClubs = await Club.find({
      _id: { $in: req.user.adminOfClubs || [] },
    }).populate("members", "username email yearOfStudy department")

    // Get pending join requests for admin's clubs
    const pendingRequests = await ClubJoinRequest.find({
      club: { $in: req.user.adminOfClubs || [] },
      status: "pending",
    })
      .populate("user", "username email yearOfStudy department")
      .populate("club", "name")
      .sort({ createdAt: -1 })

    // Get recent events for admin's clubs
    const recentEvents = await Event.find({
      club: { $in: req.user.adminOfClubs || [] },
    })
      .populate("createdBy", "username")
      .sort({ createdAt: -1 })
      .limit(5)

    // Calculate statistics
    const stats = {
      totalClubs: adminClubs.length,
      totalMembers: adminClubs.reduce((sum, club) => sum + club.members.length, 0),
      pendingRequests: pendingRequests.length,
      totalEvents: await Event.countDocuments({ club: { $in: req.user.adminOfClubs || [] } }),
    }

    res.json({
      clubs: adminClubs,
      pendingRequests,
      recentEvents,
      stats,
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    res.status(500).json({ message: "Error fetching dashboard data", error: error.message })
  }
}

// Get all join requests for admin's clubs
exports.getJoinRequests = async (req, res) => {
  try {
    const { status = "pending", clubId } = req.query

    let clubFilter = req.user.adminOfClubs || []

    if (clubId && clubFilter.includes(clubId)) {
      clubFilter = [clubId] // only fetch for this club if admin manages it
    }

    const query = {
      club: { $in: clubFilter },
      status,
    }


    const requests = await ClubJoinRequest.find(query)
      .populate("user", "username email yearOfStudy department age")
      .populate("club", "name category")
      .populate("reviewedBy", "username")
      .sort({ createdAt: -1 })

    res.json({ requests })
  } catch (error) {
    console.error("Error fetching join requests:", error)
    res.status(500).json({ message: "Error fetching join requests", error: error.message })
  }
}

// Accept/Reject join request
exports.handleJoinRequest = async (req, res) => {
  try {
    const { requestId } = req.params
    const { action, rejectionReason } = req.body
    const adminId = req.user._id

    const request = await ClubJoinRequest.findById(requestId)
      .populate("user", "username email")
      .populate("club", "name members")

    if (!request) {
      return res.status(404).json({ message: "Request not found" })
    }

    // Check if admin manages this club
    if (!req.user.adminOfClubs?.includes(request.club._id.toString())) {
      return res.status(403).json({ message: "You don't have permission to manage this club" })
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request has already been processed" })
    }

    if (action === "accept") {
      // Add user to club members
      const club = await Club.findById(request.club._id)
      if (!club.members.includes(request.user._id)) {
        club.members.push(request.user._id)
        await club.save()
      }

      // Update user's club membership
      await User.findByIdAndUpdate(request.user._id, {
        $addToSet: { memberOfClubs: request.club._id },
        $set: {
          isClubMember: true,
          club: request.club.name, // optional: if you want to store club name
        },
      })


      request.status = "accepted"
      request.reviewedBy = adminId
      request.reviewedAt = new Date()

      // Send acceptance email
      if (typeof sendEmail === "function") {
        try {
          await sendEmail({
            email: request.user.email,
            subject: `Welcome to ${request.club.name}! 🎉`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #10b981;">Congratulations! 🎉</h2>
                <p>Hello ${request.user.username},</p>
                <p>Great news! Your request to join <strong>${request.club.name}</strong> has been <strong>accepted</strong>!</p>
                <p>You are now an official member of the club. You can now:</p>
                <ul>
                  <li>Participate in club events</li>
                  <li>Access club resources</li>
                  <li>Connect with other members</li>
                </ul>
                <p>Welcome to the community!</p>
                <p>Best regards,<br>The Glubs Team</p>
              </div>
            `,
          })
        } catch (emailError) {
          console.error("Error sending acceptance email:", emailError)
        }
      }
    } else if (action === "reject") {
      request.status = "rejected"
      request.reviewedBy = adminId
      request.reviewedAt = new Date()
      request.rejectionReason = rejectionReason || "No reason provided"

      // Send rejection email
      if (typeof sendEmail === "function") {
        try {
          await sendEmail({
            email: request.user.email,
            subject: `Update on your club membership request`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #ef4444;">Club Membership Update</h2>
                <p>Hello ${request.user.username},</p>
                <p>Thank you for your interest in joining <strong>${request.club.name}</strong>.</p>
                <p>Unfortunately, your membership request has not been approved at this time.</p>
                ${rejectionReason ? `<p><strong>Reason:</strong> ${rejectionReason}</p>` : ""}
                <p>You're welcome to apply again in the future or explore other clubs that might be a great fit for you!</p>
                <p>Best regards,<br>The Glubs Team</p>
              </div>
            `,
          })
        } catch (emailError) {
          console.error("Error sending rejection email:", emailError)
        }
      }
    } else {
      return res.status(400).json({ message: "Invalid action. Use 'accept' or 'reject'" })
    }

    await request.save()

    res.json({
      message: `Request ${action}ed successfully`,
      request,
    })
  } catch (error) {
    console.error("Error handling join request:", error)
    res.status(500).json({ message: "Error processing request", error: error.message })
  }
}

// Remove member from club
exports.removeMember = async (req, res) => {
  try {
    const { clubId, memberId } = req.params

    // Check if admin manages this club
    if (!req.user.adminOfClubs?.includes(clubId)) {
      return res.status(403).json({ message: "You don't have permission to manage this club" })
    }

    const club = await Club.findById(clubId)
    if (!club) {
      return res.status(404).json({ message: "Club not found" })
    }

    // Remove member from club
    club.members = club.members.filter((member) => member.toString() !== memberId)
    await club.save()

    // Update user's memberOfClubs
    const user = await User.findById(memberId)
    if (user) {
      user.memberOfClubs = user.memberOfClubs?.filter((club) => club.toString() !== clubId) || []
      if (user.memberOfClubs.length === 0) {
        user.isClubMember = false
      }
      await user.save()
    }

    res.json({ message: "Member removed successfully" })
  } catch (error) {
    console.error("Error removing member:", error)
    res.status(500).json({ message: "Error removing member", error: error.message })
  }
}

// Get club members with details
exports.getClubMembers = async (req, res) => {
  try {
    const { clubId } = req.params

    // Check if admin manages this club
    if (!req.user.adminOfClubs?.includes(clubId)) {
      return res.status(403).json({ message: "You don't have permission to view this club's members" })
    }

    const club = await Club.findById(clubId).populate("members", "username email yearOfStudy department age createdAt")

    if (!club) {
      return res.status(404).json({ message: "Club not found" })
    }

    res.json({
      club: {
        name: club.name,
        description: club.description,
        category: club.category,
      },
      members: club.members,
    })
  } catch (error) {
    console.error("Error fetching club members:", error)
    res.status(500).json({ message: "Error fetching club members", error: error.message })
  }
}
