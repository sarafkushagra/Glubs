const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'club-admin', 'admin'],
    default: 'user'
  }
}, { timestamps: true });

module.exports = mongoose.model('Auth', authSchema);