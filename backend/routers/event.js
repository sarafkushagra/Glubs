const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event');

router.get('/', eventController.showAllEvents);
router.post('/', eventController.createEvent);
router.get('/:id', eventController.showEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);
router.post('/verify', eventController.verifyEntry);

module.exports = router;

