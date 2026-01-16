const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
            index: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: "INR",
        },
        razorpayOrderId: {
            type: String,
            required: true,
            unique: true,
        },
        razorpayPaymentId: {
            type: String,
        },
        razorpaySignature: {
            type: String,
        },
        status: {
            type: String,
            enum: ["pending", "captured", "failed"],
            default: "pending",
        },
        registrationType: {
            type: String,
            enum: ["individual", "team"],
            required: true,
        },
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
