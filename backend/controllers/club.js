const Club = require('../schema/club');
const Event = require('../schema/event'); // Assuming you have an Event schema defined
const mongoose = require('mongoose');

module.exports.showAllClubs = async (req, res) => {
    const clubs = await Club.find();
    res.json(clubs);
}
module.exports.createClub = async (req, res) => {
  try {
    const userId = req.user;

    if (!userId) {
      return res.status(400).json({ error: 'User not authenticated.' });
    }

    const club = new Club({
      ...req.body,
      createdBy: userId,
      members: [userId], // userId must be ObjectId (string is okay if valid)
    });

    await club.save();
    res.status(201).json(club);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports.showClub = async (req, res) => {
    const club = await Club.findById(req.params.id).populate('createdBy', 'username');
    res.json(club);
};

module.exports.updateClub = async (req, res) => {
    const updatedClub = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedClub);
};

module.exports.deleteClub = async (req, res) => {
    const deletedClub = await Club.findByIdAndDelete(req.params.id);
    res.json({
        message: "Club deleted successfully!",
        club: deletedClub
    });

};

module.exports.showClubMembers = async (req, res) => {
    const club = await Club.findById(req.params.id).populate('members');
    if (!club) {
        return res.status(404).json({ error: 'Club not found' });
    }
    res.json(club.members);
}

module.exports.showClubEvents = async (req, res) => {
    try {
        const { clubId } = req.params;
        const events = await Event.find({ club: clubId }).populate('createdBy');
        res.json(events);
    } catch (error) {
        console.error("Error in getClubEvents:", error);
        res.status(500).json({ message: "Server error fetching club events", error: error.message });
    }
};