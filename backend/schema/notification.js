const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    type: { type: String, enum: ['reminder', 'approval', 'announcement'] },
    isRead: { type: Boolean, default: false },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);


// const mongoose = require('mongoose');

// const announcementSchema = new mongoose.Schema({
//     title: String,
//     description: String,
//     image: String,
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth' },
//     validTill: Date
// }, { timestamps: true });

// module.exports = mongoose.model('Announcement', announcementSchema);
