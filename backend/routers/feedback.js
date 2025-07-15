const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback');

// Route to get all feedbacks for a specific event
router.get('/view/:eventId', feedbackController.showAllFeedbacks);  
router.post('/', feedbackController.createFeedback);

module.exports = router;