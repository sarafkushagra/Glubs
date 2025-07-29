const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registrationController"); // ✅ correct import

const { isAuthenticated } = require("../middlewares/auth"); // if needed

// ✅ Make sure to pass the function, NOT call it
router.post("/:eventId/register", isAuthenticated, registrationController.registerForEvent);

module.exports = router;
