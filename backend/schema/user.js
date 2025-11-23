const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")

/*
  Schema: User
  Purpose:
    - Represents an application user (students, club-admins, admins).
    - Stores authentication fields (email, password, OTPs), profile
      info (username, age, department), and relations to clubs.

  Developer notes:
    - `password` is stored hashed (see pre-save hook) and excluded by
      default from queries with `select: false`.
    - `passwordConfirm` is only used at validation time and removed
      before saving to the DB (set to `undefined` in pre-save hook).
    - Keep role transition logic (e.g. requesting club-admin) in the
      service/controller layer; schema only captures requestedRole state.
    - OTP fields (`otp`, `resetPasswordOTP`) are stored as strings with
      expiry timestamps; consider encrypting OTPs for extra security.
*/

const userSchema = new mongoose.Schema(
  {
    // Short display name / handle for the user.
    username: {
      type: String,
      required: [true, "Please provide username"],
      trim: true,
      minlength: 3,
      maxlength: 30,
      index: true,
    },

    // Email used for authentication & communication. Enforced unique.
    email: {
      type: String,
      required: [true, "Please Provide an email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },

    // Hashed password. `select: false` prevents it from being returned
    // in queries unless explicitly requested.
    password: {
      type: String,
      required: [true, "Please Provide a password"],
      minlength: 8,
      select: false,
    },

    // Used only for validation on sign-up. Removed before save.
    passwordConfirm: {
      type: String,
      required: [true, "Please Confirm your password"],
      validate: {
        // Works on create/save — ensures confirm matches password.
        validator: function (el) {
          return el === this.password
        },
        message: "Passwords are not same",
      },
    },

    // User role and possible requested role transitions.
    role: {
      type: String,
      enum: ["student", "club-admin", "admin", "pending-club-admin"],
      default: "student",
      required: true,
    },

    requestedRole: {
      // Tracks role requests; currently only used for pending-club-admin.
      type: String,
      enum: ["pending-club-admin"],
      default: null,
    },

    age: { type: Number },

    // Academic year; defaults to first year.
    yearOfStudy: {
      type: String,
      enum: ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"],
      default: "1st Year",
      required: true,
    },

    department: { type: String },

    // Lightweight club membership flag and relations.
    isClubMember: {
      type: Boolean,
      default: false,
    },

    // Support multiple club memberships.
    memberOfClubs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club",
      },
    ],

    // Clubs this user administers.
    adminOfClubs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club",
      },
    ],

    // Email / account verification state.
    isVerified: {
      type: Boolean,
      default: false,
    },

    // OTP and expiry fields used for email verification flows.
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },

    // Reset password OTP and expiry (kept separate from sign-up OTP).
    resetPasswordOTP: { type: String, default: null },
    resetPasswordOTPExpires: { type: Date, default: null },

    // createdAt provided for legacy compatibility; timestamps option also
    // creates `createdAt` and `updatedAt` automatically.
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

// Hash password before saving when it's modified.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  this.password = await bcrypt.hash(this.password, 12)

  // Remove passwordConfirm so it is not stored in DB.
  this.passwordConfirm = undefined

  next()
})

// Instance method: compare supplied password with stored hashed password.
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

// Export compiled model if already registered, otherwise compile.
module.exports = mongoose.models.User || mongoose.model("User", userSchema)
