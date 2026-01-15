const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../schema/user");

exports.isAuthenticated = catchAsync(async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token || token === "null") {
      console.log("❌ No token found in cookies or headers (or token is 'null')");
      return next(
        new AppError("You are not logged in. Please login to access", 401)
      );
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded successfully for ID:", decode.id);

    const currentUser = await User.findById(decode.id);

    if (!currentUser) {
      console.log("❌ User belonging to token not found. ID:", decode.id);
      return next(
        new AppError("The user belonging to this token does not exist", 401)
      );
    }

    req.user = currentUser;
    next();
  } catch (err) {
    console.error("❌ Authentication failure:", err.name, err.message);
    return res.status(401).json({ message: "Invalid token, authorization denied" });
  }
});


exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};
