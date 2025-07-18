const User = require('../schema/user');

module.exports.showAllUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users);
};

module.exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password'); // never send password
        res.json({ user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
};

module.exports.showUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
};

module.exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body, // Ensure req.body contains the updated fields
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "User updated successfully!",
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(400).json({ message: "Error updating user", error: error.message });
    }
};

module.exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "User deleted successfully!",
            user: deletedUser
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(400).json({ message: "Error deleting user", error: error.message });
    }
};




