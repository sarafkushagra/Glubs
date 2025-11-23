const mongoose = require('mongoose');

/*
    Schema: Feedback
    Purpose:
        - Stores feedback left by a `User` for an `Event`.
        - Keeps a numeric `rating` (1-5), an optional text `review`,
            and a `createdAt` timestamp.

    Notes for developers:
        - `event` and `user` are required ObjectId references to the
            `Event` and `User` collections respectively.
        - `rating` is optional but constrained between 1 and 5 if provided.
        - This schema is intentionally small and focused; expand fields
            (e.g. `anonymous`, `helpfulCount`) only when the use-case needs them.
*/

const feedbackSchema = new mongoose.Schema({
    // Reference to the Event this feedback is about. Required.
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },

    // Reference to the User who left the feedback. Required.
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Numeric rating from 1 (worst) to 5 (best). Optional.
    rating: { type: Number, min: 1, max: 5 },

    // Free-text review left by the user. Optional.
    review: String,

    // Timestamp when the feedback was created. Defaults to now.
    createdAt: { type: Date, default: Date.now }
});

// Export the compiled model. Use singular capitalized name `Feedback`.
module.exports = mongoose.model('Feedback', feedbackSchema);
