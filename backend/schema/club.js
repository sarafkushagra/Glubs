const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: '687cd1a8b9b0a7fd9a92382f',
        required: true
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true }],
    category: { type: String, enum: ['Sports', 'Arts', 'Technology', 'Environment', 'Academic', 'Literature'], required: true, default: 'arts' },
}, { timestamps: true });

module.exports = mongoose.model('Club', clubSchema);
