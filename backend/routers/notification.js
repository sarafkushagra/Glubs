const express = require("express")
const router = express.Router()
const notificationController = require("../controllers/notification")
const { isAuthenticated } = require("../middlewares/auth")

router.use(isAuthenticated)

router.get("/", notificationController.getNotifications)
router.put("/mark-all-read", notificationController.markAllAsRead)
router.put("/:notificationId/read", notificationController.markAsRead)
router.delete("/:notificationId", notificationController.deleteNotification)

module.exports = router
