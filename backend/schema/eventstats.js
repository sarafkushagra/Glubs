const mongoose = require('mongoose');

const eventStatsSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  views: { type: Number, default: 0 },
  registrations: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('EventStats', eventStatsSchema);