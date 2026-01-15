const Team = require("../schema/team")
const TeamRequest = require("../schema/teamRequest")
const User = require("../schema/user")
const Event = require("../schema/event")
const mongoose = require("mongoose")
const { nanoid } = require("nanoid")
const sendEmail = require("../utils/email")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")

// Helper for consistent team population
const populateTeam = (query) => {
  return query
    .populate("leader", "username email yearOfStudy department")
    .populate("members", "username email yearOfStudy department")
    .populate("event", "title teamMin teamMax");
};

// 📌 Create a new team
module.exports.createTeam = catchAsync(async (req, res, next) => {
  const { name, description, eventId, leaderId } = req.body;

  const inviteCode = nanoid(8);

  const event = await Event.findById(eventId);
  if (!event) return next(new AppError("Event not found", 404));

  if (event.participationType !== "Team") {
    return next(new AppError("This event doesn't support team participation", 400));
  }

  const existingTeam = await Team.findOne({
    event: eventId,
    members: leaderId,
  });
  if (existingTeam) {
    return next(new AppError("You are already in a team for this event", 400));
  }

  const team = await Team.create({
    name: name.trim(),
    description: description?.trim() || "",
    event: eventId,
    leader: leaderId,
    members: [leaderId],
    maxMembers: event.teamMax,
    inviteCode,
  });

  const populatedTeam = await populateTeam(Team.findById(team._id));

  res.status(201).json({
    status: "success",
    message: "Team created successfully!",
    data: { team: populatedTeam },
  });
});

// 📌 Get user's team for a specific event
module.exports.getUserTeam = catchAsync(async (req, res, next) => {
  const { userId, eventId } = req.params;

  const team = await populateTeam(
    Team.findOne({
      event: eventId,
      members: userId,
    })
  );

  if (!team) {
    return next(new AppError("No team found for this user and event", 404));
  }

  res.status(200).json({
    status: "success",
    data: { team },
  });
});

// 📌 Update team details
module.exports.updateTeam = catchAsync(async (req, res, next) => {
  const { teamId } = req.params;
  const { name, description } = req.body;
  const userId = req.user._id;

  const team = await Team.findById(teamId);
  if (!team) return next(new AppError("Team not found", 404));

  if (team.leader.toString() !== userId.toString()) {
    return next(new AppError("Only team leaders can update team details", 403));
  }

  team.name = name.trim();
  team.description = description?.trim() || "";
  await team.save();

  const updatedTeam = await populateTeam(Team.findById(teamId));

  res.status(200).json({
    status: "success",
    message: "Team updated successfully!",
    data: { team: updatedTeam },
  });
});

// 📌 Remove member from team
module.exports.removeMember = catchAsync(async (req, res, next) => {
  const { teamId, memberId } = req.params;
  const userId = req.user._id;

  const team = await Team.findById(teamId);
  if (!team) return next(new AppError("Team not found", 404));

  if (team.leader.toString() !== userId.toString() && memberId !== userId.toString()) {
    return next(new AppError("Only team leaders or the member themselves can perform this action", 403));
  }

  if (memberId === team.leader.toString() && team.members.length > 1) {
    return next(new AppError("Team leader cannot be removed. Transfer leadership first.", 400));
  }

  team.members = team.members.filter((member) => member.toString() !== memberId);
  await team.save();

  if (team.members.length === 0) {
    await Team.findByIdAndDelete(teamId);
    return res.status(200).json({
      status: "success",
      message: "Team disbanded successfully!",
    });
  }

  const updatedTeam = await populateTeam(Team.findById(teamId));

  res.status(200).json({
    status: "success",
    message: "Member removed successfully!",
    data: { team: updatedTeam },
  });
});

// 📌 Get pending team requests for a user
module.exports.getTeamRequests = catchAsync(async (req, res, next) => {
  const { eventId } = req.params;
  const userId = req.user._id;

  const requests = await TeamRequest.find({
    to: userId,
    event: eventId,
    status: "pending",
  })
    .populate("team", "name description")
    .populate("from", "username email")
    .populate("event", "title")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    data: { requests },
  });
});

