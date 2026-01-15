const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../schema/payment");
const Event = require("../schema/event");
const Team = require("../schema/team");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const eventController = require("./event");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports.createOrder = catchAsync(async (req, res, next) => {
    const { eventId, registrationType, teamId } = req.body;
    const userId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) return next(new AppError("Event not found", 404));

    if (event.registrationFee <= 0) {
        return next(new AppError("This event is free. Please register directly.", 400));
    }

    // Check if user is already registered
    if (event.registeredUsers.includes(userId)) {
        return next(new AppError("You are already registered for this event", 400));
    }

    let amount = event.registrationFee * 100; // Default amount (per registration)

    // If team registration, check if team exists and user is leader
    if (registrationType === "team") {
        if (!teamId) return next(new AppError("Team ID is required for team registration", 400));
        const team = await Team.findById(teamId).populate("members");
        if (!team) return next(new AppError("Team not found", 404));
        if (team.leader.toString() !== userId.toString()) {
            return next(new AppError("Only team leaders can pay for the team", 403));
        }

        // Check team size
        if (team.members.length < event.teamMin || team.members.length > event.teamMax) {
            return next(new AppError(`Team size must be between ${event.teamMin} and ${event.teamMax}`, 400));
        }

        // Check if any member is already registered
        const memberIds = team.members.map(m => m._id.toString());
        const alreadyRegistered = event.registeredUsers.some(regId => memberIds.includes(regId.toString()));
        if (alreadyRegistered) {
            return next(new AppError("One or more team members are already registered for this event", 400));
        }

        // Calculate total amount: fee per person * number of members
        amount = event.registrationFee * team.members.length * 100;
    }

    const options = {
        amount,
        currency: "INR",
        receipt: `rcpt_${Date.now()}_${userId.toString().slice(-6)}`,
    };

    const order = await razorpay.orders.create(options);

    const payment = new Payment({
        user: userId,
        event: eventId,
        amount: event.registrationFee,
        razorpayOrderId: order.id,
        registrationType,
        team: teamId || null,
        status: "pending",
    });

    await payment.save();

    res.status(200).json({
        status: "success",
        order,
    });
});

module.exports.verifyPayment = catchAsync(async (req, res, next) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
        return next(new AppError("Payment verification failed", 400));
    }

    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) return next(new AppError("Payment record not found", 404));

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = "captured";
    await payment.save();

    // Trigger registration logic
    req.params.id = payment.event.toString(); // For consistency with eventController

    // We need to pass the request to the existing registration functions
    // But those functions expect the user in req.user (which we have)
    // And event ID in req.params.id

    if (payment.registrationType === "individual") {
        return eventController.registerUserToEvent(req, res);
    } else {
        req.body.teamId = payment.team.toString();
        req.params.eventId = payment.event.toString();
        return eventController.registerTeamToEvent(req, res);
    }
});
