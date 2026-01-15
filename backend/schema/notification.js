const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        type: {
            type: String,
            enum: ["team_invitation", "team_accepted", "team_rejected", "team_joined", "team_left", "member_removed", "event_registration"],
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        link: {
            type: String,
        },
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
        },
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        metadata: {
            type: Map,
            of: String,
        },
    },
    { timestamps: true },
)

module.exports = mongoose.models.Notification || mongoose.model("Notification", notificationSchema)
