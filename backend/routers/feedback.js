/**
 * feedback.js (router)
 * Routes for creating, reading, updating and deleting feedback.
 *
 * Route summary:
 *  - GET    /:id                -> get a specific feedback by id
 *  - PUT    /:id                -> update feedback by id
 *  - DELETE /:id                -> delete feedback by id
 *  - POST   /                   -> create a new feedback
 *  - GET    /event/:eventId     -> list feedbacks for a specific event
 *
 * Controllers are implemented in `backend/controllers/feedback.js`.
 */

const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback');

// ---------------------------------------------------------------------------
// GET /:id
// Purpose: Return a single feedback document by its id.
// Params: req.params.id (feedback ObjectId)
// Controller: feedbackController.showFeedback
// ---------------------------------------------------------------------------
router.get('/:id', feedbackController.showFeedback);

// ---------------------------------------------------------------------------
// PUT /:id
// Purpose: Update a feedback entry. Request body should contain updated fields.
// Controller: feedbackController.editFeedback
// ---------------------------------------------------------------------------
router.put('/:id', feedbackController.editFeedback);

// ---------------------------------------------------------------------------
// DELETE /:id
// Purpose: Delete a feedback entry by id.
// Controller: feedbackController.deleteFeedback
// ---------------------------------------------------------------------------
router.delete('/:id', feedbackController.deleteFeedback);

// ---------------------------------------------------------------------------
// POST /
// Purpose: Create a feedback entry. Request body should match Feedback schema.
// Controller: feedbackController.createFeedback
// ---------------------------------------------------------------------------
router.post('/', feedbackController.createFeedback);

// ---------------------------------------------------------------------------
// GET /event/:eventId
// Purpose: Return all feedbacks associated with a specific event.
// Params: req.params.eventId
// Controller: feedbackController.getFeedbacksByEvent
// ---------------------------------------------------------------------------
router.get('/event/:eventId', feedbackController.getFeedbacksByEvent);

module.exports = router;