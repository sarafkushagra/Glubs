const mongoose = require("mongoose")

/**
 * ClubJoinRequest Schema
 *
 * Represents a user's request to join a specific club.
 * Fields:
 *  - club: ObjectId reference to the Club the user wants to join (required)
 *  - user: ObjectId reference to the requesting User (required)
 *  - message: optional message provided by the user when requesting to join
 *  - status: one of 'pending' | 'accepted' | 'rejected' (defaults to 'pending')
 *  - reviewedBy: User ObjectId who reviewed the request (set when accepted/rejected)
 *  - reviewedAt: timestamp when the request was reviewed
 *  - rejectionReason: optional text for why a request was rejected
 *
 * Indexes:
 *  - Unique compound index on { club, user } prevents the same user from creating
 *    multiple simultaneous requests to the same club.
 */

const clubJoinRequestSchema = new mongoose.Schema(
  {
    // Club the request targets
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },

    // User who created the request
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Optional message from the user (trim and limit length)
    message: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // Request status: defaults to 'pending' until a club admin accepts/rejects
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    // Who reviewed the request (set when status changes)
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // When the request was reviewed
    reviewedAt: {
      type: Date,
    },

    // Optional reason provided when rejecting a request
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
)

// Prevent duplicate requests for the same user/club pair
clubJoinRequestSchema.index({ club: 1, user: 1 }, { unique: true })

// Export the model, use existing compiled model if present (avoid recompilation errors in serverless environments)
module.exports = mongoose.models.ClubJoinRequest || mongoose.model("ClubJoinRequest", clubJoinRequestSchema)
