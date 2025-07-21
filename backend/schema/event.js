const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  eventType: { type: String, enum: ['Hackathon', 'Workshop', 'Seminar', 'Other'] },
  date: { type: Date, required: true },
  venue: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  media: [
    {
      type: { type: String, enum: ['image', 'video'] },
      url: String
    }
  ],
  registeredUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  ],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  feedback:[
    {
      type : mongoose.Schema.Types.ObjectId,
      ref: 'Feedback'
    }
  ],
  club: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Club'
  // required: true
},
  views: { type: Number, default: 0 },
  registrations: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 }
}, { timestamps: true });


module.exports = mongoose.models.Event  || mongoose.model('Event', eventSchema);