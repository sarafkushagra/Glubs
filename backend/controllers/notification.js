const Notification = require("../schema/notification")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")

module.exports.getNotifications = catchAsync(async (req, res, next) => {
    const notifications = await Notification.find({ recipient: req.user._id })
        .populate("sender", "username email")
        .populate("team", "name description leader")
        .populate("event", "title date")
        .sort({ createdAt: -1 })
        .limit(50)

    res.status(200).json({
        status: "success",
        data: { notifications },
    })
})

module.exports.markAsRead = catchAsync(async (req, res, next) => {
    const { notificationId } = req.params

    const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: req.user._id },
        { isRead: true },
        { new: true }
    )

    if (!notification) {
        return next(new AppError("Notification not found", 404))
    }

    res.status(200).json({
        status: "success",
        data: { notification },
    })
})

module.exports.markAllAsRead = catchAsync(async (req, res, next) => {
    await Notification.updateMany(
        { recipient: req.user._id, isRead: false },
        { isRead: true }
    )

    res.status(200).json({
        status: "success",
        message: "All notifications marked as read",
    })
})

module.exports.deleteNotification = catchAsync(async (req, res, next) => {
    const { notificationId } = req.params

    const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        recipient: req.user._id,
    })

    if (!notification) {
        return next(new AppError("Notification not found", 404))
    }

    res.status(204).json({
        status: "success",
        data: null,
    })
})
