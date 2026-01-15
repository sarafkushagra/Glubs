/**
 * event.js (router)
 * Routes for event management: listing, CRUD, registration and feedback endpoints.
 *
 * Route summary (paths below reflect typical usage):
 *  - GET    /                     -> list all events
 *  - POST   /                     -> create event (club-admin or admin only)
 *  - GET    /participated/:userid -> list events a user participated in
 *  - GET    /upcoming/:userid     -> list a user's upcoming events
 *  - GET    /completed/:userid    -> list a user's completed events
 *  - GET    /club/:clubId         -> list events belonging to a club
 *  - POST   /:id/register         -> register authenticated user to event
 *  - POST   /:eventId/register-team -> register a team to an event
 *  - POST   /:eventId/add-feedback -> add feedback to an event
 *  - GET    /:id                  -> get event details
 *  - PUT    /:id                  -> update event (club-admin or admin only)
 *  - DELETE /:id                  -> delete event (club-admin or admin only)
 *
 * Notes:
 *  - Routes are ordered to prevent conflicts (specific routes before :id parameter routes)
 *  - Authenticated routes use `isAuthenticated` middleware which attaches `req.user`
 *  - Some routes use `restrictTo` for role-based authorization
 *  - Controllers handle additional authorization logic (e.g., club admin verification)
 */

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event');
const { isAuthenticated, restrictTo } = require('../middlewares/auth');

// ---------------------------------------------------------------------------
// Public: list all events
// GET /
// Controller: eventController.showAllEvents
// ---------------------------------------------------------------------------
router.get('/', eventController.showAllEvents);

// ---------------------------------------------------------------------------
// Create an event (club-admin or admin only)
// POST /
// Middleware: isAuthenticated, restrictTo('club-admin', 'admin')
// Controller: eventController.createEvent
// ---------------------------------------------------------------------------
router.post('/', isAuthenticated, restrictTo('club-admin', 'admin'), eventController.createEvent);

// ---------------------------------------------------------------------------
// User-specific event lists (MUST come before /:id to avoid route conflicts)
// GET /participated/:userid -> events user participated in
// GET /upcoming/:userid     -> user's upcoming events
// GET /completed/:userid    -> user's completed events
// ---------------------------------------------------------------------------
router.get('/participated/:userid', eventController.getUserParticipatedEvents);
router.get('/upcoming/:userid', eventController.getUserUpcomingEvents);
router.get('/completed/:userid', eventController.getUserCompletedEvents);

// ---------------------------------------------------------------------------
// Club-scoped events
// GET /club/:clubId -> list events for a specific club (requires auth)
// ---------------------------------------------------------------------------
router.get('/club/:clubId', isAuthenticated, eventController.getEventsByClub);

// ---------------------------------------------------------------------------
// Registration endpoints (must come before /:id routes)
// POST /:id/register            -> register the authenticated user to an event
// POST /:eventId/register-team  -> register a team to an event (authenticated)
// ---------------------------------------------------------------------------
router.post('/:id/register', isAuthenticated, eventController.registerUserToEvent);
router.post('/:eventId/register-team', isAuthenticated, eventController.registerTeamToEvent);

// ---------------------------------------------------------------------------
// Feedback: add feedback to an event (must come before /:id)
// POST /:eventId/add-feedback
// Middleware: isAuthenticated
// Controller: eventController.addFeedback
// ---------------------------------------------------------------------------
router.post('/:eventId/add-feedback', isAuthenticated, eventController.addFeedback);

// ---------------------------------------------------------------------------
// Event CRUD by id (MUST come last to avoid conflicts with specific routes)
// GET    /:id    -> show event details
// PUT    /:id    -> update event (club-admin or admin only)
// DELETE /:id    -> delete event (club-admin or admin only)
// ---------------------------------------------------------------------------
router.get('/:id', eventController.showEvent);
router.put('/:id', isAuthenticated, restrictTo('club-admin', 'admin'), eventController.updateEvent);
router.delete('/:id', isAuthenticated, restrictTo('club-admin', 'admin'), eventController.deleteEvent);

module.exports = router;


