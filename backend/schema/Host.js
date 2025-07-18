const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const hostSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords do not match",
      },
    },
    organization: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    hostedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password
hostSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// Compare password
hostSchema.methods.correctPassword = async function (password, userPassword) {
  return await bcrypt.compare(password, userPassword);
};


module.exports = mongoose.models.Host || mongoose.model("Host", hostSchema);