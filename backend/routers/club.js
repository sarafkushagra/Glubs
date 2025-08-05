const express = require("express")
const router = express.Router()
const clubController = require("../controllers/club")
const { isAuthenticated } = require("../middlewares/auth")

router.get("/", clubController.showAllClubs)
router.post("/", isAuthenticated, clubController.createClub)
router.get("/:id", clubController.showClub)
router.put("/:id", clubController.updateClub)
router.delete("/:id", clubController.deleteClub)
router.get("/:id/members", clubController.showClubMembers)
router.get("/:clubId/events", clubController.showClubEvents)

// Join request routes
router.post("/:clubId/join", isAuthenticated, clubController.sendJoinRequest)
router.get("/my/requests",isAuthenticated,clubController.getUserJoinRequests)

module.exports = router
