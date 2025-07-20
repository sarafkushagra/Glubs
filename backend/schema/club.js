const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: true }],
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' , required: true }],
}, { timestamps: true });

module.exports = mongoose.model('Club', clubSchema);
