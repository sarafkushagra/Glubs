const express = require("express");
const { isAuthenticated, restrictTo } = require("../middlewares/auth");
const { getPendingAdmins, approveAdmin } = require("../controllers/admin");
const router = express.Router();

router.get("/admin-requests", isAuthenticated, restrictTo("admin"), getPendingAdmins);
router.post("/approve-admin/:id", isAuthenticated, restrictTo("admin"), approveAdmin);

module.exports = router;