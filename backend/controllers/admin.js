/**
 * admin.js
 * Controller for admin-related user operations.
 *
 * Responsibilities:
 *  - Provide endpoints for admin management related to club-admin requests.
 *  - Interact with the User schema to query and update user role/requestedRole.
 *
 * Exports:
 *  - getPendingAdmins(req, res): returns users who have requested the club-admin role (pending).
 *  - approveAdmin(req, res): approve a user's pending club-admin request by user id.
 *
 * Notes:
 *  - Responses are JSON. Error handling returns 4xx for client validation issues and 5xx for server errors.
 */

const User = require("../schema/user");

// ---------------------------------------------------------------------------
// Handler: getPendingAdmins
// Purpose: Retrieve all users who have requested the 'club-admin' role and are still pending.
// Request: - No URL params required. Uses authenticated request if middleware applies.
// Response: 200 { users: [...] } where password fields are excluded.
// Errors: If an unexpected error occurs (not currently caught here) it will bubble up to global error handling.
// ---------------------------------------------------------------------------
exports.getPendingAdmins = async (req, res) => {
  const pending = await User.find({ requestedRole: "pending-club-admin" }).select("-password");
  res.status(200).json({ users: pending });
};

// ---------------------------------------------------------------------------
// Handler: approveAdmin
// Purpose: Approve a user's request to become a club admin.
// Request: expects `req.params.id` containing the user's ObjectId.
// Behaviour:
//  1. Loads the user by id.
//  2. Validates the user exists and had a requestedRole of 'pending-club-admin'.
//  3. Sets `role` to 'club-admin' and clears `requestedRole`.
//  4. Persists the change using findByIdAndUpdate and returns a success message.
// Response: 200 { message: "User approved as club admin" } on success.
// Errors:
//  - 400: Sent when the user is not found or does not have a pending request.
//  - 500: Internal Server Error for unexpected exceptions (also logs the error).
// ---------------------------------------------------------------------------
exports.approveAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.requestedRole !== "pending-club-admin") {
      return res.status(400).json({ message: "Invalid user or role" });
    }
    user.role = "club-admin";
    user.requestedRole = null;
    await User.findByIdAndUpdate(
      req.params.id,
      {
        role: user.role,
        requestedRole: user.requestedRole
      },
      { new: true }
    );
    res.status(200).json({ message: "User approved as club admin" });
  } catch (error) {
    console.error("Error in approveClubAdmin:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
