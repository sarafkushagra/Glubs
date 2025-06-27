const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event');

router.get('/event', eventController.showAllEvents);
router.get('/event/:id', eventController.showEvent);
router.post('/event', eventController.createEvent);
router.put('/event/:id', eventController.updateEvent);
router.delete('/event/:id', eventController.deleteEvent);

module.exports = router;

