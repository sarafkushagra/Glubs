const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback');

router.get('/event/:eventId', feedbackController.getFeedbacksByEvent);
router.get('/:id', feedbackController.showFeedback);
router.put('/:id', feedbackController.editFeedback);
router.delete('/:id', feedbackController.deleteFeedback);
router.post('/', feedbackController.createFeedback);



module.exports = router;
