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

    // Restrict payments to Student role only
    if (req.user.role !== "student") {
        return next(new AppError("Only students can register and pay for events.", 403));
    }

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

module.exports.getClubPaymentAnalytics = catchAsync(async (req, res, next) => {
    // 1. Find the club managed by this user
    // Assuming 1-to-1 mapping for Club Admin -> Club as per existing schema patterns
    const Club = require("../schema/club");
    // If global admin, maybe show all (but for now focus on club admin logic)

    // Check if user is authorized (Club Admin or Admin)
    if (!["club-admin", "admin"].includes(req.user.role)) {
        return next(new AppError("You are not authorized to view this data", 403));
    }

    let adminClubIds = [];
    if (req.user.role === "club-admin") {
        adminClubIds = req.user.adminOfClubs || [];
        if (adminClubIds.length === 0) {
            // Fallback find clubs created by user
            const foundClubs = await Club.find({ createdBy: req.user._id }).select("_id");
            adminClubIds = foundClubs.map(c => c._id);
        }
    } else if (req.user.role === "admin") {
        // Global admin sees all? Or we can keep it empty to fetch nothing until they select a club context. 
        // For simplicity, if global admin, let's fetch all events (or we might need a specific club query param later).
        // For now, let's assume global admin acts as a super-viewer.
        // But the dashboard is likely "Club Admin Dashboard", so maybe just return 0 if no specific club context.
        // However, existing code implies we want to show data. Let's fetch all clubs for admin.
        const allClubs = await Club.find({}).select("_id");
        adminClubIds = allClubs.map(c => c._id);
    }

    if (adminClubIds.length === 0) {
        return res.status(200).json({
            status: "success",
            data: {
                totalRevenue: 0,
                totalTransactions: 0,
                eventAnalytics: [],
                recentTransactions: []
            }
        });
    }

    // Find all events for these clubs directly
    const events = await Event.find({ club: { $in: adminClubIds } }).select("_id");
    const eventIds = events.map(e => e._id);

    // 2. Aggregate Payments for these events
    // Overall Stats
    const totalStats = await Payment.aggregate([
        { $match: { event: { $in: eventIds }, status: "captured" } },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$amount" }, // stored as simple number? schema says Number. 
                // Wait, controller createOrder says: amount = event.registrationFee * 100
                // Schema says amount: type Number. 
                // We should check if stored amount is in paise or rupees. 
                // In createOrder: payment.amount = event.registrationFee (Line 74)
                // In razorpay options: amount (line 64) is fee * 100.
                // So stored amount in DB is likely the raw Rupee value (lines 74).
                // "payment.amount = event.registrationFee" -> This is simple rupees.
                count: { $sum: 1 }
            }
        }
    ]);

    // Event-wise Stats
    const eventStats = await Payment.aggregate([
        { $match: { event: { $in: eventIds }, status: "captured" } },
        {
            $group: {
                _id: "$event",
                revenue: { $sum: "$amount" },
                count: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: "events",
                localField: "_id",
                foreignField: "_id",
                as: "eventDetails"
            }
        },
        { $unwind: "$eventDetails" },
        {
            $project: {
                eventId: "$_id",
                title: "$eventDetails.title",
                revenue: 1,
                count: 1
            }
        }
    ]);

    // Recent Transactions (Detailed)
    // We want "person pay how much n total"
    const recentTransactions = await Payment.find({ event: { $in: eventIds }, status: "captured" })
        .sort({ createdAt: -1 })
        .limit(50)
        .populate("user", "username email")
        .populate("event", "title");

    res.status(200).json({
        status: "success",
        data: {
            totalRevenue: totalStats[0]?.totalRevenue || 0,
            totalTransactions: totalStats[0]?.count || 0,
            eventAnalytics: eventStats,
            recentTransactions
        }
    });
});
