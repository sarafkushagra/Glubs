const Event = require("../schema/event");
const Feedback = require('../schema/feedback');
const mongoose = require('mongoose');

module.exports.showAllEvents = async (req, res) => {
    const events = await Event.find({});
    res.json(events);
};

module.exports.showEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // fetch feedbacks for this event, populating user info
        const feedbacks = await Feedback.find({ event: event._id })
            .populate('user', 'name email');

        res.json({ event, feedbacks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports.createEvent = async (req, res) => {
    try {
        // merge createdBy safely
        const eventData = {
            ...req.body,
            createdBy: req.user ? req.user._id : '662f0a93b46c5c5c77b59d29' // fallback ClubAdmin _id for testing
        };

        const newEvent = new Event(eventData);
        const savedEvent = await newEvent.save();

        res.status(201).json({
            message: 'Event created successfully!',
            event: savedEvent
        });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(400).json({
            message: "Error creating event",
            error: error.message
        });
    }
};

module.exports.updateEvent = async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body, // Ensure req.body contains the updated fields
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json({
            message: "Event updated successfully!",
            event: updatedEvent
        });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(400).json({ message: "Error updating event", error: error.message });
    }
};

module.exports.deleteEvent = async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);

        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json({ message: "Event deleted successfully!" });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(400).json({ message: "Error deleting event", error: error.message });
    }
};

module.exports.verifyEntry = async (req, res) => {
    const { eventId, participantId } = req.body;

    try {
        const event = await Event.findById(eventId).populate('registeredUsers.userId');

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found.' });
        }

        const participant = event.registeredUsers.find(
            user => user.userId && user.userId._id.toString() === participantId
        );

        if (!participant) {
            return res.json({ success: false, message: 'Participant not registered for this event.' });
        }

        if (participant.checkedIn) {
            return res.json({ success: false, message: 'Participant has already checked in.' });
        }

        participant.checkedIn = true;
        await event.save(); // Save the event to persist the checkedIn change

        res.json({
            success: true,
            participant: {
                name: participant.userId.name,
                email: participant.userId.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

module.exports.addFeedback = async (req, res) => {
    const { eventId } = req.params.id;
    const { review, rating } = req.body;

    console.log("eventId:", eventId);
    console.log("review:", review);
    console.log("rating:", rating);

    console.log("DEBUG: req.params =", req.params.id);
    console.log("DEBUG: req.url =", req.url);
    console.log("DEBUG: req.originalUrl =", req.originalUrl);




    try {
        const feedback = new Feedback({
            event: eventId,
            user: "666666666666666666666666", // TEMP: replace with a valid User _id from your DB
            review,
            rating
        });

        const savedFeedback = await feedback.save();

        res.status(201).json({
            message: "Feedback added successfully!",
            feedback: savedFeedback
        });
    } catch (error) {
        console.error('Error adding feedback:', error);
        res.status(500).json({ message: "Error adding feedback", error: error.message });
    }
};

module.exports.getUserParticipatedEvents = async (req, res) => {
    const { userid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userid)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    try {
        const events = await Event.find({ registeredUsers: userid })
            .select('title date venue eventType')
            .sort({ date: -1 }); // Latest first
        res.json(events);
    } catch (error) {
        console.error('Error fetching participated events:', error);
        res.status(500).json({ message: "Error fetching participated events", error: error.message });
    }
};

module.exports.getUserCompletedEvents = async (req, res) => {
    const { userid } = req.params;
    try {
        const events = await Event.find({
            registeredUsers: (userid),
            date: { $lt: new Date() }
        }).select('title date venue eventType').sort({ date: -1 });
        res.json(events);
    } catch (error) {
        console.error('Error fetching completed events:', error);
        res.status(500).json({ message: 'Error fetching completed events', error: error.message });
    }
};

module.exports.getUserUpcomingEvents = async (req, res) => {
    const { userid } = req.params;
    try {
        const events = await Event.find({
            registeredUsers: (userid),
            date: { $gte: new Date() }
        }).select('title date venue eventType').sort({ date: 1 });
        res.json(events);
    } catch (error) {
        console.error('Error fetching upcoming events:', error);
        res.status(500).json({ message: 'Error fetching upcoming events', error: error.message });
    }
};

// exports.registerUserToEvent = async (req, res) => {
//     const eventId = req.params.id;
//     const userId = req.user._id; // ensure req.user is populated correctly

//     try {
//         const event = await Event.findById(eventId);
//         if (!event) {
//             return res.status(404).json({ message: 'Event not found' });
//         }

//         // Defensive check
//         if (!event.registeredUsers) {
//             event.registeredUsers = [];
//         }

//         if (!event.registeredUsers.includes(userId)) {
//             event.registeredUsers.push(userId);
//             await event.save();
//         }

//         res.status(200).json({ message: 'Successfully registered for the event.' });
//     } catch (error) {
//         console.error('Error registering user to event:', error);
//         res.status(500).json({
//             message: 'Error registering user to event',
//             error: error.message,
//             stack: error.stack
//         });
//     }
// };

