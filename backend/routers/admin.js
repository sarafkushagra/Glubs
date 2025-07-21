const express = require("express");
const { isAuthenticated, restrictTo } = require("../middlewares/auth");
const { getPendingClubAdmins, approveClubAdmin } = require("../controllers/admin");
const router = express.Router();

router.get("/club-admin-requests", isAuthenticated, restrictTo("admin"), getPendingClubAdmins);
router.post("/approve-club-admin/:id", isAuthenticated, restrictTo("admin"), approveClubAdmin);

module.exports = router;