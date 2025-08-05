const mongoose = require("mongoose")

const clubJoinRequestSchema = new mongoose.Schema(
  {
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
)

// Prevent duplicate requests
clubJoinRequestSchema.index({ club: 1, user: 1 }, { unique: true })

module.exports = mongoose.models.ClubJoinRequest || mongoose.model("ClubJoinRequest", clubJoinRequestSchema)
