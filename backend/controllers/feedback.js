const Feedback = require('../schema/feedback');

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