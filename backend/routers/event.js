const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event');

router.get('/', eventController.showAllEvents);
router.get('/details/:id', eventController.showEvent);
router.get('/create/new', eventController.showCreateEventForm);
router.post('/', eventController.createEvent);
router.get('/:id', eventController.showEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;

