const Team = require("../schema/team")
const TeamRequest = require("../schema/teamRequest")
const User = require("../schema/user")
const Event = require("../schema/event")
const mongoose = require("mongoose")
const { nanoid } = require("nanoid")

module.exports.createTeam = async (req, res) => {
  try {
    const { name, description, eventId, leaderId } = req.body;

    // Generate unique invite code
    const inviteCode = nanoid(8); // e.g., 'a3K4mPzQ'

    // Validate event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if event supports teams
    if (event.participationType !== "Team") {
      return res.status(400).json({ message: "This event doesn't support team participation" });
    }

    // Check if user already has a team for this event
    const existingTeam = await Team.findOne({
      event: eventId,
      members: leaderId,
    });
    if (existingTeam) {
      return res.status(400).json({ message: "You are already in a team for this event" });
    }

    // Create team
    const team = new Team({
      name: name.trim(),
      description: description?.trim() || "",
      event: eventId,
      leader: leaderId,
      members: [leaderId],
      maxMembers: event.teamMax,
      inviteCode, // ✅ include invite code
    });

    await team.save();

    // Populate the team with member details
    const populatedTeam = await Team.findById(team._id)
      .populate("leader", "username email yearOfStudy department")
      .populate("members", "username email yearOfStudy department")
      .populate("event", "title teamMin teamMax");

    res.status(201).json({
      message: "Team created successfully!",
      team: populatedTeam,
    });
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ message: "Error creating team", error: error.message });
  }
};


// Get user's team for a specific event
module.exports.getUserTeam = async (req, res) => {
  try {
    const { userId, eventId } = req.params

    const team = await Team.findOne({
      event: eventId,
      members: userId,
    })
      .populate("leader", "username email yearOfStudy department")
      .populate("members", "username email yearOfStudy department")
      .populate("event", "title teamMin teamMax")

    if (!team) {
      return res.status(404).json({ message: "No team found for this user and event" })
    }

    res.json({ team })
  } catch (error) {
    console.error("Error fetching user team:", error)
    res.status(500).json({ message: "Error fetching user team", error: error.message })
  }
}

// Update team details
module.exports.updateTeam = async (req, res) => {
  try {
    const { teamId } = req.params
    const { name, description } = req.body
    const userId = req.user._id

    const team = await Team.findById(teamId)
    if (!team) {
      return res.status(404).json({ message: "Team not found" })
    }

    // Check if user is team leader
    if (team.leader.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only team leaders can update team details" })
    }

    // Update team
    team.name = name.trim()
    team.description = description?.trim() || ""
    await team.save()

    const updatedTeam = await Team.findById(teamId)
      .populate("leader", "username email yearOfStudy department")
      .populate("members", "username email yearOfStudy department")
      .populate("event", "title teamMin teamMax")

    res.json({
      message: "Team updated successfully!",
      team: updatedTeam,
    })
  } catch (error) {
    console.error("Error updating team:", error)
    res.status(500).json({ message: "Error updating team", error: error.message })
  }
}

// Remove member from team
module.exports.removeMember = async (req, res) => {
  try {
    const { teamId, memberId } = req.params
    const userId = req.user._id

    const team = await Team.findById(teamId)
    if (!team) {
      return res.status(404).json({ message: "Team not found" })
    }

    // Check if user is team leader or removing themselves
    if (team.leader.toString() !== userId.toString() && memberId !== userId.toString()) {
      return res.status(403).json({ message: "Only team leaders can remove members" })
    }

    // Can't remove team leader
    if (memberId === team.leader.toString() && team.members.length > 1) {
      return res.status(400).json({ message: "Team leader cannot be removed. Transfer leadership first." })
    }

    // Remove member
    team.members = team.members.filter((member) => member.toString() !== memberId)
    await team.save()

    // If team is empty, delete it
    if (team.members.length === 0) {
      await Team.findByIdAndDelete(teamId)
      return res.json({ message: "Team disbanded successfully!" })
    }

    const updatedTeam = await Team.findById(teamId)
      .populate("leader", "username email yearOfStudy department")
      .populate("members", "username email yearOfStudy department")
      .populate("event", "title teamMin teamMax")

    res.json({
      message: "Member removed successfully!",
      team: updatedTeam,
    })
  } catch (error) {
    console.error("Error removing member:", error)
    res.status(500).json({ message: "Error removing member", error: error.message })
  }
}

module.exports.getTeamRequests = async (req, res) => {
  try {
    const { eventId } = req.params
    const userId = req.user._id

    const requests = await TeamRequest.find({
      to: userId,
      event: eventId,
      status: "pending",
    })
      .populate("team", "name description")
      .populate("from", "username email")
      .populate("event", "title")
      .sort({ createdAt: -1 })

    res.json({ requests })
  } catch (error) {
    console.error("Error fetching team requests:", error)
    res.status(500).json({ message: "Error fetching team requests", error: error.message })
  }
}


