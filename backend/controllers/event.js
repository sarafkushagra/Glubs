const Event = require("../schema/event");

module.exports.showCreateEventForm = (req, res) => {
    res.render("html/createEvent.ejs");
};

module.exports.showAllEvents = async (req, res) => {
    const events = await Event.find({});
    res.json(events);
    // res.render("html/events.ejs", { events: events });
};

module.exports.showEvent = async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }
    // res.json(event);
    res.render("html/eventDetails.ejs", { event: event });
};

module.exports.createEvent = async (req, res) => {
    try {
        const newEvent = new Event(req.body);
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
