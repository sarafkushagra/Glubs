const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback');

const { isAuthenticated } = require("../middlewares/auth");

router.get('/:id',isAuthenticated, feedbackController.showFeedback);
router.put('/:id',isAuthenticated, feedbackController.editFeedback);
router.delete('/:id',isAuthenticated, feedbackController.deleteFeedback);

module.exports = router;