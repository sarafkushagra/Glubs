/**
 * attendance.js (router)
 * Routes for attendance verification and tracking
 *
 * Routes:
 *  - POST   /verify              -> verify QR code and mark attendance (club-admin or admin)
 *  - GET    /event/:eventId      -> get attendance stats for an event (club-admin or admin)
 *  - GET    /my-attendance       -> get user's own attendance records (authenticated)
 */

const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance');
const { isAuthenticated, restrictTo } = require('../middlewares/auth');

// ---------------------------------------------------------------------------
// Verify QR Code and Mark Attendance
// POST /verify
// Middleware: isAuthenticated, restrictTo('club-admin', 'admin')
// Controller: attendanceController.verifyAttendance
// Body: { qrToken: string }
// ---------------------------------------------------------------------------
router.post('/verify',
    isAuthenticated,
    restrictTo('club-admin', 'admin'),
    attendanceController.verifyAttendance
);

// ---------------------------------------------------------------------------
// Get Attendance Statistics for an Event
// GET /event/:eventId
// Middleware: isAuthenticated, restrictTo('club-admin', 'admin')
// Controller: attendanceController.getEventAttendance
// ---------------------------------------------------------------------------
router.get('/event/:eventId',
    isAuthenticated,
    restrictTo('club-admin', 'admin'),
    attendanceController.getEventAttendance
);

// ---------------------------------------------------------------------------
// Get My Attendance Records
// GET /my-attendance
// Middleware: isAuthenticated
// Controller: attendanceController.getMyAttendance
// ---------------------------------------------------------------------------
router.get('/my-attendance',
    isAuthenticated,
    attendanceController.getMyAttendance
);

module.exports = router;
