const express = require("express")
const router = express.Router()
const clubAdminController = require("../controllers/clubAdmin")
const { isAuthenticated } = require("../middlewares/auth")

// Middleware to check if user is club-admin
const isClubAdmin = (req, res, next) => {
  if (req.user.role !== "club-admin") {
    return res.status(403).json({ message: "Access denied. Club admin role required." })
  }
  next()
}

// Club admin dashboard routes
router.get("/dashboard", isAuthenticated, isClubAdmin, clubAdminController.getDashboardData)
router.get("/requests", isAuthenticated, isClubAdmin, clubAdminController.getJoinRequests)
router.patch("/requests/:requestId", isAuthenticated, isClubAdmin, clubAdminController.handleJoinRequest)
router.get("/clubs/:clubId/members", isAuthenticated, isClubAdmin, clubAdminController.getClubMembers)
router.delete("/clubs/:clubId/members/:memberId", isAuthenticated, isClubAdmin, clubAdminController.removeMember)

module.exports = router
