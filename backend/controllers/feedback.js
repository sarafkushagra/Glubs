const Feedback = require('../schema/feedback');

exports.createFeedback = async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json(feedback);
  } catch (err) {
    res.status(400).json({ message: "Failed to submit feedback", error: err.message });
  }
};

exports.getFeedbacksByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const feedbacks = await Feedback.find({ eventId });
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch feedbacks", error: err.message });
  }
};

module.exports.showFeedback = async (req, res) => {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
        return res.status(404).json({ message: "Feedback not found" });
    }
    res.json(feedback);
}

module.exports.editFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }   
        res.json(feedback);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports.deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);
        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }
        res.json({ message: "Feedback deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}