/**
 * event.js (router)
 * Routes for event management: listing, CRUD, registration and feedback endpoints.
 *
 * Route summary (paths below reflect typical usage):
 *  - GET    /                     -> list all events
 *  - POST   /                     -> create event (authenticated)
 *  - GET    /:id                  -> get event details
 *  - PUT    /:id                  -> update event
 *  - DELETE /:id                  -> delete event
 *  - POST   /:eventId/add-feedback -> add feedback to an event (authenticated)
 *  - GET    /participated/:userid -> list events a user participated in
 *  - GET    /upcoming/:userid     -> list a user's upcoming events
 *  - GET    /completed/:userid    -> list a user's completed events
 *  - POST   /:id/register         -> register authenticated user to event
 *  - POST   /:eventId/register-team -> register a team to an event (authenticated)
 *  - GET    /club/:clubId         -> list events belonging to a club (authenticated)
 *
 * Notes:
 *  - Authenticated routes use `isAuthenticated` middleware which attaches `req.user`.
 *  - Controllers are in `backend/controllers/event.js` and handle validation and response shapes.
 */

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event');
const { isAuthenticated } = require('../middlewares/auth');

// ---------------------------------------------------------------------------
// Public: list all events
// GET /
// Controller: eventController.showAllEvents
// ---------------------------------------------------------------------------
router.get('/', eventController.showAllEvents);

// ---------------------------------------------------------------------------
// Create an event (authenticated)
// POST /
// Middleware: isAuthenticated
// Controller: eventController.createEvent
// ---------------------------------------------------------------------------
router.post('/', isAuthenticated, eventController.createEvent);

// ---------------------------------------------------------------------------
// Event CRUD by id
// GET    /:id    -> show event details
// PUT    /:id    -> update event
// DELETE /:id    -> delete event
// ---------------------------------------------------------------------------
router.get('/:id', eventController.showEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

// ---------------------------------------------------------------------------
// Feedback: add feedback to an event
// POST /:eventId/add-feedback
// Middleware: isAuthenticated
// Controller: eventController.addFeedback
// ---------------------------------------------------------------------------
router.post('/:eventId/add-feedback', isAuthenticated, eventController.addFeedback);

// ---------------------------------------------------------------------------
// User-specific event lists
// GET /participated/:userid -> events user participated in
// GET /upcoming/:userid     -> user's upcoming events
// GET /completed/:userid    -> user's completed events
// ---------------------------------------------------------------------------
router.get('/participated/:userid', eventController.getUserParticipatedEvents);
router.get('/upcoming/:userid', eventController.getUserUpcomingEvents);
router.get('/completed/:userid', eventController.getUserCompletedEvents);

// ---------------------------------------------------------------------------
// Registration endpoints
// POST /:id/register            -> register the authenticated user to an event
// POST /:eventId/register-team  -> register a team to an event (authenticated)
// ---------------------------------------------------------------------------
router.post('/:id/register', isAuthenticated, eventController.registerUserToEvent);
router.post('/:eventId/register-team', isAuthenticated, eventController.registerTeamToEvent);

// ---------------------------------------------------------------------------
// Club-scoped events
// GET /club/:clubId -> list events for a specific club (requires auth)
// ---------------------------------------------------------------------------
router.get('/club/:clubId', isAuthenticated, eventController.getEventsByClub);

module.exports = router;

