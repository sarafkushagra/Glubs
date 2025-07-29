const mongoose = require("mongoose");

const eventRegistrationSchema = mongoose.Schema({
    event : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },

    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    team : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        default: null,
    },

    qrData : {
        type: String,
    },

    isScanned : {
        type : Boolean,
        default: false,
    },

    scannedAt : {
        type : Date,
    },

    registeredAt: {
        type: Date,
        default: Date.now,
    },
}, {timestamps: true});

module.exports = mongoose.models.eventRegistration || mongoose.model('EventRegistration', eventRegistrationSchema)