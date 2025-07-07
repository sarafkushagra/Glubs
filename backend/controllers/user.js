const User = require('../schema/user');

module.exports.showLoginForm = (req, res) => {
    res.render('html/login.ejs');
};

module.exports.showAllUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users);
};

module.exports.showUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
};

module.exports.createUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json({
            message: 'User created successfully!',
            user: savedUser
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(400).json({
            message: "Error creating user",
            error: error.message
        });
    }
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

module.exports.searchByClub = async (req, res) => {
    try {
        const clubId = req.params.clubId;
        const users = await User.find({ clubs: clubId });

        if (users.length === 0) {
            return res.status(404).json({ message: "No users found for this club" });
        }

        res.json(users);
    } catch (error) {
        console.error('Error searching users by club:', error);
        res.status(500).json({ message: "Error searching users by club", error: error.message });
    }
};