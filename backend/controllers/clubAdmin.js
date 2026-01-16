const Club = require("../schema/club")
const User = require("../schema/user")
const ClubJoinRequest = require("../schema/clubJoinRequest") // Fixed import path
const Event = require("../schema/event")
const Payment = require("../schema/payment")
const Team = require("../schema/team")
const sendEmail = require("../utils/email")
const { request } = require("express")

// Get club admin dashboard data
exports.getDashboardData = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin"

    // Self-healing: If club-admin has no clubs in adminOfClubs, check createdBy
    if (!isAdmin && (!req.user.adminOfClubs || req.user.adminOfClubs.length === 0)) {
      const createdClubs = await Club.find({ createdBy: req.user._id });
      if (createdClubs.length > 0) {
        req.user.adminOfClubs = createdClubs.map(c => c._id);
        await User.findByIdAndUpdate(req.user._id, { adminOfClubs: req.user.adminOfClubs });
        console.log(`[Dashboard] Auto-fixed adminOfClubs for ${req.user.username}: Found ${createdClubs.length} clubs`);
      }
    }

    console.log(`[Dashboard] User: ${req.user.username}, Role: ${req.user.role}, AdminOfClubs:`, req.user.adminOfClubs);

    const adminClubsFilter = isAdmin ? {} : { _id: { $in: req.user.adminOfClubs || [] } }
    const clubIdList = isAdmin ? null : (req.user.adminOfClubs || [])

    // Get clubs
    const adminClubs = await Club.find(adminClubsFilter)
      .populate("members", "username email yearOfStudy department")

    // Get pending join requests
    const requestFilter = isAdmin ? { status: "pending" } : { club: { $in: clubIdList }, status: "pending" }
    const pendingRequests = await ClubJoinRequest.find(requestFilter)
      .populate("user", "username email yearOfStudy department")
      .populate("club", "name")
      .sort({ createdAt: -1 })

    // Get recent events
    const eventFilter = isAdmin ? {} : { club: { $in: clubIdList } }
    const recentEvents = await Event.find(eventFilter)
      .populate("createdBy", "username")
      .sort({ createdAt: -1 })
      .limit(5)

    // Calculate statistics
    const stats = {
      totalClubs: adminClubs.length,
      totalMembers: adminClubs.reduce((sum, club) => sum + club.members.length, 0),
      pendingRequests: pendingRequests.length,
      totalEvents: await Event.countDocuments(eventFilter),
    }

    // Calculate Registration Trend (Last 7 Days)
    const trend = []
    const now = new Date()
    const managedEvents = await Event.find(eventFilter).select("_id eventType")
    const managedEventIds = managedEvents.map(e => e._id)

    // Aggregate payments/registrations for these events
    // We'll use Payments as a proxy for "Verified Registrations", or we could use Event.registeredUsers if populated with joined dates
    // For simplicity and accuracy with the requested graph, let's use Payments created in the last 7 days for these events
    const recentPayments = await Payment.find({
      event: { $in: managedEventIds },
      createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
    })

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const startOfDay = new Date(d.setHours(0, 0, 0, 0))
      const endOfDay = new Date(d.setHours(23, 59, 59, 999))

      const dayName = startOfDay.toLocaleDateString("en-US", { weekday: "short" })
      const count = recentPayments.filter(p => {
        const pDate = new Date(p.createdAt)
        return pDate >= startOfDay && pDate <= endOfDay
      }).length

      trend.push({ date: dayName, registrations: count })
    }

    // Calculate Event Types Distribution
    const typeDist = {}
    managedEvents.forEach(e => {
      typeDist[e.eventType] = (typeDist[e.eventType] || 0) + 1
    })

    // Format for Recharts PieChart (name, value, color)
    const eventTypes = Object.entries(typeDist).map(([name, value], index) => ({
      name,
      value: Math.round((value / managedEvents.length) * 100), // percentage
      count: value,
      color: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"][index % 6]
    }))

    res.json({
      clubs: adminClubs,
      pendingRequests,
      recentEvents,
      stats,
      trends: {
        registration: trend,
        eventTypes
      }
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    res.status(500).json({ message: "Error fetching dashboard data", error: error.message })
  }
}

