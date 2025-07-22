// models/event.js

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  // Core Details
  title: { type: String, required: true },
  description: String, // Rich text description
  details: String, // If using rich HTML editor separately
  eventType: { type: String, enum: ['Hackathon', 'Workshop', 'Seminar', 'Quiz', 'Conference', 'Case Study', 'Creative Showcase', 'Other'] },
  date: { type: Date }, // Optional if using registration windows
  venue: String,
  mode: { type: String, enum: ['online', 'offline', 'hybrid'], default: 'online' },

  // Hosting & Visibility
  visibility: { type: String, enum: ['public', 'invite', 'both'], default: 'public' },
  categories: [String], // e.g., Coding, Business, Robotics
  skillsToBeAssessed: String,
  website: String,
  festival: String,

  // Logo and Media
  logo: String, // Base64 or URL
  media: [
    {
      type: { type: String, enum: ['image', 'video'] },
      url: String
    }
  ],

  // Registration Management
  participationType: { type: String, enum: ['Individual', 'Team'], default: 'Individual' },
  teamMin: { type: Number },
  teamMax: { type: Number },
  registrationStart: { type: Date },
  registrationEnd: { type: Date },
  registrationLimit: { type: Number },
  hideContact: { type: Boolean, default: false },

  // User & Club Relations
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club'
  },

  // Engagement Tracking
  registeredUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  feedback: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Feedback'
    }
  ],
  views: { type: Number, default: 0 },
  registrations: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  // Additional fields for the registration form
  prizePool: { type: Number },
  eligibility: {type :String},
  rules: {type : String },
  contactEmail : {type : String},
  contactPhone: {type :String},

}, { timestamps: true });

module.exports = mongoose.models.Event || mongoose.model('Event', eventSchema);
