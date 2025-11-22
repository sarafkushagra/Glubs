/**
 * auth.js (middleware)
 * Authentication and authorization middleware for Express routes.
 *
 * Exports:
 *  - isAuthenticated: middleware that verifies a JWT, loads the corresponding user,
 *    and attaches it to `req.user`.
 *  - restrictTo(...roles): factory that returns middleware restricting access to users
 *    whose `role` is included in the provided `roles` array.
 *
 * Notes:
 *  - Uses cookies (`req.cookies.token`) or the Authorization header (`Bearer <token>`)
 *    to extract the token.
 *  - Uses `catchAsync` wrapper so thrown errors are forwarded to the global error handler.
 */

const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../schema/user");

// ---------------------------------------------------------------------------
// isAuthenticated
// Purpose: Ensure the requester is authenticated.
// Steps:
//  1. Extract token from cookie or Authorization header.
//  2. If no token, return 401 via AppError.
//  3. Verify token signature and decode payload to get user id.
//  4. Load user from DB; if not found return 401.
//  5. Attach user to req.user and call next().
// Error handling: Catches verification or DB errors and returns a 401 JSON response.
// ---------------------------------------------------------------------------
exports.isAuthenticated = catchAsync(async (req, res, next) => {
  try {
    // Support token stored in an httpOnly cookie (preferred) or Authorization header.
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next(
        new AppError("You are not logged in. Please login to access", 401)
      );
    }

    // Verify the token and read the encoded user id
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user referenced by the token
    const currentUser = await User.findById(decode.id);

    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token does not exist", 401)
      );
    }

    // (Optional) If you enforce email verification, you can check currentUser.isVerified here.
    // if (!currentUser.isVerified) {
    //   return next(new AppError("Please verify your email to continue.", 403));
    // }

    // Attach the current user document to the request for downstream handlers
    req.user = currentUser;

    next();
  } catch (err) {
    // Token verification or DB lookup failed — treat as unauthorized
    return res.status(401).json({ message: "Invalid token, authorization denied" });
  }
});


// ---------------------------------------------------------------------------
// restrictTo
// Purpose: Create middleware that allows access only to users with matching roles.
// Usage: router.get('/admin', isAuthenticated, restrictTo('admin','club-admin'), handler)
// Behaviour: Checks `req.user.role` against provided roles; returns 403 via AppError when unauthorized.
// ---------------------------------------------------------------------------
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
