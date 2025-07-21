const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event');
const { isAuthenticated, restrictTo } = require("../middlewares/auth");

router.get('/', eventController.showAllEvents);
router.post('/', isAuthenticated, restrictTo(["club-admin", "admin"]),eventController.createEvent);
router.get('/:id', isAuthenticated,eventController.showEvent);
router.put('/:id',isAuthenticated, restrictTo(["club-admin", "admin"]), eventController.updateEvent);
router.delete('/:id', isAuthenticated, restrictTo(["club-admin", "admin"]),eventController.deleteEvent);
router.post('/verify',isAuthenticated, restrictTo(["club-admin", "admin"]), eventController.verifyEntry);
router.post('/:eventId/add-feedback', isAuthenticated, eventController.addFeedback);
router.get('/participated/:userid', isAuthenticated, restrictTo(["club-admin", "admin"]),eventController.getUserParticipatedEvents);
router.get('/upcoming/:userid',isAuthenticated, eventController.getUserUpcomingEvents);
router.get('/completed/:userid',isAuthenticated, eventController.getUserCompletedEvents);
router.post('/:id/register',isAuthenticated, eventController.registerUserToEvent);


module.exports = router;

