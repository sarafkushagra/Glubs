/**
 * club.js (router)
 * Routes for club-related operations: listing, CRUD, members, events and join requests.
 *
 * Route patterns in this file:
 *  - GET    /                 -> list all clubs
 *  - POST   /                 -> create a new club (authenticated)
 *  - GET    /:id              -> get club details
 *  - PUT    /:id              -> update club by id
 *  - DELETE /:id              -> delete club by id
 *  - GET    /:id/members      -> list members of a club
 *  - GET    /:clubId/events   -> list events for a given club
 *  - POST   /:clubId/join     -> send a join request (authenticated)
 *  - GET    /my/requests      -> get join requests for the authenticated user
 *
 * Notes:
 *  - Authenticated routes expect `isAuthenticated` middleware which attaches `req.user`.
 *  - Controller functions are in `backend/controllers/club.js` and handle validation and responses.
 */

const express = require("express")
const router = express.Router()
const clubController = require("../controllers/club")
const { isAuthenticated } = require("../middlewares/auth")

// ---------------------------------------------------------------------------
// Public: list all clubs
// GET /
// Controller: clubController.showAllClubs
// ---------------------------------------------------------------------------
router.get("/", clubController.showAllClubs)

// ---------------------------------------------------------------------------
// Create a new club (authenticated)
// POST /
// Middleware: isAuthenticated -> attaches req.user (creator)
// Controller: clubController.createClub
// ---------------------------------------------------------------------------
router.post("/", isAuthenticated, clubController.createClub)

// ---------------------------------------------------------------------------
// Get, update, delete club by id
// GET    /:id    -> clubController.showClub
// PUT    /:id    -> clubController.updateClub
// DELETE /:id    -> clubController.deleteClub
// Note: consider protecting update/delete routes with auth+authorization if required.
// ---------------------------------------------------------------------------
router.get("/:id", clubController.showClub)
router.put("/:id", clubController.updateClub)
router.delete("/:id", clubController.deleteClub)

// ---------------------------------------------------------------------------
// Club members and events
// GET /:id/members       -> returns populated list of members
// GET /:clubId/events    -> returns events associated with the club
// ---------------------------------------------------------------------------
router.get("/:id/members", clubController.showClubMembers)
router.get("/:clubId/events", clubController.showClubEvents)

// ---------------------------------------------------------------------------
// Join requests
// POST /:clubId/join     -> authenticated users can submit a join request to a club
// GET  /my/requests      -> authenticated user retrieves their join requests
// ---------------------------------------------------------------------------
router.post("/:clubId/join", isAuthenticated, clubController.sendJoinRequest)
router.get("/my/requests", isAuthenticated, clubController.getUserJoinRequests)

module.exports = router
