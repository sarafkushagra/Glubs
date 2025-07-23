// const User = require('../schema/user');
// const Team = require("../schema/team");


// module.exports.showAllUsers = async (req, res) => {
//     const users = await User.find({});
//     res.json(users);
// };

// module.exports.getMe = async (req, res) => {
//     try {
//         const user = await User.findById(req.user._id).select('-password'); // never send password
//         res.json({ user });
//     } catch (error) {
//         console.error('Error fetching user:', error);
//         res.status(500).json({ message: 'Error fetching user', error: error.message });
//     }
// };

// module.exports.showUser = async (req, res) => {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//         return res.status(404).json({ message: "User not found" });
//     }
//     res.json(user);
// };

// module.exports.updateUser = async (req, res) => {
//     try {
//         const updatedUser = await User.findByIdAndUpdate(
//             req.params.id,
//             req.body, // Ensure req.body contains the updated fields
//             { new: true, runValidators: true }
//         );

//         if (!updatedUser) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         res.json({
//             message: "User updated successfully!",
//             user: updatedUser
//         });
//     } catch (error) {
//         console.error('Error updating user:', error);
//         res.status(400).json({ message: "Error updating user", error: error.message });
//     }
// };

// module.exports.deleteUser = async (req, res) => {
//     try {
//         const deletedUser = await User.findByIdAndDelete(req.params.id);

//         if (!deletedUser) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         res.json({
//             message: "User deleted successfully!",
//             user: deletedUser
//         });
//     } catch (error) {
//         console.error('Error deleting user:', error);
//         res.status(400).json({ message: "Error deleting user", error: error.message });
//     }
// };



// module.exports.requestClubAdmin = async (req, res) => {
//   const { requestedRole } = req.body;
//   const validRoles = ["student", "club-admin"];
//   if (!validRoles.includes(requestedRole)) {
//     return res.status(400).json({ message: "Invalid role" });
//   }

//   const user = await User.findById(req.user._id);
//   if (!user || !user.isVerified) {
//     return res
//       .status(401)
//       .json({ message: "Unauthorized or email not verified" });
//   }

//   if (requestedRole === "club-admin") {
//     user.role = "pending-club-admin"; // Request
//   } else {
//     user.role = "student";
//   }

//   await User.findByIdAndUpdate(
//     req.user._id,
//     { role: "pending-club-admin" },
//     { new: true } 
//   );


//   res
//     .status(200)
//     .json({ message: "Club admin request submitted. Await admin approval." });
// };



// // Get users who are NOT registered for a specific event
// module.exports.getUnregisteredUsers = async (req, res) => {
//   try {
//     const { eventId } = req.params

//     // Get the event to check if it exists
//     const Event = require("../schema/event")
//     const event = await Event.findById(eventId)

//     if (!event) {
//       return res.status(404).json({ message: "Event not found" })
//     }

//     // Find users who are NOT in the event's registeredUsers array
//     // and exclude users who are already in teams for this event
//     const Team = require("../schema/team")
//     const teamsForEvent = await Team.find({ event: eventId }).populate("members", "_id")
//     const usersInTeams = teamsForEvent.flatMap((team) => team.members.map((member) => member._id.toString()))

//     const unregisteredUsers = await User.find({
//       _id: {
//         $nin: [...event.registeredUsers, ...usersInTeams.map((id) => new mongoose.Types.ObjectId(id))],
//       },
//       isVerified: true,
//       role: { $in: ["student", "club-admin"] },
//     }).select("username email yearOfStudy department age")

//     res.json({ users: unregisteredUsers })
//   } catch (error) {
//     console.error("Error fetching unregistered users:", error)
//     res.status(500).json({ message: "Error fetching unregistered users", error: error.message })
//   }
// }

// // Get users available for team formation (not registered and not in any team for this event)
// module.exports.getAvailableUsers = async (req, res) => {
//   try {
//     const { eventId } = req.params

//     const Event = require("../schema/event")
//     const Team = require("../schema/team")

//     const event = await Event.findById(eventId)
//     if (!event) {
//       return res.status(404).json({ message: "Event not found" })
//     }

//     // Get all teams for this event
//     const teamsForEvent = await Team.find({ event: eventId }).populate("members", "_id")
//     const usersInTeams = teamsForEvent.flatMap((team) => team.members.map((member) => member._id.toString()))

//     // Find users who are not registered and not in any team
//     const availableUsers = await User.find({
//       _id: {
//         $nin: [...event.registeredUsers, ...usersInTeams.map((id) => new mongoose.Types.ObjectId(id))],
//       },
//       isVerified: true,
//       role: { $in: ["student", "club-admin"] },
//     }).select("username email yearOfStudy department age")

//     res.json({ users: availableUsers })
//   } catch (error) {
//     console.error("Error fetching available users:", error)
//     res.status(500).json({ message: "Error fetching available users", error: error.message })
//   }
// }




const mongoose = require("mongoose");
const User = require("../schema/user");
const Team = require("../schema/team");
const Event = require("../schema/event");

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

    if (requestedRole === "club-admin") {
      user.role = "pending-club-admin";
      await user.save();
    } else {
      user.role = "student";
      await user.save();
    }

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
      role: { $in: ["student", "club-admin"] },
    }).select("username email yearOfStudy department age");

    res.json({ users: unregisteredUsers });
  } catch (err) {
    console.error("Error fetching unregistered users:", err);
    res.status(500).json({ message: "Error fetching unregistered users", error: err.message });
  }
};

// Get users available for forming a team (not registered + not in any team)
exports.getAvailableUsers = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const teams = await Team.find({ event: eventId }).populate("members", "_id");
    const usersInTeams = teams.flatMap(team => team.members.map(m => m._id.toString()));

    const availableUsers = await User.find({
      _id: {
        $nin: [...event.registeredUsers, ...usersInTeams.map(id => new mongoose.Types.ObjectId(id))],
      },
      isVerified: true,
      role: { $in: ["student"] },
    }).select("username email yearOfStudy department age");

    res.json({ users: availableUsers });
  } catch (err) {
    console.error("Error fetching available users:", err);
    res.status(500).json({ message: "Error fetching available users", error: err.message });
  }
};
