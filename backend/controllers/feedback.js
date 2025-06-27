const feedback = require('../schema/feedback');

module.exports.showAllFeedbacks = async (req, res) => {
   const feedbacks = await Feedback.find({ event: req.params.eventId });
    res.json(feedbacks);
};


module.exports.createFeedback = async (req, res) => {
    try {
        const feedback = new Feedback(req.body);
        await feedback.save();
        res.status(201).json(feedback);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

