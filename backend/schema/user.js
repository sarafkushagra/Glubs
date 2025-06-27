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
  club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);