// 📌 Respond to team request
module.exports.respondToRequest = catchAsync(async (req, res, next) => {
  const { requestId } = req.params;
  const { action } = req.body; // 'accept' or 'reject'
  const userId = req.user._id;

  const request = await TeamRequest.findById(requestId).populate("team").populate("event");

  if (!request) return next(new AppError("Request not found", 404));

  if (request.to.toString() !== userId.toString()) {
    return next(new AppError("You can only respond to your own requests", 403));
  }

  if (request.status !== "pending") {
    return next(new AppError("Request has already been responded to", 400));
  }

  if (action === "accept") {
    const existingTeam = await Team.findOne({
      event: request.event._id,
      members: userId,
    });
    if (existingTeam) {
      return next(new AppError("You are already in a team for this event", 400));
    }

    if (request.team.members.length >= request.event.teamMax) {
      return next(new AppError("Team is already full", 400));
    }

    const team = await Team.findById(request.team._id);
    team.members.push(userId);
    await team.save();

    request.status = "accepted";
    await request.save();

    res.status(200).json({
      status: "success",
      message: "Request accepted successfully! You have joined the team.",
    });
  } else if (action === "reject") {
    request.status = "rejected";
    await request.save();

    res.status(200).json({
      status: "success",
      message: "Request rejected successfully.",
    });
  } else {
    return next(new AppError("Invalid action. Use 'accept' or 'reject'", 400));
  }
});

// 📌 Delete team
module.exports.deleteTeam = catchAsync(async (req, res, next) => {
  const { teamId } = req.params;
  const userId = req.user._id;

  const team = await Team.findById(teamId);
  if (!team) return next(new AppError("Team not found", 404));

  if (team.leader.toString() !== userId.toString()) {
    return next(new AppError("Only team leaders can delete the team", 403));
  }

  await TeamRequest.deleteMany({ team: teamId });
  await Team.findByIdAndDelete(teamId);

  res.status(200).json({
    status: "success",
    message: "Team deleted successfully!",
  });
});

// 📌 Get sent requests for a specific event
module.exports.getSentRequests = catchAsync(async (req, res, next) => {
  const { eventId } = req.params;
  const userId = req.user._id;

  const sentRequests = await TeamRequest.find({
    from: userId,
    event: eventId,
    status: "pending",
  }).populate("to", "username email");

  res.status(200).json({
    status: "success",
    data: { requests: sentRequests },
  });
});

// 📌 Send team invitation request
module.exports.sendTeamRequest = catchAsync(async (req, res, next) => {
  const { teamId, targetUserId, eventId, message } = req.body;
  const fromUserId = req.user._id;

  const team = await Team.findById(teamId).populate("members");
  if (!team) return next(new AppError("Team not found", 404));

  if (team.leader.toString() !== fromUserId.toString()) {
    return next(new AppError("Only team leaders can send invitations", 403));
  }

  const event = await Event.findById(eventId);
  if (!event) return next(new AppError("Event not found", 404));

  if (team.members.length >= event.teamMax) {
    return next(new AppError("Team is already full", 400));
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) return next(new AppError("Target user not found", 404));

  if (event.registeredUsers.includes(targetUserId)) {
    return next(new AppError("User is already registered for this event", 400));
  }

  const existingTeam = await Team.findOne({
    event: eventId,
    members: targetUserId,
  });

  if (existingTeam) {
    return next(new AppError("User is already in a team for this event", 400));
  }

  const existingRequest = await TeamRequest.findOne({
    team: teamId,
    to: targetUserId,
    event: eventId,
    status: "pending",
  });

  if (existingRequest) {
    return next(new AppError("Request already sent to this user", 400));
  }

  const teamRequest = await TeamRequest.create({
    team: teamId,
    from: fromUserId,
    to: targetUserId,
    event: eventId,
    message: message || "",
    status: "pending",
  });

  const sender = await User.findById(fromUserId);

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
              ${message
          ? `
                <div style="background-color: #fff; padding: 15px; border-left: 4px solid #6366f1; margin-bottom: 20px; border-radius: 4px;">
                  <p style="font-style: italic; color: #4b5563; margin: 0;">"${message}"</p>
                </div>
              `
          : ""
        }
            </div>
            
            <div style="text-align: center; margin-bottom: 20px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/notifications" style="display: inline-block; background-color: #6366f1; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
                View Invitation
              </a>
            </div>
            
            <div style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              <p>This is an automated message from Glubs Event Management System.</p>
              <p>If you didn't expect this invitation, you can safely ignore this email.</p>
            </div>
          </div>
        `,
    });
  } catch (emailError) {
    console.error("Error sending email notification:", emailError);
  }

  res.status(201).json({
    status: "success",
    message: "Team invitation sent successfully",
    data: { request: teamRequest },
  });
});
