/**
 * admin.js (router)
 * Routes for admin-only management actions related to club admin requests.
 *
 * Overview:
 *  - GET  /admin-requests        => list users who have requested club-admin role (pending)
 *  - POST /approve-admin/:id     => approve a specific user's request to become a club admin
 *
 * All routes require authentication and are restricted to users with the 'admin' role.
 */

const express = require("express");
const { isAuthenticated, restrictTo } = require("../middlewares/auth");
const { getPendingAdmins, approveAdmin } = require("../controllers/admin");
const router = express.Router();

// ---------------------------------------------------------------------------
// GET /admin-requests
// Purpose: Return all users with a pending 'club-admin' request.
// Middleware: isAuthenticated -> ensures a valid user; restrictTo('admin') -> ensures only super-admins can call.
// Controller: getPendingAdmins (returns JSON array of users, password omitted by controller)
// ---------------------------------------------------------------------------
router.get("/admin-requests", isAuthenticated, restrictTo("admin"), getPendingAdmins);

// ---------------------------------------------------------------------------
// POST /approve-admin/:id
// Purpose: Approve the club-admin request for the user with the given id.
// Params: :id -> user ObjectId to approve
// Middleware: isAuthenticated, restrictTo('admin')
// Controller: approveAdmin (validates requestedRole and promotes the user)
// ---------------------------------------------------------------------------
router.post("/approve-admin/:id", isAuthenticated, restrictTo("admin"), approveAdmin);

module.exports = router;