const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event');
const {isAuthenticated} = require('../middlewares/auth');
const { eventValidation, handleValidationErrors } = require('../middlewares/validation');

router.get('/', eventController.showAllEvents);
router.post('/', isAuthenticated, eventValidation.create, handleValidationErrors, eventController.createEvent);
router.get('/:id', eventController.showEvent);
router.put('/:id', isAuthenticated, eventValidation.update, handleValidationErrors, eventController.updateEvent);
router.delete('/:id', isAuthenticated, eventController.deleteEvent);
router.post('/:eventId/add-feedback', isAuthenticated, eventController.addFeedback);
router.get('/participated/:userid', eventController.getUserParticipatedEvents);
router.get('/upcoming/:userid', eventController.getUserUpcomingEvents);
router.get('/completed/:userid', eventController.getUserCompletedEvents);
router.post('/:id/register',isAuthenticated, eventController.registerUserToEvent);
router.post("/:eventId/register-team", isAuthenticated, eventController.registerTeamToEvent)
router.get('/club/:clubId',isAuthenticated, eventController.getEventsByClub);

module.exports = router;


