const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment");
const { isAuthenticated } = require("../middlewares/auth");

router.post("/create-order", isAuthenticated, paymentController.createOrder);
router.post("/verify-payment", isAuthenticated, paymentController.verifyPayment);
router.get("/analytics", isAuthenticated, paymentController.getClubPaymentAnalytics);

module.exports = router;
