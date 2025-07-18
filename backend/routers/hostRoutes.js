const express = require("express");
const router = express.Router();
const {
  signupHost,
  loginHost,
  logoutHost,
} = require("../controllers/authHost");
const {
  getHostProfile,
  updateHost,
  deleteHost,
  getMyEvents,
  createEvent,
  getParticipantsForEvent,
} = require("../controllers/host");

const { isHostAuthenticated } = require("../middlewares/authHost");

// Auth Routes
router.post("/signup", signupHost);
router.post("/login", loginHost);
router.post("/logout", isHostAuthenticated, logoutHost);

// Host Profile
router.get("/me", isHostAuthenticated, getHostProfile);
router.put("/:id", isHostAuthenticated, updateHost);
router.delete("/:id", isHostAuthenticated, deleteHost);

// Event Management
router.get("/my-events", isHostAuthenticated, getMyEvents);
router.post("/host-event", isHostAuthenticated, createEvent);
router.get("/event/:eventId/participants", isHostAuthenticated, getParticipantsForEvent);

module.exports = router;
