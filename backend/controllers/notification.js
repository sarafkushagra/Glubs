const Notification = require('../schema/notification');

module.exports.showAllNotifications = async (req, res) => {
    const notifications = await Notification.find({ user: req.params.userId });
    res.json(notifications);
};

module.exports.createNotification = async (req, res) => {
    try {
        const notification = new Notification(req.body);
        await notification.save();
        res.status(201).json(notification);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports.updateNotification = async (req, res) => {
    const updated = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json(updated);
};

module.exports.deleteNotification = async (req, res) => {
    const deleted = await Notification.findByIdAndDelete(req.params.id);
    if (!deleted) {
        return res.status(404).json({ message: "Notification not found" });
    }
    res.json({
        message: "Notification deleted successfully!",
        notification: deleted
    });
};