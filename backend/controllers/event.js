const Event = require("../schema/event");
const Feedback = require("../schema/feedback")
const mongoose = require("mongoose");
const Club = require("../schema/club");
const EventAttendance = require("../schema/eventAttendance");
const { generateQRToken, generateQRCodeImage, generateQRCodeBuffer } = require("../utils/qrCode");
const sendEmail = require("../utils/email");

// 📌 Show All Events
module.exports.showAllEvents = async (req, res) => {
  const events = await Event.find({});
  res.json(events);
};

// 📌 Show Event Details with Feedback
module.exports.showEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'username');
    if (!event) return res.status(404).json({ message: "Event not found" });
    const feedbacks = await Feedback.find({ event: event._id }).populate("user");
    res.json({ event, feedbacks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 Create Event with Host Fields
module.exports.createEvent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { title, description, details, eventType, date, venue, mode, visibility, categories, skillsToBeAssessed, website, festival, participationType, teamMin, teamMax, registrationStart, registrationEnd, registrationLimit, hideContact, prizePool, eligibility, rules, contactEmail, contactPhone, logo, club, registrationFee } = req.body;

    const clubDoc = await Club.findById(club).session(session);
    if (!clubDoc) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Club not found" });
    }

    // Check if user is admin of this specific club
    const isClubAdmin = req.user.adminOfClubs?.some(
      adminClubId => adminClubId.toString() === club.toString()
    );

    // System admins can create events for any club
    const isSystemAdmin = req.user.role === 'admin';

    if (!isClubAdmin && !isSystemAdmin) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        message: "Only club admins can create events for this club"
      });
    }

    // Create the event
    const event = new Event({ title, description, details, eventType, date, venue, mode, visibility, categories, skillsToBeAssessed, website, festival, participationType, teamMin: participationType === "Individual" ? null : teamMin, teamMax: participationType === "Individual" ? null : teamMax, registrationStart, registrationEnd, registrationLimit, hideContact, prizePool, eligibility, rules, contactEmail, contactPhone, logo, createdBy: req.user, club: club, registrationFee });

    const savedEvent = await event.save({ session });

    await Club.findByIdAndUpdate(
      club,
      { $push: { events: savedEvent._id } },
      { session }
    );

    console.log("Club updated with event ID"); // Debug log

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Event created successfully!",
      event: savedEvent
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error creating event:", error);
    res.status(400).json({
      message: "Error creating event",
      error: error.message
    });
  }
};

