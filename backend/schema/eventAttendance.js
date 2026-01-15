const mongoose = require("mongoose");

/**
 * EventAttendance Schema
 * 
 * Tracks attendance for events using QR code verification.
 * Each registration generates a unique encrypted QR code token.
 * 
 * Fields:
 *  - event: Reference to the Event
 *  - user: Reference to the User who registered
 *  - qrToken: Encrypted unique token for QR code verification
 *  - isVerified: Whether the user has checked in via QR scan
 *  - verifiedAt: Timestamp when QR code was scanned
 *  - verifiedBy: Club admin who scanned the QR code
 *  - registrationType: 'individual' or 'team'
 *  - teamId: Reference to Team if team registration
 */

const eventAttendanceSchema = new mongoose.Schema(
    {
        // Event reference
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
            index: true,
        },

        // User who registered for the event
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        // Encrypted QR token - unique per registration
        // This is generated using crypto and contains: eventId + userId + timestamp
        qrToken: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        // Attendance verification status
        isVerified: {
            type: Boolean,
            default: false,
        },

        // When the QR code was scanned
        verifiedAt: {
            type: Date,
        },

        // Club admin who verified the attendance
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        // Registration type
        registrationType: {
            type: String,
            enum: ["individual", "team"],
            required: true,
        },

        // Team reference if team registration
        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
        },

        // Additional metadata
        registeredAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Compound index to prevent duplicate registrations
eventAttendanceSchema.index({ event: 1, user: 1 }, { unique: true });

// Index for quick lookups by QR token
eventAttendanceSchema.index({ qrToken: 1 });

// Index for finding unverified attendees
eventAttendanceSchema.index({ event: 1, isVerified: 1 });

module.exports =
    mongoose.models.EventAttendance ||
    mongoose.model("EventAttendance", eventAttendanceSchema);