// Get all join requests for admin's clubs
exports.getJoinRequests = async (req, res) => {
  try {
    const { status = "pending", clubId } = req.query

    const isAdmin = req.user.role === "admin"
    let clubFilter = isAdmin ? null : (req.user.adminOfClubs || [])

    if (clubId && (isAdmin || clubFilter.includes(clubId))) {
      clubFilter = [clubId]
    }

    const query = {
      ...(clubFilter && { club: { $in: clubFilter } }),
      status,
    }


    const requests = await ClubJoinRequest.find(query)
      .populate("user", "username email yearOfStudy department age")
      .populate("club", "name category")
      .populate("reviewedBy", "username")
      .sort({ createdAt: -1 })

    res.json({ requests })
  } catch (error) {
    console.error("Error fetching join requests:", error)
    res.status(500).json({ message: "Error fetching join requests", error: error.message })
  }
}

// Accept/Reject join request
exports.handleJoinRequest = async (req, res) => {
  try {
    const { requestId } = req.params
    const { action, rejectionReason } = req.body
    const adminId = req.user._id

    const request = await ClubJoinRequest.findById(requestId)
      .populate("user", "username email")
      .populate("club", "name members")

    if (!request) {
      return res.status(404).json({ message: "Request not found" })
    }

    // Check if admin manages this club
    const isAdmin = req.user.role === "admin"
    const isClubAdmin = req.user.adminOfClubs?.some(id => id.toString() === request.club._id.toString())

    if (!isAdmin && !isClubAdmin) {
      return res.status(403).json({ message: "You don't have permission to manage this club" })
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request has already been processed" })
    }

    if (action === "accept") {
      // Add user to club members
      const club = await Club.findById(request.club._id)
      if (!club.members.includes(request.user._id)) {
        club.members.push(request.user._id)
        await club.save()
      }

      // Update user's club membership
      await User.findByIdAndUpdate(request.user._id, {
        $addToSet: { memberOfClubs: request.club._id },
        $set: {
          isClubMember: true,
          club: request.club.name, // optional: if you want to store club name
        },
      })


      request.status = "accepted"
      request.reviewedBy = adminId
      request.reviewedAt = new Date()

      // Send acceptance email
      if (typeof sendEmail === "function") {
        try {
          await sendEmail({
            email: request.user.email,
            subject: `Welcome to ${request.club.name}! 🎉`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #10b981;">Congratulations! 🎉</h2>
                <p>Hello ${request.user.username},</p>
                <p>Great news! Your request to join <strong>${request.club.name}</strong> has been <strong>accepted</strong>!</p>
                <p>You are now an official member of the club. You can now:</p>
                <ul>
                  <li>Participate in club events</li>
                  <li>Access club resources</li>
                  <li>Connect with other members</li>
                </ul>
                <p>Welcome to the community!</p>
                <p>Best regards,<br>The Glubs Team</p>
              </div>
            `,
          })
        } catch (emailError) {
          console.error("Error sending acceptance email:", emailError)
        }
      }
    } else if (action === "reject") {
      request.status = "rejected"
      request.reviewedBy = adminId
      request.reviewedAt = new Date()
      request.rejectionReason = rejectionReason || "No reason provided"

      // Send rejection email
      if (typeof sendEmail === "function") {
        try {
          await sendEmail({
            email: request.user.email,
            subject: `Update on your club membership request`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #ef4444;">Club Membership Update</h2>
                <p>Hello ${request.user.username},</p>
                <p>Thank you for your interest in joining <strong>${request.club.name}</strong>.</p>
                <p>Unfortunately, your membership request has not been approved at this time.</p>
                ${rejectionReason ? `<p><strong>Reason:</strong> ${rejectionReason}</p>` : ""}
                <p>You're welcome to apply again in the future or explore other clubs that might be a great fit for you!</p>
                <p>Best regards,<br>The Glubs Team</p>
              </div>
            `,
          })
        } catch (emailError) {
          console.error("Error sending rejection email:", emailError)
        }
      }
    } else {
      return res.status(400).json({ message: "Invalid action. Use 'accept' or 'reject'" })
    }

    await request.save()

    res.json({
      message: `Request ${action}ed successfully`,
      request,
    })
  } catch (error) {
    console.error("Error handling join request:", error)
    res.status(500).json({ message: "Error processing request", error: error.message })
  }
}

