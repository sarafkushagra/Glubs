const eventsStatsController = require('../schema/eventstats');

module.exports.showAllEventStats = async (req, res) => {
    try {
        const stats = await eventsStatsController.find({});
        res.json(stats);
    } catch (error) {
        console.error('Error fetching event stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports.showEventStats = async (req, res) => {
    try {
        const stats = await eventsStatsController.findById(req.params.id);
        if (!stats) {
            return res.status(404).json({ message: 'Event stats not found' });
        }
        res.json(stats);
    } catch (error) {
        console.error('Error fetching event stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};  

module.exports.createEventStats = async (req, res) => {
    try {
        const newStats = new eventsStatsController(req.body);
        const savedStats = await newStats.save();
        res.status(201).json({
            message: 'Event stats created successfully!',
            stats: savedStats
        });
    } catch (error) {
        console.error('Error creating event stats:', error);
        res.status(400).json({
            message: 'Error creating event stats',
            error: error.message
        });
    }
};

module.exports.updateEventStats = async (req, res) => {
    try {
        const updatedStats = await eventsStatsController.findByIdAndUpdate(
            req.params.id,
            req.body, // Ensure req.body contains the updated fields
            { new: true, runValidators: true }
        );

        if (!updatedStats) {
            return res.status(404).json({ message: 'Event stats not found' });
        }

        res.json({
            message: 'Event stats updated successfully!',
            stats: updatedStats
        });
    } catch (error) {
        console.error('Error updating event stats:', error);
        res.status(400).json({ message: 'Error updating event stats', error: error.message });
    }
};

module.exports.deleteEventStats = async (req, res) => {
    try {
        const deletedStats = await eventsStatsController.findByIdAndDelete(req.params.id);

        if (!deletedStats) {
            return res.status(404).json({ message: 'Event stats not found' });
        }

        res.json({
            message: 'Event stats deleted successfully!',
            stats: deletedStats
        });
    } catch (error) {
        console.error('Error deleting event stats:', error);
        res.status(400).json({ message: 'Error deleting event stats', error: error.message });
    }
};