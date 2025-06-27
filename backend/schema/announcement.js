const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth' },
    validTill: Date
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
