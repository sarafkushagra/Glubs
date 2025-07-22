const Event = require("../schema/event");
const Feedback = require("../schema/feedback")
const Team = require("../schema/team")
const mongoose = require("mongoose");

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
  try {
    console.log("Incoming event payload:", req.body);
    const {
      title,
      description,
      details,
      eventType,
      date,
      venue,
      mode,
      visibility,
      opportunityType,
      categories,
      skillsToBeAssessed,
      website,
      festival,
      participationType,
      teamMin,
      teamMax,
      registrationStart,
      registrationEnd,
      registrationLimit,
      hideContact
    } = req.body;
    const event = new Event({
      title,
      description,
      details,
      eventType,
      date,
      venue,
      mode,
      visibility,
      opportunityType,
      categories,
      skillsToBeAssessed,
      website,
      festival,
      participationType,
      teamMin,
      teamMax,
      registrationStart,
      registrationEnd,
      registrationLimit,
      hideContact,
      createdBy: req.user
    });

    const savedEvent = await event.save();
    res.status(201).json({ message: "Event created successfully!", event: savedEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(400).json({ message: "Error creating event", error: error.message });
  }
};


// 📌 Update Event
module.exports.updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEvent) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event updated successfully!", event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(400).json({ message: "Error updating event", error: error.message });
  }
};

// 📌 Delete Event
module.exports.deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted successfully!" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(400).json({ message: "Error deleting event", error: error.message });
  }
};

// 📌 Verify Entry
module.exports.verifyEntry = async (req, res) => {
  const { eventId, participantId } = req.body;
  try {
    const event = await Event.findById(eventId).populate("registeredUsers.userId");
    if (!event) return res.status(404).json({ success: false, message: "Event not found." });

    const participant = event.registeredUsers.find(
      (user) => user.userId && user.userId._id.toString() === participantId
    );

    if (!participant) return res.json({ success: false, message: "Participant not registered for this event." });
    if (participant.checkedIn) return res.json({ success: false, message: "Participant has already checked in." });

    participant.checkedIn = true;
    await event.save();

    res.json({
      success: true,
      participant: {
        name: participant.userId.name,
        email: participant.userId.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error." });
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

// 📌 Register User to Event
exports.registerUserToEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.registeredUsers.includes(req.user._id)) {
      return res.status(400).json({ message: "User already registered" });
    }

    event.registeredUsers.push(req.user._id);
    await event.save();
    res.json({ message: "User registered successfully", updatedEvent: event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




// // Register entire team for an event
// module.exports.registerTeamToEvent = async (req, res) => {
//   try {
//     const { eventId } = req.params
//     const { teamId } = req.body
//     const userId = req.user._id

//     // Find the event
//     const event = await Event.findById(eventId)
//     if (!event) {
//       return res.status(404).json({ message: "Event not found" })
//     }

//     // Find the team
//     const team = await Team.findById(teamId).populate("members")
//     if (!team) {
//       return res.status(404).json({ message: "Team not found" })
//     }

//     // Check if user is team leader
//     if (team.leader.toString() !== userId.toString()) {
//       return res.status(403).json({ message: "Only team leaders can register the team" })
//     }

//     // Check team size requirements
//     if (team.members.length < event.teamMin) {
//       return res.status(400).json({
//         message: `Team needs at least ${event.teamMin} members. Current: ${team.members.length}`,
//       })
//     }

//     if (team.members.length > event.teamMax) {
//       return res.status(400).json({
//         message: `Team exceeds maximum size of ${event.teamMax} members. Current: ${team.members.length}`,
//       })
//     }

//     // Check if any team member is already registered
//     const memberIds = team.members.map((member) => member._id.toString())
//     const alreadyRegistered = memberIds.some((memberId) =>
//       event.registeredUsers.some((regUserId) => regUserId.toString() === memberId),
//     )

//     if (alreadyRegistered) {
//       return res.status(400).json({ message: "One or more team members are already registered" })
//     }

//     // Register all team members
//     event.registeredUsers.push(...memberIds)
//     event.registrations = (event.registrations || 0) + team.members.length

//     await event.save()

//     res.json({
//       message: "Team registered successfully!",
//       registeredMembers: team.members.length,
//       teamName: team.name,
//     })
//   } catch (error) {
//     console.error("Error registering team:", error)
//     res.status(500).json({ message: "Error registering team", error: error.message })
//   }
// }

// Enhanced share event functionality
module.exports.shareEventToWhatsApp = (event) => {
  const eventUrl = `${window.location.origin}/events/${event._id}`
  const message = `🎉 *${event.title}* - Amazing Event Alert! 🎉

📅 *Date:* ${new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })}

📍 *Mode:* ${event.mode || "Online"}
${event.venue ? `🏢 *Venue:* ${event.venue}\n` : ""}
${event.prizePool ? `💰 *Prize Pool:* ₹${event.prizePool.toLocaleString()}\n` : ""}
👥 *Participation:* ${event.participationType || "Individual"}
${event.participationType === "Team" ? `👥 *Team Size:* ${event.teamMin}-${event.teamMax} members\n` : ""}

📝 *Description:*
${event.description ? event.description.substring(0, 150) + "..." : "Join this exciting event!"}

🔗 *Register Now:* ${eventUrl}

#Glubs #Events #${event.eventType || "Competition"} #StudentLife`

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, "_blank")
}

// Add this to your existing event controller exports


// Add this method to your existing event controller

// Register entire team for an event
module.exports.registerTeamToEvent = async (req, res) => {
  try {
    const { eventId } = req.params
    const { teamId } = req.body
    const userId = req.user._id

    const Event = require("../schema/event")
    const Team = require("../schema/team")

    // Find the event
    const event = await Event.findById(eventId)
    if (!event) {
      return res.status(404).json({ message: "Event not found" })
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

    // Register all team members
    event.registeredUsers.push(...memberIds)
    event.registrations = (event.registrations || 0) + team.members.length

    await event.save()

    res.json({
      message: "Team registered successfully!",
      registeredMembers: team.members.length,
    })
  } catch (error) {
    console.error("Error registering team:", error)
    res.status(500).json({ message: "Error registering team", error: error.message })
  }
}
