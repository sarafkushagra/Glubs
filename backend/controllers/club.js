const club = require('../schema/club');

module.exports.showAllClubs = async (req, res) => {
    const clubs = await Club.find();
    res.json(clubs);
}

module.exports.createClub = async (req, res) => {
    try {
        const club = new Club(req.body);
        await club.save();
        res.status(201).json(club);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


module.exports.showClub = async (req, res) => {
    const club = await Club.findById(req.params.id);
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