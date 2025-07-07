
const ClubAdmin = require("../schema/clubadmin");

module.exports.showAllClubAdmins = async (req, res) => {
     const clubAdmins = await ClubAdmin.find();
  res.json(clubAdmins);
};

module.exports.showClubAdmin = async (req, res) => {
    const clubAdmin = await ClubAdmin.findById(req.params.id);
    if (!clubAdmin) {
        return res.status(404).json({ message: "Club Admin not found" });
    }
    res.json(clubAdmin);
};  

module.exports.createClubAdmin = async (req, res) => {
    try {
        const newClubAdmin = new ClubAdmin(req.body);
        const savedClubAdmin = await newClubAdmin.save();
        res.status(201).json({
            message: 'Club Admin created successfully!',
            clubAdmin: savedClubAdmin
        });
    } catch (error) {
        console.error('Error creating club admin:', error);
        res.status(400).json({
            message: "Error creating club admin",
            error: error.message
        });
    }
};

module.exports.updateClubAdmin = async (req, res) => {
    try {
        const updatedClubAdmin = await ClubAdmin.findByIdAndUpdate(
            req.params.id,
            req.body, // Ensure req.body contains the updated fields
            { new: true, runValidators: true }
        );

        if (!updatedClubAdmin) {
            return res.status(404).json({ message: "Club Admin not found" });
        }

        res.json({
            message: "Club Admin updated successfully!",
            clubAdmin: updatedClubAdmin
        });
    } catch (error) {
        console.error('Error updating club admin:', error);
        res.status(400).json({ message: "Error updating club admin", error: error.message });
    }
};

module.exports.deleteClubAdmin = async (req, res) => {
    try {
        const deletedClubAdmin = await ClubAdmin.findByIdAndDelete(req.params.id);

        if (!deletedClubAdmin) {
            return res.status(404).json({ message: "Club Admin not found" });
        }

        res.json({
            message: "Club Admin deleted successfully!",
            clubAdmin: deletedClubAdmin
        });
    } catch (error) {
        console.error('Error deleting club admin:', error);
        res.status(400).json({ message: "Error deleting club admin", error: error.message });
    }
};

module.exports.showCreateClubAdminForm = (req, res) => {
    res.render("html/clubAdmin.ejs");
};