const User = require('../schema/user');

module.exports.showAllUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users);
};

module.exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password'); // never send password
        res.json({ user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};

module.exports.showUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
};

module.exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body, // Ensure req.body contains the updated fields
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "User updated successfully!",
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(400).json({ message: "Error updating user", error: error.message });
    }
};

module.exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "User deleted successfully!",
            user: deletedUser
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(400).json({ message: "Error deleting user", error: error.message });
    }
};



module.exports.requestClubAdmin = async (req, res) => {
  const { requestedRole } = req.body;
  const validRoles = ["student", "club-admin"];
  if (!validRoles.includes(requestedRole)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await User.findById(req.user._id);
  if (!user || !user.isVerified) {
    return res
      .status(401)
      .json({ message: "Unauthorized or email not verified" });
  }

  if (requestedRole === "club-admin") {
    user.role = "pending-club-admin"; // Request
  } else {
    user.role = "student";
  }

  await User.findByIdAndUpdate(
    req.user._id,
    { role: "pending-club-admin" },
    { new: true } 
  );


  res
    .status(200)
    .json({ message: "Club admin request submitted. Await admin approval." });
};
