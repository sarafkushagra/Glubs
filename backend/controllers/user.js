const mongoose = require("mongoose");
const User = require("../schema/user");
const Team = require("../schema/team");
const Event = require("../schema/event");
const Club = require("../schema/club");

// Get all users
exports.showAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

// Get logged-in user's info (without password)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
};

// Get a specific user by ID
exports.showUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
};

// Update user profile
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully!", user: updatedUser });
  } catch (err) {
    res.status(400).json({ message: "Error updating user", error: err.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully!", user: deletedUser });
  } catch (err) {
    res.status(400).json({ message: "Error deleting user", error: err.message });
  }
};

// Request to become a club-admin
exports.requestClubAdmin = async (req, res) => {
  try {
    const { requestedRole } = req.body;
    const validRoles = ["student", "club-admin"];
    if (!validRoles.includes(requestedRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(req.user._id);
    if (!user || !user.isVerified) {
      return res.status(401).json({ message: "Unauthorized or email not verified" });
    }

    user.requestedRole === "club-admin"
    await User.findByIdAndUpdate(req.user._id, { requestedRole: "pending-club-admin" }, { new: true })


    res.status(200).json({ message: "Role request submitted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Error requesting role", error: err.message });
  }
};

// Get users NOT registered for an event and NOT in any team
exports.getUnregisteredUsers = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const teams = await Team.find({ event: eventId }).populate("members", "_id");
    const usersInTeams = teams.flatMap(team => team.members.map(m => m._id.toString()));

    const unregisteredUsers = await User.find({
      _id: {
        $nin: [...event.registeredUsers, ...usersInTeams.map(id => new mongoose.Types.ObjectId(id))],
      },
      isVerified: true,
      role: "student",
    }).select("username email yearOfStudy department age");

    res.json({ users: unregisteredUsers });
  } catch (err) {
    console.error("Error fetching unregistered users:", err);
    res.status(500).json({ message: "Error fetching unregistered users", error: err.message });
  }
};


exports.getAvailableUsers = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const teams = await Team.find({ event: eventId }).populate("members", "_id");
    const usersInTeams = teams.flatMap(team => team.members.map(m => m._id.toString()));

    const availableUsers = await User.find({
      _id: {
        $nin: usersInTeams.map(id => new mongoose.Types.ObjectId(id)),
      },
      isVerified: true,
      role: "student",
    }).select("username email yearOfStudy department age _id");

    res.json({ users: availableUsers });
  } catch (err) {
    console.error("Error fetching available users:", err);
    res.status(500).json({ message: "Error fetching available users", error: err.message });
  }
};


module.exports.getUserAdminClubs = async (req, res) => {
  try {
    const userId = req.user;

    // Find clubs where user is either creator or member with admin role
    const clubs = await Club.find({
      $or: [
        { createdBy: userId },
        {
          members: userId,
          // You might want to add a role field to track admin members
          // For now, assuming createdBy is the admin
        }
      ]
    }).select('_id name description category createdBy');
    // Filter to only include clubs where user is actually admin
    // This assumes that createdBy users are admins
    const adminClubs = clubs.filter(club =>
      club.createdBy.toString() === userId._id.toString()
    );

    res.status(200).json({
      message: "Admin clubs fetched successfully",
      clubs: adminClubs
    });
  } catch (error) {
    console.error("Error fetching user admin clubs:", error);
    res.status(500).json({
      message: "Error fetching admin clubs",
      error: error.message
    });
  }
};

// // Get user profile with clubs
// module.exports.getUserProfile = async (req, res) => {
//   try {
//     const userId = req.user;

//     const user = await User.findById(userId)
//       .select('-password')
//       .populate('club', 'name description');

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Get clubs where user is admin
//     const adminClubs = await Club.find({
//       createdBy: userId
//     }).select('_id name description category');

//     // Get clubs where user is member
//     const memberClubs = await Club.find({
//       members: userId,
//       createdBy: { $ne: userId }
//     }).select('_id name description category');

//     res.status(200).json({
//       message: "User profile fetched successfully",
//       user: {
//         ...user.toObject(),
//         adminClubs,
//         memberClubs
//       }
//     });
//   } catch (error) {
//     console.error("Error fetching user profile:", error);
//     res.status(500).json({
//       message: "Error fetching user profile",
//       error: error.message
//     });
//   }
// };
