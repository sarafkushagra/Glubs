const mongoose = require("mongoose")

/*
  Schema: TeamRequest
  Purpose:
    - Represents a request to join or invite a user to a `Team` for an `Event`.
    - Captures who sent the request (`from`), who it's addressed to (`to`),
      the `team` and `event` context, an optional `message`, and the
      current `status` (pending/accepted/rejected).

  Developer notes:
    - All `team`, `from`, `to`, and `event` fields are required references.
    - Keep business rules (who can send, who can accept/reject, capacity
      checks) in controller logic or service layer — schema holds state only.
    - Uses timestamps to easily show when requests were created/reviewed.
*/

const teamRequestSchema = new mongoose.Schema(
  {
    // Team the request is related to (required).
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    // User who initiated the request (required).
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // User who is the target of the request (required).
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Related Event (required) — useful to scope team membership.
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    // Optional message from sender to receiver.
    message: {
      type: String,
      trim: true,
    },

    // Status of the request. Default is 'pending'.
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
)

// Export compiled model if already defined (avoids OverwriteModelError),
// otherwise compile a new model named `TeamRequest`.
module.exports = mongoose.models.TeamRequest || mongoose.model("TeamRequest", teamRequestSchema)
