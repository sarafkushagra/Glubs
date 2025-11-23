const mongoose = require("mongoose")

/**
 * clubJoinRequest.js
 * Schema representing a user's request to join a club.
 *
 * Fields:
 *  - club: reference to the `Club` the user wants to join (ObjectId)
 *  - user: reference to the requesting `User` (ObjectId)
 *  - message: optional message from the user (trimmed, max 500 chars)
 *  - status: 'pending' | 'accepted' | 'rejected' (defaults to 'pending')
 *  - reviewedBy: User who reviewed the request (set when accepted/rejected)
 *  - reviewedAt: timestamp of the review action
 *  - rejectionReason: optional explanation when a request is rejected
 *
 * The schema uses timestamps to automatically add `createdAt` and `updatedAt`.
 * A unique compound index on { club, user } prevents duplicate requests from the same user.
 */

const clubJoinRequestSchema = new mongoose.Schema(
  {
    // Club the request is for (required)
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },

    // User who created the request (required)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Optional message supplied by the user making the request
    message: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // Current status of the request. Defaults to 'pending'.
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    // User who reviewed the request (club admin or admin)
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // When the request was reviewed (set when accepted/rejected)
    reviewedAt: {
      type: Date,
    },

    // Optional reason recorded when a request is rejected
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
)

// Prevent the same user from filing multiple requests for the same club
clubJoinRequestSchema.index({ club: 1, user: 1 }, { unique: true })

// Export model; reuse compiled model if available (avoids recompilation warnings in some environments)
module.exports = mongoose.models.ClubJoinRequest || mongoose.model("ClubJoinRequest", clubJoinRequestSchema)
