const EventRegistration = require("../schema/EventRegistration");
const Event = require('../schema/event');
const ClubAdmin = require('../schema/user'); // Assuming you have this model



exports.verifyQR = async (req, res) => {
  try {
    const { qrData } = req.body;
    const parsed = JSON.parse(qrData);

    // 🧑‍💼 Get the user who is scanning the QR (from req.user assuming auth middleware sets it)
    const scanner = await User.findById(req.user.id); // or req.user._id depending on your middleware

    if (!scanner || scanner.role !== 'club-admin') {
      return res.status(403).json({ message: 'Only club-admins can scan QR codes.' });
    }

    // 🧾 Get the event being scanned
    const event = await Event.findById(parsed.eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // 🛡️ Club check
    if (String(scanner.club) !== String(event.club)) {
      return res.status(403).json({ message: 'Access denied. This event is not under your club.' });
    }

    // 🗃️ Fetch registration using QR details
    const reg = await EventRegistration.findOne({
      event: parsed.eventId,
      user: parsed.userId,
      qrData,
    }).populate('user event');

    if (!reg) {
      return res.status(404).json({ message: 'QR invalid or registration not found.' });
    }

    if (reg.isScanned) {
      return res.status(400).json({
        message: `Already scanned on ${reg.scannedAt.toLocaleString()}`,
        user: reg.user.username,
        event: reg.event.title,
      });
    }

    // ✅ Mark scanned
    reg.isScanned = true;
    reg.scannedAt = new Date();
    await reg.save();

    return res.status(200).json({
      message: 'QR Verified — Entry Granted ✅',
      user: reg.user.username,
      event: reg.event.title,
      scannedAt: reg.scannedAt,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error or corrupted QR.' });
  }
};




// const EventRegistration = require("../models/EventRegistration");
// const Event = require("../models/Event");

// exports.verifyQR = async (req, res) => {
//   try {
//     const { qrData, scannedBy } = req.body;
//     const parsed = JSON.parse(qrData);

//     const reg = await EventRegistration.findOne({
//       event: parsed.eventId,
//       user: parsed.userId,
//       qrData,
//     }).populate("user event");

//     if (!reg) return res.status(404).json({ message: "QR invalid or registration not found." });

//     // ✅ Prevent cross-club scanning
//     if (reg.event.club.toString() !== req.user.club?.toString()) {
//       return res.status(403).json({ message: "You are not authorized to scan this event's QR." });
//     }

//     if (reg.isScanned) {
//       return res.status(400).json({
//         message: `Already scanned on ${reg.scannedAt.toLocaleString()}`,
//         user: reg.user.username,
//         event: reg.event.title,
//       });
//     }

//     reg.isScanned = true;
//     reg.scannedAt = new Date();
//     await reg.save();

//     res.status(200).json({
//       message: "QR Verified — Entry Granted ✅",
//       user: reg.user.username,
//       event: reg.event.title,
//       scannedAt: reg.scannedAt,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error or corrupted QR." });
//   }
// };
