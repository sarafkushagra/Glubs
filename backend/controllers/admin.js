const User = require("../schema/user");



exports.getPendingClubAdmins = async (req, res) => {
  const pending = await User.find({ role: "pending-club-admin" }).select("-password");
  res.status(200).json({ users: pending });
};


exports.approveClubAdmin = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.role !== "pending-club-admin") {
    return res.status(400).json({ message: "Invalid user or role" });
  }

  user.role = "club-admin";
  await user.save();

  res.status(200).json({ message: "User approved as club admin" });
};
