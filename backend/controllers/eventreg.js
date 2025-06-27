const EventRegistration = require('../schema/eventregistration');


module.exports.showAllEventRegistrations = async (req, res) => {
    try {
        const registrations = await EventRegistration.find({});
        res.json(registrations);
    } catch (error) {
        console.error('Error fetching event registrations:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.showEventRegistration = async (req, res) => {
    try {
        const registration = await EventRegistration.findById(req.params.id);
        if (!registration) {
            return res.status(404).json({ message: 'Event registration not found' });
        }
        res.json(registration);
    } catch (error) {
        console.error('Error fetching event registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.createEventRegistration = async (req, res) => {
    try {
        const newRegistration = new EventRegistration(req.body);
        const savedRegistration = await newRegistration.save();
        res.status(201).json({
            message: 'Event registration created successfully!',
            registration: savedRegistration
        });
    } catch (error) {
        console.error('Error creating event registration:', error);
        res.status(400).json({
            message: 'Error creating event registration',
            error: error.message
        });
    }
};

module.exports.updateEventRegistration = async (req, res) => {
    try {
        const updatedRegistration = await EventRegistration.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedRegistration) {
            return res.status(404).json({ message: 'Event registration not found' });
        }

        res.json({
            message: 'Event registration updated successfully!',
            registration: updatedRegistration
        });
    } catch (error) {
        console.error('Error updating event registration:', error);
        res.status(400).json({ message: 'Error updating event registration', error: error.message });
    }
};

module.exports.deleteEventRegistration = async (req, res) => {
    try {
        const deletedRegistration = await EventRegistration.findByIdAndDelete(req.params.id);

        if (!deletedRegistration) {
            return res.status(404).json({ message: 'Event registration not found' });
        }

        res.json({
            message: 'Event registration deleted successfully!',
            registration: deletedRegistration
        });
    } catch (error) {
        console.error('Error deleting event registration:', error);
        res.status(400).json({ message: 'Error deleting event registration', error: error.message });
    }
};