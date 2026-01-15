const EventAttendance = require("../schema/eventAttendance");
const Event = require("../schema/event");
const { verifyQRToken } = require("../utils/qrCode");

/**
 * Verify QR Code and Mark Attendance
 * 
 * This endpoint is called by club admins when scanning QR codes at events.
 * It verifies the QR token and marks the user as attended.
 */
exports.verifyAttendance = async (req, res) => {
    try {
        const { qrToken } = req.body;
        const clubAdminId = req.user._id;

        if (!qrToken) {
            return res.status(400).json({ message: "QR token is required" });
        }

        // Verify and decode the QR token
        const decoded = verifyQRToken(qrToken);

        if (!decoded || !decoded.valid) {
            return res.status(400).json({
                message: decoded?.reason || "Invalid QR code",
                valid: false
            });
        }

        const { eventId, userId } = decoded;

        // Find the attendance record
        const attendance = await EventAttendance.findOne({ qrToken })
            .populate('event', 'title date club')
            .populate('user', 'username email');

        if (!attendance) {
            return res.status(404).json({
                message: "Attendance record not found",
                valid: false
            });
        }

        // Verify the club admin has permission for this event
        const event = await Event.findById(attendance.event._id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Check if club admin manages this event's club
        const isClubAdmin = req.user.adminOfClubs?.some(
            adminClubId => adminClubId.toString() === event.club.toString()
        );

        const isSystemAdmin = req.user.role === 'admin';

        if (!isClubAdmin && !isSystemAdmin) {
            return res.status(403).json({
                message: "You don't have permission to verify attendance for this event",
                valid: false
            });
        }

        // Check if already verified
        if (attendance.isVerified) {
            return res.status(200).json({
                message: "Attendance already verified",
                valid: true,
                alreadyVerified: true,
                attendance: {
                    user: attendance.user,
                    event: attendance.event,
                    verifiedAt: attendance.verifiedAt,
                    verifiedBy: attendance.verifiedBy,
                }
            });
        }

        // Mark as verified
        attendance.isVerified = true;
        attendance.verifiedAt = new Date();
        attendance.verifiedBy = clubAdminId;

        await attendance.save();

        res.status(200).json({
            message: "Attendance verified successfully",
            valid: true,
            alreadyVerified: false,
            attendance: {
                user: attendance.user,
                event: attendance.event,
                verifiedAt: attendance.verifiedAt,
                registrationType: attendance.registrationType,
            }
        });

    } catch (error) {
        console.error("Error verifying attendance:", error);
        res.status(500).json({
            message: "Error verifying attendance",
            error: error.message,
            valid: false
        });
    }
};

/**
 * Get Attendance Statistics for an Event
 * 
 * Returns attendance stats for club admins to track event attendance
 */
exports.getEventAttendance = async (req, res) => {
    try {
        const { eventId } = req.params;
        const clubAdminId = req.user._id;

        // Verify event exists and admin has permission
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Check if club admin manages this event's club
        const isClubAdmin = req.user.adminOfClubs?.some(
            adminClubId => adminClubId.toString() === event.club.toString()
        );

        const isSystemAdmin = req.user.role === 'admin';

        if (!isClubAdmin && !isSystemAdmin) {
            return res.status(403).json({
                message: "You don't have permission to view attendance for this event"
            });
        }

        // Get all attendance records for this event
        const attendanceRecords = await EventAttendance.find({ event: eventId })
            .populate('user', 'username email yearOfStudy department')
            .populate('verifiedBy', 'username')
            .sort({ verifiedAt: -1 });

        const totalRegistered = attendanceRecords.length;
        const totalVerified = attendanceRecords.filter(a => a.isVerified).length;
        const verificationRate = totalRegistered > 0
            ? ((totalVerified / totalRegistered) * 100).toFixed(2)
            : 0;

        res.status(200).json({
            event: {
                id: event._id,
                title: event.title,
                date: event.date,
                venue: event.venue,
            },
            statistics: {
                totalRegistered,
                totalVerified,
                totalPending: totalRegistered - totalVerified,
                verificationRate: `${verificationRate}%`,
            },
            attendanceRecords: attendanceRecords.map(record => ({
                user: record.user,
                registrationType: record.registrationType,
                isVerified: record.isVerified,
                verifiedAt: record.verifiedAt,
                verifiedBy: record.verifiedBy,
                registeredAt: record.registeredAt,
            })),
        });

    } catch (error) {
        console.error("Error fetching event attendance:", error);
        res.status(500).json({
            message: "Error fetching attendance data",
            error: error.message
        });
    }
};

/**
 * Get My Attendance Records
 * 
 * Returns attendance records for the authenticated user
 */
exports.getMyAttendance = async (req, res) => {
    try {
        const userId = req.user._id;

        const attendanceRecords = await EventAttendance.find({ user: userId })
            .populate('event', 'title date venue eventType')
            .sort({ createdAt: -1 });

        res.status(200).json({
            total: attendanceRecords.length,
            verified: attendanceRecords.filter(a => a.isVerified).length,
            records: attendanceRecords.map(record => ({
                event: record.event,
                registrationType: record.registrationType,
                isVerified: record.isVerified,
                verifiedAt: record.verifiedAt,
                registeredAt: record.registeredAt,
            })),
        });

    } catch (error) {
        console.error("Error fetching user attendance:", error);
        res.status(500).json({
            message: "Error fetching attendance records",
            error: error.message
        });
    }
};
