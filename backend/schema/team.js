const mongoose = require("mongoose")

/*
  Schema: Team
  Purpose:
    - Represents a team formed for an `Event`.
    - Holds a leader, member list, capacity (`maxMembers`), and
      optional `inviteCode` for joining.

  Developer notes:
    - `event` and `leader` are required references to `Event` and `User`.
    - `members` is an array of `User` ObjectIds; keep business logic
      (adding/removing members, enforcing capacity) in application code
      or controllers rather than schema hooks unless necessary.
    - `inviteCode` is marked `unique` and `sparse` so documents without
      an invite code won't conflict on the unique index.
    - The schema uses timestamps to track `createdAt` and `updatedAt`.
*/

const teamSchema = new mongoose.Schema(
  {
    // Team display name. Required and trimmed.
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional short description about the team's role or focus.
    description: {
      type: String,
      trim: true,
    },

    // Event this team belongs to. Required reference to `Event`.
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    // User who leads the team. Required reference to `User`.
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Members of the team (array of User references).
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Capacity limit for the team. Application logic should enforce this.
    maxMembers: {
      type: Number,
      required: true,
    },

    // Whether the team is currently active. Defaults to true.
    isActive: {
      type: Boolean,
      default: true,
    },

    // Optional invite code for joining teams. `sparse` allows multiple
    // documents without an inviteCode while `unique` prevents duplicates
    // for documents that do set this field.
    inviteCode: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple documents to not have inviteCode
    },
  },
  { timestamps: true },
)

// Export compiled model if it exists (prevents recompilation errors
// in serverless / watch environments), otherwise compile a new model.
module.exports = mongoose.models.Team || mongoose.model("Team", teamSchema)
