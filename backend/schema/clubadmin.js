const mongoose = require('mongoose');

const clubAdminSchema = new mongoose.Schema({
  auth: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    required: true
  },
  name: String,
  club: String,
  position: String,
  year: String,
  department: String,
  universityRollNo: {
    type: String,
    required: true,
    unique: true // ensures one club admin per roll number
  }
}, { timestamps: true });

module.exports = mongoose.model('ClubAdmin', clubAdminSchema);
