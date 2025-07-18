const User = require("../schema/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const sendEmail = require("../utils/email");
const generateOtp = require("../utils/generateOtp");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: false, //only secure in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
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

exports.signup = catchAsync(async (req, res, next) => {
  const { email, password, passwordConfirm, username } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) return next(new AppError("Email already registerd", 400));

  const otp = generateOtp();

  const otpExpires = Date.now() + 10 * 60 * 1000;

  const newUser = await User.create({
    username,
    email,
    password,
    passwordConfirm,
    otp,
    otpExpires,
  });

  try {
    await sendEmail({
      email: newUser.email,
      subject: "Nodemailer Test: OTP Verification for Your Email",
      html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>🔐 Email Verification</h2>
                <p>Hey there! 👋</p>
                <p>You're seeing this message because I'm testing <strong>Nodemailer</strong> for sending emails via Node.js.</p>
                <p>Your One-Time Password (OTP) is:</p>
                <h1 style="color: #007BFF; font-size: 2em;">${otp}</h1>
                <p>This OTP is valid for 10 minutes.</p>
                <hr style="margin: 20px 0;" />
                <p style="font-size: 0.9em; color: #888;">
                    If you didn’t expect this email, you can ignore it. This is just a test 😉
                </p>
                </div>
            `,
    });

    createSendToken(newUser, 200, res, "Registration successful");
  } catch (error) {
    await User.findByIdAndDelete(newUser.id);
    return next(
      new AppError("There is an error sending the email, Try Again", 500)
    );
  }
});

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

  // createSendToken(user, 200, res, "Email has been verified");
  // Don't issue a token here — just confirm success
  res.status(200).json({
    status: "success",
    message: "Email has been verified. Please login to continue.",
  });
});

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
  user.otpExpires = Date.now() + 10* 60 * 1000;

  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: user.email,
      subject: "Nodemailer Test: OTP Verification for Your Email",
      html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>🔐 Email Verification</h2>
                <p>Hey there! 👋</p>
                <p>You're seeing this message because I'm testing <strong>Nodemailer</strong> for sending emails via Node.js.</p>
                <p>Your One-Time Password (OTP) is:</p>
                <h1 style="color: #007BFF; font-size: 2em;">${newOtp}</h1>
                <p>This OTP is valid for 10 minutes.</p>
                <hr style="margin: 20px 0;" />
                <p style="font-size: 0.9em; color: #888;">
                    If you didn’t expect this email, you can ignore it. This is just a test 😉
                </p>
                </div>
            `,
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

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password",400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError("Incorrect Email or Password", 401));
  }


  if (!user.isVerified) {
    return next(
      new AppError("Please verify your email before logging in.", 401)
    );
  }

  // Compare the password with the password save in the database

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect Email or Password", 401));
  }

  // if all things is correct means password and user and email
  createSendToken(user, 200, res, "Login Successfull");
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie("token", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

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
      subject: "Nodemailer Test: OTP Verification for Your Email",
      html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>🔐 Email Verification</h2>
                <p>Hey there! 👋</p>
                <p>You're seeing this message because I'm testing <strong>Nodemailer</strong> for sending emails via Node.js.</p>
                <p>Your One-Time Password (OTP) is:</p>
                <h1 style="color: #007BFF; font-size: 2em;">${otp}</h1>
                <p>This OTP is valid for 10 minutes.</p>
                <hr style="margin: 20px 0;" />
                <p style="font-size: 0.9em; color: #888;">
                    If you didn’t expect this email, you can ignore it. This is just a test 😉
                </p>
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

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { email, otp, password, passwordConfirm } = req.body;

  const user = await User.findOne({
    email,
    resetPasswordOTP: otp,
    resetPasswordOTPExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("No user found", 400));
  }

  user.password = password 
  user.passwordConfirm = passwordConfirm
  user.resetPasswordOTP = undefined;
  user.resetPasswordOTPExpires = undefined;

  await user.save();

  // createSendToken(user, 200, res, "Password reset Successfully");
  // No token here — force login after password reset
  res.status(200).json({
    status: "success",
    message: "Password reset successfully. Please login.",
  });
});
