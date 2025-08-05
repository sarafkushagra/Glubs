const express = require("express");
const { isAuthenticated, restrictTo } = require("../middlewares/auth");
const { getPendingAdmins, approveAdmin } = require("../controllers/admin");
const router = express.Router();

router.get("/club-admin-requests", isAuthenticated, restrictTo("admin"), getPendingAdmins);
router.post("/approve-club-admin/:id", isAuthenticated, restrictTo("admin"), approveAdmin);

module.exports = router;