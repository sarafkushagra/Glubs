const express = require("express")
const router = express.Router()
const teamController = require("../controllers/team")
const { isAuthenticated } = require("../middlewares/auth")

// Team CRUD routes
router.post("/", isAuthenticated, teamController.createTeam)
router.get("/user/:userId/event/:eventId", isAuthenticated, teamController.getUserTeam)
router.put("/:teamId", isAuthenticated, teamController.updateTeam)
router.delete("/:teamId", isAuthenticated, teamController.deleteTeam)
router.delete("/:teamId/member/:memberId", isAuthenticated, teamController.removeMember)

// Team request routes
router.post("/request", isAuthenticated, teamController.sendTeamRequest)
router.get("/requests/:eventId", isAuthenticated, teamController.getTeamRequests)
router.get("/sent-requests/:eventId", isAuthenticated, teamController.getSentRequests)
router.put("/request/:requestId", isAuthenticated, teamController.respondToRequest)
router.get("/sent-requests/:eventId", isAuthenticated, teamController.getSentRequests)

module.exports = router