// 📌 Update Event
module.exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if user is the event creator
    const isCreator = event.createdBy.toString() === req.user._id.toString();

    // Check if user is admin of the event's club
    const isClubAdmin = event.club && req.user.adminOfClubs?.some(
      adminClubId => adminClubId.toString() === event.club.toString()
    );

    // System admins can update any event
    const isSystemAdmin = req.user.role === 'admin';

    if (!isCreator && !isClubAdmin && !isSystemAdmin) {
      return res.status(403).json({
        message: "You don't have permission to update this event"
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json({ message: "Event updated successfully!", event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(400).json({ message: "Error updating event", error: error.message });
  }
};

// 📌 Delete Event
module.exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if user is the event creator
    const isCreator = event.createdBy.toString() === req.user._id.toString();

    // Check if user is admin of the event's club
    const isClubAdmin = event.club && req.user.adminOfClubs?.some(
      adminClubId => adminClubId.toString() === event.club.toString()
    );

    // System admins can delete any event
    const isSystemAdmin = req.user.role === 'admin';

    if (!isCreator && !isClubAdmin && !isSystemAdmin) {
      return res.status(403).json({
        message: "You don't have permission to delete this event"
      });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted successfully!" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(400).json({ message: "Error deleting event", error: error.message });
  }
};

// 📌 Add Feedback
module.exports.addFeedback = async (req, res) => {
  try {
    const { review, rating } = req.body;
    const { eventId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) return res.status(400).json({ message: "Invalid event ID" });
    if (!req.user || !req.user._id) return res.status(401).json({ message: "User not authenticated" });
    const feedback = new Feedback({
      review,
      rating,
      event: eventId,
      user: req.user._id
    });
    await feedback.save();
    res.status(201).json({ message: "Feedback added successfully", feedback });
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 User's Participated Events
module.exports.getUserParticipatedEvents = async (req, res) => {
  const { userid } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userid)) return res.status(400).json({ message: "Invalid user ID" });
  try {
    const events = await Event.find({ registeredUsers: userid })
      .select("title date venue eventType")
      .sort({ date: -1 });
    res.json(events);
  } catch (error) {
    console.error("Error fetching participated events:", error);
    res.status(500).json({ message: "Error fetching participated events", error: error.message });
  }
};

// 📌 User's Completed Events
module.exports.getUserCompletedEvents = async (req, res) => {
  const { userid } = req.params;
  try {
    const events = await Event.find({
      registeredUsers: userid,
      date: { $lt: new Date() }
    }).select("title date venue eventType").sort({ date: -1 });
    res.json(events);
  } catch (error) {
    console.error("Error fetching completed events:", error);
    res.status(500).json({ message: "Error fetching completed events", error: error.message });
  }
};

// 📌 User's Upcoming Events
module.exports.getUserUpcomingEvents = async (req, res) => {
  const { userid } = req.params;
  try {
    const events = await Event.find({
      registeredUsers: userid,
      date: { $gte: new Date() }
    }).select("title date venue eventType").sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    res.status(500).json({ message: "Error fetching upcoming events", error: error.message });
  }
};

// 📌 Register User to Event (with QR Code Generation)
exports.registerUserToEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('club', 'name');
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Restrict registration to Student role only
    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Only students can register for events. Administrators can view and manage events but cannot participate."
      });
    }

    // Payment Enforcement for Paid Events
    if (event.registrationFee > 0) {
      const Payment = require("../schema/payment");
      const paymentRecord = await Payment.findOne({
        user: req.user._id,
        event: event._id,
        status: "captured",
        registrationType: "individual"
      });

      if (!paymentRecord) {
        return res.status(402).json({
          message: "Payment required. Please complete the transaction via Razorpay.",
          requiresPayment: true
        });
      }
    }

    // Generate unique QR token for this registration
    const qrToken = generateQRToken(event._id.toString(), req.user._id.toString());

    // Create attendance record
    const attendance = new EventAttendance({
      event: event._id,
      user: req.user._id,
      qrToken,
      registrationType: 'individual',
    });

    await attendance.save();

    // Add user to event's registered users
    event.registeredUsers.push(req.user._id);
    await event.save();

    // Send email with QR code via Public API (100% compatible with all email clients)
    try {
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrToken)}`;

      await sendEmail({
        email: req.user.email,
        subject: `Registration Confirmed: ${event.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 8px; background-color: #f9f9f9; color: #333; border: 1px solid #ddd;">
            <h2 style="color: #569c9fff;">🎉 Registration Confirmed!</h2>
            <p>Hello ${req.user.username},</p>
            <p>You have successfully registered for <strong>${event.title}</strong>.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <h3 style="color: #528b83ff; margin-top: 0;">Your Event QR Code</h3>
              <p>Present this QR code at the event for attendance verification:</p>
              <img src="${qrCodeUrl}" alt="Event QR Code" style="max-width: 300px; margin: 20px auto; display: block;" />
              <p style="font-size: 0.9em; color: #666; margin-top: 20px;">
                <strong>Event Details:</strong><br/>
                📅 Date: ${event.date ? new Date(event.date).toLocaleDateString() : 'TBA'}<br/>
                📍 Venue: ${event.venue || 'TBA'}<br/>
                🏢 Club: ${event.club?.name || 'N/A'}
              </p>
            </div>

            <p style="font-size: 0.9em; color: #666;">
              <strong>Important:</strong> Save this QR code or present this email at the event entrance for check-in.
            </p>
            
            <hr style="margin: 30px 0;" />
            <p style="font-size: 0.9em; color: #888;">— The Glubs Team</p>
          </div>
        `,
      });

      console.log(`✅ QR code email sent to ${req.user.email}`);
    } catch (emailError) {
      console.error('Error sending QR code email:', emailError);
      // Don't fail the registration if email fails
    }

    res.json({
      message: "User registered successfully",
      updatedEvent: event,
      qrToken // Return token for immediate display if needed
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


module.exports.registerTeamToEvent = async (req, res) => {
  try {
    const { eventId } = req.params
    const { teamId } = req.body
    const userId = req.user._id
    const Event = require("../schema/event")
    const Team = require("../schema/team")
    const User = require("../schema/user")

    // Find the event
    const event = await Event.findById(eventId).populate('club', 'name')
    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    // Restrict registration to Student role only
    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Only students can register for events."
      });
    }

    // Payment Enforcement for Paid Events (Team)
    if (event.registrationFee > 0) {
      const Payment = require("../schema/payment");
      const paymentRecord = await Payment.findOne({
        user: userId, // The leader pays
        event: event._id,
        team: teamId,
        status: "captured",
        registrationType: "team"
      });

      if (!paymentRecord) {
        return res.status(402).json({
          message: "Payment required for team registration. Please complete the transaction.",
          requiresPayment: true
        });
      }
    }

    // Find the team
    const team = await Team.findById(teamId).populate("members")
    if (!team) {
      return res.status(404).json({ message: "Team not found" })
    }

    // Check if user is team leader
    if (team.leader.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only team leaders can register the team" })
    }

    // Check team size requirements
    if (team.members.length < event.teamMin) {
      return res.status(400).json({
        message: `Team needs at least ${event.teamMin} members. Current: ${team.members.length}`,
      })
    }

    if (team.members.length > event.teamMax) {
      return res.status(400).json({
        message: `Team exceeds maximum size of ${event.teamMax} members. Current: ${team.members.length}`,
      })
    }

    // Check if any team member is already registered
    const memberIds = team.members.map((member) => member._id.toString())
    const alreadyRegistered = memberIds.some((memberId) =>
      event.registeredUsers.some((regUserId) => regUserId.toString() === memberId),
    )

    if (alreadyRegistered) {
      return res.status(400).json({ message: "One or more team members are already registered" })
    }

    // Register all team members and generate QR codes
    const qrCodePromises = [];

    for (const member of team.members) {
      // Generate unique QR token for each team member
      const qrToken = generateQRToken(event._id.toString(), member._id.toString());

      // Create attendance record for each member
      const attendance = new EventAttendance({
        event: event._id,
        user: member._id,
        qrToken,
        registrationType: 'team',
        teamId: team._id,
      });

      await attendance.save();

      // Generate and send QR code email to each member
      qrCodePromises.push(
        (async () => {
          try {
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrToken)}`;

            await sendEmail({
              email: member.email,
              subject: `Team Registration Confirmed: ${event.title}`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 8px; background-color: #f9f9f9; color: #333; border: 1px solid #ddd;">
                  <h2 style="color: #569c9fff;">🎉 Team Registration Confirmed!</h2>
                  <p>Hello ${member.username},</p>
                  <p>Your team <strong>${team.name}</strong> has been successfully registered for <strong>${event.title}</strong>.</p>
                  
                  <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                    <h3 style="color: #528b83ff; margin-top: 0;">Your Personal Event QR Code</h3>
                    <p>Present this QR code at the event for attendance verification:</p>
                    <img src="${qrCodeUrl}" alt="Event QR Code" style="max-width: 300px; margin: 20px auto; display: block;" />
                    <p style="font-size: 0.9em; color: #666; margin-top: 20px;">
                      <strong>Event Details:</strong><br/>
                      📅 Date: ${event.date ? new Date(event.date).toLocaleDateString() : 'TBA'}<br/>
                      📍 Venue: ${event.venue || 'TBA'}<br/>
                      🏢 Club: ${event.club?.name || 'N/A'}<br/>
                      👥 Team: ${team.name}
                    </p>
                  </div>

                  <p style="font-size: 0.9em; color: #666;">
                    <strong>Important:</strong> Each team member has a unique QR code. Save this QR code or present this email at the event entrance for check-in.
                  </p>
                  
                  <hr style="margin: 30px 0;" />
                  <p style="font-size: 0.9em; color: #888;">— The Glubs Team</p>
                </div>
              `,
            });

            console.log(`✅ QR code email sent to ${member.email}`);
          } catch (emailError) {
            console.error(`Error sending QR code email to ${member.email}:`, emailError);
          }
        })()
      );
    }

    // Register all team members
    event.registeredUsers.push(...memberIds)
    event.registrations = (event.registrations || 0) + team.members.length

    await event.save()

    // Wait for all emails to be sent (don't block response)
    Promise.all(qrCodePromises).catch(err =>
      console.error('Error sending some QR code emails:', err)
    );

    res.json({
      message: "Team registered successfully! QR codes sent to all members.",
      registeredMembers: team.members.length,
    })
  } catch (error) {
    console.error("Error registering team:", error)
    res.status(500).json({ message: "Error registering team", error: error.message })
  }
}

module.exports.getEventsByClub = async (req, res) => {
  try {
    const { clubId } = req.params;

    const club = await Club.findById(clubId).populate({
      path: 'events',
      populate: {
        path: 'createdBy',
        select: 'username email'
      }
    });

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    res.status(200).json({
      message: "Events fetched successfully",
      events: club.events,
      club: {
        id: club._id,
        name: club.name,
        description: club.description
      }
    });
  } catch (error) {
    console.error("Error fetching club events:", error);
    res.status(500).json({
      message: "Error fetching events",
      error: error.message
    });
  }
};