/**
 * auth.js
 * Controller responsible for authentication-related flows:
 *  - User signup (with email OTP verification)
 *  - Email verification and OTP resend
 *  - Login / logout
 *  - Password reset (request OTP and reset)
 *
 * Each exported handler uses `catchAsync` to forward errors to the global error
 * handler and returns JSON responses. Helper functions below manage token
 * creation and sending responses with cookies.
 *
 * Inputs / outputs (general patterns):
 *  - Inputs: request body (email, password, otp, etc) and authenticated `req.user` where applicable.
 *  - Success responses: JSON with `status` and `message`, sometimes `token` and `data.user`.
 *  - Errors: use `AppError` for client-visible errors (4xx) and allow unexpected errors to be handled by global handler (5xx).
 */

const User = require("../schema/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../utils/email");
const generateOtp = require("../utils/generateOtp");
const jwt = require("jsonwebtoken");

// ---------------------------------------------------------------------------
// Helper: signToken
// Purpose: Create a JWT for a given user id.
// Input: user id (string/ObjectId)
// Output: signed JWT string with expiry according to env config.
// Note: This is a small wrapper around jsonwebtoken for consistent signing.
// ---------------------------------------------------------------------------
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// ---------------------------------------------------------------------------
// Helper: createSendToken
// Purpose: Create a JWT, set it as an httpOnly cookie on the response and send
// a standardized JSON response including the token and (sanitized) user data.
// Inputs:
//  - user: Mongoose user document (will be sanitized before sending)
//  - statusCode: HTTP status to return
//  - res: Express response object
//  - message: human-readable success message
// Behavior:
//  - Signs a token with `signToken`, configures cookie options (expiry, httpOnly)
//  - Clears sensitive properties from the user object (password, otp)
//  - Sends { status, message, token, data: { user } }
// ---------------------------------------------------------------------------
const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() +
      Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true, //only secure in production
    sameSite: "None", //process.env.NODE_ENV === "production" ? "none" :
  };

  res.cookie("token", token, cookieOptions);

  user.password = undefined;
  user.passwordConfirm = undefined;
  user.otp = undefined;

  res.status(statusCode).json({
    status: "success",
    message,
    token,
    data: {
      user,
    },
  });
};

// ---------------------------------------------------------------------------
// Handler: signup
// Purpose: Register a new user with email verification via OTP.
// Request body: { email, password, passwordConfirm, username }
// Behaviour:
//  - Rejects if email already exists.
//  - Generates an OTP, sets expiry, creates the user (isVerified=false).
//  - Sends verification email containing the OTP.
//  - On successful email send, issues a token and responds with user data.
// Errors:
//  - 400 if email already registered.
//  - 500 if sending email fails (user is removed in that case).
// ---------------------------------------------------------------------------
exports.signup = catchAsync(async (req, res, next) => {

  const { email, password, passwordConfirm, username } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new AppError("Email already registerd", 400));
  }

  const otp = generateOtp();

  const otpExpires = Date.now() + 10 * 60 * 1000;

  const role = "student";
  const isVerified = false;

  const newUser = await User.create({
    username,
    email,
    password,
    passwordConfirm,
    otp,
    otpExpires,
    role,
    isVerified,
  });

  try {
    await sendEmail({
      email: newUser.email,
      subject: "Glubs Email Verification - Your OTP Code",
      html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 8px; background-color: #f9f9f9; color: #333; border: 1px solid #ddd;">
              <h2 style="color: #569c9fff;">🎉 Welcome to Glubs!</h2>
              <p>Hello there 👋,</p>
              <p>Thank you for signing up on <strong>Glubs</strong>, your gateway to discovering and managing college events.</p>
              <p>To complete your registration, please use the OTP below to verify your email address:</p>
              <h1 style="color: #528b83ff; font-size: 2.5em; letter-spacing: 4px; margin: 20px 0;">${otp}</h1>
              <p>This OTP is valid for <strong>10 minutes</strong>.</p>
              <hr style="margin: 30px 0;" />
              <p style="font-size: 0.9em; color: #666;">
                If you did not initiate this request, please ignore this email. Your data is safe with us.
              </p>
              <p style="font-size: 0.9em; color: #888;">— The Glubs Team </p>
            </div>
          `
    });

    console.log("✅ Email sent successfully!");
    createSendToken(newUser, 200, res, "Registration successful");
  } catch (error) {
    return next(
      new AppError("There is an error sending the email, Try Again", 500)
    );
  }
});

// ---------------------------------------------------------------------------
// Handler: verifyAccount
// Purpose: Verify a newly registered user's email using an OTP.
// Request body: { otp }
// Requirements: `req.user` should be set (authentication middleware) and contain otp fields.
// Behaviour:
//  - Validates OTP presence and correctness and that it hasn't expired.
//  - Marks user as verified, clears otp fields and saves.
// Response: 200 with success message on verification.
// Errors: 400 for missing/invalid/expired OTP.
// ---------------------------------------------------------------------------
exports.verifyAccount = catchAsync(async (req, res, next) => {
  const { otp } = req.body;

  if (!otp) {
    return next(new AppError("otp is missing", 400));
  }

  // create a middleware function to get the currently user function in middleware -> isAuthenticated

  const user = req.user;

  if (user.otp !== otp) {
    return next(new AppError("Invalid OTP", 400));
  }

  if (Date.now() > user.otpExpires) {
    return next(new AppError("otp has expired. Please request a new OTP", 400));
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "Email has been verified. Please login to continue.",
  });
});

// ---------------------------------------------------------------------------
// Handler: resentOTP
// Purpose: Resend a new email verification OTP to a user.
// Request: uses `req.user.email` (authenticated) to find the user.
// Behaviour:
//  - Validates user exists and is not already verified.
//  - Generates new OTP, saves, and emails it to the user.
// Response: 200 with confirmation message when email is sent.
// Errors: 400/404 if data missing or user not found; 500 if email sending fails.
// ---------------------------------------------------------------------------
exports.resentOTP = catchAsync(async (req, res, next) => {
  const { email } = req.user;

  if (!email) {
    return next(new AppError("Email is required to resend otp", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // if user is verified we donot gona send this otp as it is already signin
  if (user.isVerified) {
    return next(new AppError("This accound is already verified", 400));
  }

  // now if anything is not then we have to send a new otp again
  const newOtp = generateOtp();
  user.otp = newOtp;
  user.otpExpires = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: user.email,
      subject: "Glubs - Your Resend OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 8px; background-color: #f9f9f9; color: #333; border: 1px solid #ddd;">
          <h2 style="color: #569c9fff ;">🔄 Resend OTP - Glubs Verification</h2>
          <p>Hello again 👋,</p>
          <p>It looks like you requested a new OTP for verifying your email on <strong>Glubs</strong>.</p>
          <p>Your new One-Time Password (OTP) is:</p>
          <h1 style="color: #528b83ff; font-size: 2.5em; letter-spacing: 4px; margin: 20px 0;">${newOtp}</h1>
          <p>This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
          <hr style="margin: 30px 0;" />
          <p style="font-size: 0.9em; color: #666;">
            Didn't request this? You can safely ignore this email. No action will be taken unless the OTP is used.
          </p>
          <p style="font-size: 0.9em; color: #888;">— The Glubs Team </p>
        </div>
      `
    });

    res.status(200).json({
      status: "success",
      message: "A new OTP has been sent to your email",
    });
  } catch (error) {
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There is an error sending the email ! Please try again",
        500
      )
    );
  }
});