// Remove member from club
exports.removeMember = async (req, res) => {
  const { clubId, memberId } = req.params;

  try {
    const club = await Club.findById(clubId);
    if (!club) return res.status(404).json({ message: "Club not found" });

    // Check permissions
    const isAdmin = req.user.role === "admin"
    const isClubAdmin = req.user.adminOfClubs?.some(id => id.toString() === clubId)

    if (!isAdmin && !isClubAdmin) {
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }

    // Remove member
    club.members = club.members.filter(
      (id) => id.toString() !== memberId
    );
    await club.save();

    res.status(200).json({ message: "Member removed successfully" });
  } catch (err) {
    console.error("Error removing member:", err);
    res.status(500).json({ message: "Error removing member" });
  }
};

// Get club members with details
exports.getClubMembers = async (req, res) => {
  try {
    const { clubId } = req.params

    // Check permissions
    const isAdmin = req.user.role === "admin"
    const isClubAdmin = req.user.adminOfClubs?.some(id => id.toString() === clubId)

    if (!isAdmin && !isClubAdmin) {
      return res.status(403).json({ message: "You don't have permission to view this club's members" })
    }

    const club = await Club.findById(clubId).populate("members", "username email yearOfStudy department age createdAt")

    if (!club) {
      return res.status(404).json({ message: "Club not found" })
    }

    res.json({
      club: {
        name: club.name,
        description: club.description,
        category: club.category,
      },
      members: club.members,
    })
  } catch (error) {
    console.error("Error fetching club members:", error)
    res.status(500).json({ message: "Error fetching club members", error: error.message })
  }
}

// Get detailed event statistics
exports.getEventStats = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId).populate("registeredUsers");
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if user is admin or club-admin of the club that owns this event
    const isAdmin = req.user.role === "admin";
    const isClubAdmin = req.user.adminOfClubs?.some(id => id.toString() === event.club.toString());

    if (!isAdmin && !isClubAdmin) {
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }

    const totalRegistrations = event.registeredUsers.length;

    // Fetch all related payments including incomplete ones
    const payments = await Payment.find({ event: eventId }).populate("user");

    const completeRegistrations = payments.filter(p => p.status === "captured").length;
    // Incomplete are those who initiated payment but didn't finish, or registered but didn't pay
    const incompleteRegistrations = Math.max(0, payments.length - completeRegistrations);

    // Calculate daily trend for the last 7 days
    const trend = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const nextD = new Date(d);
      nextD.setDate(d.getDate() + 1);

      // We use payment creation as a proxy for registration intent/action
      const dayPayments = payments.filter(p => {
        const pDate = new Date(p.createdAt);
        return pDate >= d && pDate < nextD;
      });

      trend.push({
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        total: dayPayments.length,
        male: dayPayments.filter(p => p.user?.gender === "Male").length,
        female: dayPayments.filter(p => p.user?.gender === "Female").length,
      });
    }

    // Demographics
    const yearStats = {};
    const interestStats = {};

    event.registeredUsers.forEach(user => {
      yearStats[user.yearOfStudy] = (yearStats[user.yearOfStudy] || 0) + 1;
      if (user.interests && Array.isArray(user.interests)) {
        user.interests.forEach(interest => {
          interestStats[interest] = (interestStats[interest] || 0) + 1;
        });
      }
    });

    res.json({
      success: true,
      stats: {
        totalRegistrations,
        completeRegistrations,
        incompleteRegistrations,
        views: event.views || 0,
      },
      trend,
      demographics: {
        yearStats,
        interestStats,
      }
    });
  } catch (error) {
    console.error("Error in getEventStats:", error);
    res.status(500).json({ message: "Error fetching event statistics", error: error.message });
  }
};

// Get detailed list of participants for an event (for CSV and detailed view)
exports.getEventParticipants = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check permissions
    const isAdmin = req.user.role === "admin";
    const isClubAdmin = req.user.adminOfClubs?.some(id => id.toString() === event.club.toString());

    if (!isAdmin && !isClubAdmin) {
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }

    // Fetch participants with all fields
    const participants = await User.find({
      _id: { $in: event.registeredUsers }
    }).select("-password");

    // Fetch payment status for each participant
    const payments = await Payment.find({ event: eventId, status: "captured" });
    const paidUserIds = new Set(payments.map(p => p.user.toString()));

    const detailedParticipants = participants.map(user => ({
      ...user.toObject(),
      paymentStatus: paidUserIds.has(user._id.toString()) ? "Complete" : (event.registrationFee > 0 ? "Incomplete" : "Complete"),
    }));

    res.json({
      success: true,
      participants: detailedParticipants
    });
  } catch (error) {
    console.error("Error in getEventParticipants:", error);
    res.status(500).json({ message: "Error fetching event participants", error: error.message });
  }
};
