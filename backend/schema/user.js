const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  auth: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    required: true
  },
  name: String,
  age: Number,
  yearOfStudy: String,
  department: String,
  isClubMember: { type: Boolean, default: false },
  clubName: { type: String, default: null }  // optional
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);