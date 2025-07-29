const EventRegistration = require("../schema/EventRegistration");
const QRCode = require("qrcode");
const User = require("../schema/user");
const Event = require("../schema/event");
const sendEmail = require("../utils/email")



// exports.registerForEvent = async (req, res) => {
//   const eventId = req.params.eventId;
//   const userId = req.user._id; // This should come from auth middleware

//   console.log("👉 EVENT ID:", req.params.eventId);
// console.log("👉 USER ID:", req.user?._id);

//   try {
//     // 1. Check if already registered
//     const existing = await EventRegistration.findOne({
//       event: eventId,
//       user: userId,
//     });
//     if (existing)
//       return res.status(400).json({ message: "Already registered" });

//     // 2. Create registration
//     const newReg = await EventRegistration.create({
//       event: eventId,
//       user: userId,
//     });

//     // 3. Generate QR Code data
//     const qrData = JSON.stringify({
//       userId: userId.toString(),
//       eventId: eventId.toString(),
//     });

//     const qrImage = await QRCode.toDataURL(qrData); // base64 PNG string

//     // 4. Save qrData to registration record
//     newReg.qrData = qrData;
//     await newReg.save();

//     // 5. Send QR Email
//     const user = await User.findById(userId);
//     const event = await Event.findById(eventId);

//     await sendEmail({
//       email: user.email,
//       subject: `QR Pass for ${event.title}`,
//       html: `<p>Hello ${user.name},</p>
//              <p>You are registered for <strong>${event.title}</strong>.</p>
//              <p>Show this QR at the event entry:</p>
//              <img src="${qrImage}" alt="QR Code" />
//              <p>Thank you,<br/>Glubs Team</p>`,
//     });

//     res.status(200).json({ message: "Registered and QR sent!" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Registration failed." });
//   }
// };




exports.registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user._id;

    console.log("👉 EVENT ID:", eventId);
    console.log("👉 USER ID:", userId);

    // 1. Validate event existence
    const event = await Event.findById(eventId);
    if (!event) {
      console.log("❌ Event not found");
      return res.status(400).json({ message: "Invalid event ID" });
    }

    // 2. Check if already registered
    const existing = await EventRegistration.findOne({
      event: eventId,
      user: userId,
    });
    if (existing) {
      console.log("⚠️ Already registered");
      return res.status(400).json({ message: "Already registered for this event" });
    }

    // 3. Create registration
    const newReg = await EventRegistration.create({
      event: eventId,
      user: userId,
    });

    // 4. Generate QR Code with event & user data
    const qrData = JSON.stringify({
      userId: userId.toString(),
      eventId: eventId.toString(),
      eventTitle: event.title,
    });

    const qrImage = await QRCode.toDataURL(qrData); // returns base64 image

    // 5. Attach QR to registration and save
    newReg.qrData = qrData;
    await newReg.save();

    // 6. Fetch full user info
    const user = await User.findById(userId);

    console.log("📸 QR Image Sample:", qrImage.slice(0, 100));


    // 7. Send email with QR Code
await sendEmail({
  email: user.email,
  subject: `🎟️ QR Pass for ${event.title}`,
  html: `
    <p>Hello <strong>${user.name}</strong>,</p>
    <p>You have successfully registered for the event <strong>${event.title}</strong>.</p>
    <p>Present the following QR code at the event:</p>
    <img src="cid:qrCodeImage" alt="QR Code" style="max-width: 300px;" />
    <p>Thanks & Regards,<br/>Glubs Team</p>
  `,
  qrImageBase64: qrImage.slice(0, 100),
});


    console.log("✅ Registration and QR sent!");
    res.status(200).json({ message: "Successfully registered and QR code sent to email." });

  } catch (error) {
    console.error("❌ Error in registerForEvent:", error);
    res.status(500).json({ message: "Registration failed. Please try again later." });
  }
};
