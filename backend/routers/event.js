const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event');

router.get('/', eventController.showAllEvents);
router.get('/:id', eventController.showEvent);
router.post('/', eventController.createEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;

