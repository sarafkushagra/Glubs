/**
 * feedback.js
 * Controller for managing Feedback documents.
 *
 * Responsibilities:
 *  - Create feedback entries
 *  - Retrieve feedbacks for an event
 *  - Show, edit, and delete individual feedback items
 *
 * Notes:
 *  - Handlers return JSON responses and use HTTP status codes to indicate success or failure.
 *  - Errors are returned with a message and (in some cases) an error detail string.
 */

const Feedback = require('../schema/feedback');

// ---------------------------------------------------------------------------
// createFeedback
// Purpose: Create and persist a new Feedback document from request body data.
// Request body: should contain the feedback fields expected by the Feedback schema
// Response: 201 with the created feedback on success
// Errors: 400 returned when saving fails (validation or bad input)
// ---------------------------------------------------------------------------
exports.createFeedback = async (req, res) => {
  try {
    const feedback = new Feedback(req.body);
    await feedback.save();
    res.status(201).json(feedback);
  } catch (err) {
    // Save failed (validation or DB error)
    res.status(400).json({ message: "Failed to submit feedback", error: err.message });
  }
};

// ---------------------------------------------------------------------------
// getFeedbacksByEvent
// Purpose: Return all feedback documents associated with a given event id.
// Request params: { eventId }
// Response: 200 with an array of feedback objects
// Errors: 500 on unexpected DB errors
// ---------------------------------------------------------------------------
exports.getFeedbacksByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const feedbacks = await Feedback.find({ eventId });
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch feedbacks", error: err.message });
  }
};

// ---------------------------------------------------------------------------
// showFeedback
// Purpose: Fetch a single feedback by its id and return it.
// Request params: req.params.id (feedback ObjectId)
// Response: 200 with feedback object, or 404 if not found
// ---------------------------------------------------------------------------
module.exports.showFeedback = async (req, res) => {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
        return res.status(404).json({ message: "Feedback not found" });
    }
    res.json(feedback);
}

// ---------------------------------------------------------------------------
// editFeedback
// Purpose: Update an existing feedback document with provided fields and return the updated doc.
// Request params: req.params.id
// Request body: fields to update
// Response: 200 with updated feedback, or 404 if no feedback exists
// Errors: 400 for invalid update or DB validation errors
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// deleteFeedback
// Purpose: Remove a feedback document by id.
// Request params: req.params.id
// Response: 200 with confirmation message, or 404 if feedback not found
// Errors: 400 for DB errors during deletion
// ---------------------------------------------------------------------------
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