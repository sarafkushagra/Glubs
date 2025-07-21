const User = require("../schema/user");



exports.getPendingClubAdmins = async (req, res) => {
  const pending = await User.find({ role: "pending-club-admin" }).select("-password");
  res.status(200).json({ users: pending });
};


exports.approveClubAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== "pending-club-admin") {
      return res.status(400).json({ message: "Invalid user or role" });
    }

    user.role = "club-admin";
    await User.findByIdAndUpdate(
      req.params.id,
      { role: user.role },
      { new: true }
    );

    res.status(200).json({ message: "User approved as club admin" });
  } catch (error) {
    console.error("Error in approveClubAdmin:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
