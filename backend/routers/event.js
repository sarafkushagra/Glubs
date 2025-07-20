const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event');
const {isAuthenticated} = require('../middlewares/auth');


router.get('/', eventController.showAllEvents);
router.post('/', eventController.createEvent);
router.get('/:id', eventController.showEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);
router.post('/verify', eventController.verifyEntry);
router.post('/:eventId/add-feedback', isAuthenticated, eventController.addFeedback);
router.get('/participated/:userid', eventController.getUserParticipatedEvents);
router.get('/upcoming/:userid', eventController.getUserUpcomingEvents);
router.get('/completed/:userid', eventController.getUserCompletedEvents);
router.post('/:id/register',isAuthenticated, eventController.registerUserToEvent);


module.exports = router;

