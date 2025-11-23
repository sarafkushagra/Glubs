const mongoose = require('mongoose');

/**
 * Club Schema
 *
 * Fields:
 *  - name (String): Display name of the club. Required and unique.
 *  - description (String): Short description about the club's purpose/activities.
 *  - createdBy (ObjectId -> User): User who created the club. Required.
 *      - default: a placeholder ObjectId is present in the schema (likely for seeding/dev).
 *  - members ([ObjectId -> User]): Array of user ObjectIds who are members of the club.
 *  - events ([ObjectId -> Event]): Array of Event ObjectIds associated with this club.
 *  - category (String): One of a predefined set of categories (enum). Required with a default.
 *
 * Timestamps option set to true to automatically add `createdAt` and `updatedAt`.
 */

const clubSchema = new mongoose.Schema({
    // Human-readable unique club name
    name: { type: String, required: true, unique: true },

    // Optional longer description to display on club pages
    description: String,

    // The user who created the club. Stored as an ObjectId referencing the User model.
    // - `required: true` ensures every club has an owner
    // - A default ObjectId is present (likely used during development/seeding)
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: '687cd1a8b9b0a7fd9a92382f',
        required: true
    },

    // Members of the club. Array of User ObjectIds. `required: true` inside the
    // subdocument enforces that each array item must be a valid ObjectId reference.
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],

    // Events associated with this club. Stored as references to Event documents.
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true }],

    // Category for filtering/grouping clubs. Enum restricts allowed values.
    // Note: keep enum values and default consistent if you change them later.
    category: { type: String, enum: ['Sports', 'Arts', 'Technology', 'Environment', 'Academic', 'Literature'], required: true, default: 'arts' },
}, { timestamps: true });

// Export the compiled model. Import elsewhere with `require('../schema/club')`.
module.exports = mongoose.model('Club', clubSchema);
