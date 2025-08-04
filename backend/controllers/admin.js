const User = require("../schema/user");

exports.getPendingClubAdmins = async (req, res) => {
  const pending = await User.find({ requestedRole: "pending-club-admin" }).select("-password");
  res.status(200).json({ users: pending });
};

exports.approveClubAdmin = async (req, res) => {
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