// Respond to team request
module.exports.respondToRequest = async (req, res) => {
  try {
    const { requestId } = req.params
    const { action } = req.body // 'accept' or 'reject'
    const userId = req.user._id

    const request = await TeamRequest.findById(requestId).populate("team").populate("event")

    if (!request) {
      return res.status(404).json({ message: "Request not found" })
    }

    if (request.to.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only respond to your own requests" })
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request has already been responded to" })
    }

    if (action === "accept") {
      // Check if user is already in a team for this event
      const existingTeam = await Team.findOne({
        event: request.event._id,
        members: userId,
      })
      if (existingTeam) {
        return res.status(400).json({ message: "You are already in a team for this event" })
      }

      // Check if team is full
      if (request.team.members.length >= request.event.teamMax) {
        return res.status(400).json({ message: "Team is already full" })
      }

      // Add user to team
      const team = await Team.findById(request.team._id)
      team.members.push(userId)
      await team.save()

      request.status = "accepted"
      await request.save()

      res.json({ message: "Request accepted successfully! You have joined the team." })
    } else if (action === "reject") {
      request.status = "rejected"
      await request.save()

      res.json({ message: "Request rejected successfully." })
    } else {
      return res.status(400).json({ message: "Invalid action. Use 'accept' or 'reject'" })
    }
  } catch (error) {
    console.error("Error responding to request:", error)
    res.status(500).json({ message: "Error responding to request", error: error.message })
  }
}

// Delete team (only by leader)
module.exports.deleteTeam = async (req, res) => {
  try {
    const { teamId } = req.params
    const userId = req.user._id

    const team = await Team.findById(teamId)
    if (!team) {
      return res.status(404).json({ message: "Team not found" })
    }

    if (team.leader.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only team leaders can delete the team" })
    }

    // Delete all pending requests for this team
    await TeamRequest.deleteMany({ team: teamId })

    // Delete the team
    await Team.findByIdAndDelete(teamId)

    res.json({ message: "Team deleted successfully!" })
  } catch (error) {
    console.error("Error deleting team:", error)
    res.status(500).json({ message: "Error deleting team", error: error.message })
  }
}



// Get sent requests for a specific event (to track which users already have pending requests)
module.exports.getSentRequests = async (req, res) => {
  try {
    const { eventId } = req.params
    const userId = req.user._id

    const TeamRequest = require("../schema/teamRequest")

    const sentRequests = await TeamRequest.find({
      from: userId,
      event: eventId,
      status: "pending",
    }).populate("to", "username email")

    res.json({ requests: sentRequests })
  } catch (error) {
    console.error("Error fetching sent requests:", error)
    res.status(500).json({ message: "Error fetching sent requests", error: error.message })
  }
}
module.exports.sendTeamRequest = async (req, res) => {
  try {
    const { teamId, targetUserId, eventId, message } = req.body
    const fromUserId = req.user._id
    const Team = require("../schema/team")
    const Event = require("../schema/event")
    const User = require("../schema/user")
    const TeamRequest = require("../schema/teamRequest")
    const sendEmail = require("../utils/email")

    // Validate team exists and user is the leader
    const team = await Team.findById(teamId).populate("members")
    if (!team) {
      return res.status(404).json({ message: "Team not found" })
    }

    if (team.leader.toString() !== fromUserId.toString()) {
      return res.status(403).json({ message: "Only team leaders can send invitations" })
    }

    // Check if team is already full
    const event = await Event.findById(eventId)
    if (team.members.length >= event.teamMax) {
      return res.status(400).json({ message: "Team is already full" })
    }

    // Check if target user exists and is available
    const targetUser = await User.findById(targetUserId)
    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" })
    }

    // Check if target user is already registered for the event
    if (event.registeredUsers.includes(targetUserId)) {
      return res.status(400).json({ message: "User is already registered for this event" })
    }

    // Check if target user is already in a team for this event
    const existingTeam = await Team.findOne({
      event: eventId,
      members: targetUserId,
    })

    if (existingTeam) {
      return res.status(400).json({ message: "User is already in a team for this event" })
    }

    // Check if there's already a pending request
    const existingRequest = await TeamRequest.findOne({
      team: teamId,
      to: targetUserId,
      event: eventId,
      status: "pending",
    })

    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent to this user" })
    }

    // Create the team request
    const teamRequest = new TeamRequest({
      team: teamId,
      from: fromUserId,
      to: targetUserId,
      event: eventId,
      message: message || "",
      status: "pending",
    })

    await teamRequest.save()

    // Get sender info for email
    const sender = await User.findById(fromUserId)

    // Send email notification
    try {
      await sendEmail({
        email: targetUser.email,
        subject: `Team Invitation: ${team.name} for ${event.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #6366f1; margin-bottom: 10px;">Team Invitation</h1>
              <p style="color: #666; font-size: 16px;">You've been invited to join a team!</p>
            </div>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p style="font-size: 16px; margin-bottom: 10px;">Hello <strong>${targetUser.username}</strong>,</p>
              <p style="font-size: 16px; margin-bottom: 20px;">
                <strong>${sender.username}</strong> has invited you to join their team <strong>"${team.name}"</strong> for the event <strong>${event.title}</strong>.
              </p>
              ${
                message
                  ? `
                <div style="background-color: #fff; padding: 15px; border-left: 4px solid #6366f1; margin-bottom: 20px; border-radius: 4px;">
                  <p style="font-style: italic; color: #4b5563; margin: 0;">"${message}"</p>
                </div>
              `
                  : ""
              }
            </div>
            
            <div style="text-align: center; margin-bottom: 20px;">
              <a href="http://localhost:3000/notifications" style="display: inline-block; background-color: #6366f1; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
                View Invitation
              </a>
            </div>
            
            <div style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              <p>This is an automated message from Glubs Event Management System.</p>
              <p>If you didn't expect this invitation, you can safely ignore this email.</p>
            </div>
          </div>
        `,
      })
    } catch (emailError) {
      console.error("Error sending email notification:", emailError)
      // Continue even if email fails
    }

    res.status(201).json({
      message: "Team invitation sent successfully",
      request: teamRequest,
    })
  } catch (error) {
    console.error("Error sending team request:", error)
    res.status(500).json({ message: "Error sending team request", error: error.message })
  }
}

