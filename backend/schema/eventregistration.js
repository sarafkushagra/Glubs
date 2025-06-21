const mongoose = require('mongoose');

const eventRegistrationSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  qrCode: {
    type: String,
    required: true,
    unique: true // ensures one QR per registration
  },

  isScanned: {
    type: Boolean,
    default: false
  },

  registrationDate: {
    type: Date,
    default: null
  },

  status: {
    type: String,
    enum: ['Registered', 'cancelled', 'attended'],
    default: 'Registered'
  }

}, { timestamps: true });

eventRegistrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('EventRegistration', eventRegistrationSchema);