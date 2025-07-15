const Announcement = require('../schema/announcement');


module.exports.showAllAnnouncements = async (req, res) => {
    const announcements = await Announcement.find();
    res.json(announcements);
};

module.exports.createAnnouncement = async (req, res) => {
    try {
        const announcement = new Announcement(req.body);
        await announcement.save();
        res.status(201).json(announcement);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports.deleteAnnouncement = async (req, res) => {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Announcement deleted' });
};
