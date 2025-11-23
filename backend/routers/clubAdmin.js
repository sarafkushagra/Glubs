/**
 * clubAdmin.js (router)
 * Routes for club administrators to manage club-specific operations.
 *
 * Main responsibilities:
 *  - Provide dashboard data for club admins
 *  - List and handle club join requests
 *  - Inspect and remove members from specific clubs
 *
 * All routes require the user to be authenticated and have club-admin (or admin) privileges.
 */

const express = require("express")
const router = express.Router()
const clubAdminController = require("../controllers/clubAdmin")
const { isAuthenticated } = require("../middlewares/auth")

// ---------------------------------------------------------------------------
// Local middleware: isClubAdmin
// Purpose: Ensure `req.user` has club-admin or admin role before allowing access.
// Behaviour: returns 403 JSON response when the role is insufficient.
// Note: isAuthenticated should run before this so req.user is populated.
// ---------------------------------------------------------------------------
const isClubAdmin = (req, res, next) => {
  if (req.user.role !== "club-admin" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Club admin privileges required." })
  }
  next()
}

// ---------------------------------------------------------------------------
// GET /dashboard
// Purpose: Return aggregated dashboard data for the club admin (counts, recent requests, etc.)
// Middleware: isAuthenticated, isClubAdmin
// Controller: clubAdminController.getDashboardData
// ---------------------------------------------------------------------------
router.get("/dashboard", isAuthenticated, isClubAdmin, clubAdminController.getDashboardData)

// ---------------------------------------------------------------------------
// GET /requests
// Purpose: Return pending join requests for clubs the admin manages.
// Middleware: isAuthenticated, isClubAdmin
// Controller: clubAdminController.getJoinRequests
// ---------------------------------------------------------------------------
router.get("/requests", isAuthenticated, isClubAdmin, clubAdminController.getJoinRequests)

// ---------------------------------------------------------------------------
// PATCH /requests/:requestId
// Purpose: Accept or reject a specific join request. Request body should include action/decision.
// Params: requestId (join request ObjectId)
// Middleware: isAuthenticated, isClubAdmin
// Controller: clubAdminController.handleJoinRequest
// ---------------------------------------------------------------------------
router.patch("/requests/:requestId", isAuthenticated, isClubAdmin, clubAdminController.handleJoinRequest)

// ---------------------------------------------------------------------------
// GET /clubs/:clubId/members
// Purpose: List members of a specific club (populated user info).
// Params: clubId (club ObjectId)
// Middleware: isAuthenticated, isClubAdmin
// Controller: clubAdminController.getClubMembers
// ---------------------------------------------------------------------------
router.get("/clubs/:clubId/members", isAuthenticated, isClubAdmin, clubAdminController.getClubMembers)

// ---------------------------------------------------------------------------
// DELETE /clubs/:clubId/members/:memberId
// Purpose: Remove a member from a club.
// Params: clubId, memberId (both ObjectIds)
// Middleware: isAuthenticated, isClubAdmin
// Controller: clubAdminController.removeMember
// ---------------------------------------------------------------------------
router.delete("/clubs/:clubId/members/:memberId", isAuthenticated, isClubAdmin, clubAdminController.removeMember)

module.exports = router
