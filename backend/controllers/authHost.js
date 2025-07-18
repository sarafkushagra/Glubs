const Host = require("../schema/Host");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id, role: "host" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

exports.signupHost = async (req, res) => {
  const { name, email, password, passwordConfirm, organization, designation } = req.body;

  const newHost = await Host.create({
    name,
    email,
    password,
    passwordConfirm,
    organization,
    designation,
  });

  const token = signToken(newHost._id);
  res.status(201).json({ status: "success", token, host: newHost });
};

exports.loginHost = async (req, res) => {
  const { email, password } = req.body;
  const host = await Host.findOne({ email }).select("+password");
  if (!host || !(await host.correctPassword(password, host.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = signToken(host._id);
  res.status(200).json({ status: "success", token, host });
};

exports.logoutHost = (req, res) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
};