// ---------------------------------------------------------------------------
// Handler: login
// Purpose: Authenticate user by email and password and issue a JWT cookie.
// Request body: { email, password }
// Behaviour:
//  - Validates presence of email/password.
//  - Loads user with password and checks verification and password correctness.
//  - On success, uses createSendToken to set cookie and respond.
// Errors: 400 for missing credentials, 401 for incorrect credentials or unverified account.
// ---------------------------------------------------------------------------
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError("Incorrect Email or Password or Please Signp again", 401));
  }

  if (!user.isVerified) {
    return next(
      new AppError("Please verify your email before logging in", 401)
    );
  }

  // Compare the password with the password save in the database

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect Email or Password", 401));
  }

  // if all things is correct means password and user and email
  createSendToken(user, 200, res, "Login Successfull");
});

// ---------------------------------------------------------------------------
// Handler: logout
// Purpose: Invalidate auth cookie by overwriting it with a short-lived 'loggedout' value.
// Behaviour: sets cookie to 'loggedout' with a near-future expiry and returns success.
// ---------------------------------------------------------------------------
exports.logout = catchAsync(async (req, res, next) => {
  res.cookie("token", "loggedout", {
    expires: new Date(Date.now() + 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

// ---------------------------------------------------------------------------
// Handler: forgetPassword
// Purpose: Begin password reset by generating an OTP and emailing it to the user.
// Request body: { email }
// Behaviour:
//  - Finds user by email, sets reset OTP and expiry, saves.
//  - Sends email with reset OTP.
// Response: 200 if email sent.
// Errors: 404 if user not found; 500 if email sending fails (cleans up OTP fields on error).
// ---------------------------------------------------------------------------
exports.forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("No user found", 404));
  }

  const otp = generateOtp();
  // if all is good
  user.resetPasswordOTP = otp;
  user.resetPasswordOTPExpires = Date.now() + 300000;

  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: user.email,
      subject: "Glubs - Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 8px; background-color: #f9f9f9; color: #333; border: 1px solid #ddd;">
          <h2 style="color: #569c9fff;">🔐 Password Reset Request</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password for your <strong>Glubs</strong> account.</p>
          <p>Please use the OTP below to continue with your password reset:</p>
          <h1 style="color: #528b83ff; font-size: 2.5em; letter-spacing: 4px; margin: 20px 0;">${otp}</h1>
          <p>This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>
          <hr style="margin: 30px 0;" />
          <p style="font-size: 0.9em; color: #666;">
            Didn't request this? You can safely ignore this email. Your password will remain unchanged.
          </p>
          <p style="font-size: 0.9em; color: #888;">— The Glubs Team 💜</p>
        </div>
      `,
    });

    res.status(200).json({
      status: "success",
      message: "Password reset OTP has been sent to your email",
    });
  } catch (error) {
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email. Please try again later."
      )
    );
  }
});

// ---------------------------------------------------------------------------
// Handler: resetPassword
// Purpose: Complete password reset using email + OTP. Sets new password if OTP valid.
// Request body: { email, otp, password, passwordConfirm }
// Behaviour:
//  - Validates user exists with matching, non-expired reset OTP.
//  - Updates password fields, clears reset OTP fields, saves.
// Response: 200 with a message instructing the user to login.
// Errors: 400 if user not found or OTP invalid/expired.
// ---------------------------------------------------------------------------
exports.resetPassword = catchAsync(async (req, res, next) => {
  try{
  const { email, otp, password, passwordConfirm } = req.body;

  const user = await User.findOne({
    email,
    resetPasswordOTP: otp,
    resetPasswordOTPExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("No user found", 400));
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.resetPasswordOTP = undefined;
  user.resetPasswordOTPExpires = undefined;

  await user.save({ validateBeforeSave: false });

  // createSendToken(user, 200, res, "Password reset Successfully");
  // No token here — force login after password reset
  res.status(200).json({
    status: "success",
    message: "Password reset successfully. Please login.",
  });
} catch (error) {
    console.log(error);
}
});
