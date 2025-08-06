const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { signup, verifyAccount, resentOTP, login, logout, forgetPassword, resetPassword } = require('../controllers/auth');
const { isAuthenticated, restrictTo } = require('../middlewares/auth');
const catchAsync = require('../utils/catchAsync');

router.get('/', userController.showAllUsers);
router.get('/details/:id', userController.showUser);
router.get('/me', isAuthenticated, catchAsync( userController.getMe)); 
router.put('/:id', isAuthenticated, userController.updateUser);
router.delete('/:id', isAuthenticated, userController.deleteUser);
router.post("/request-club-admin", isAuthenticated , restrictTo("student"),userController.requestClubAdmin);
router.get("/available/:eventId", isAuthenticated, userController.getAvailableUsers)
router.get("/unregistered/:eventId", isAuthenticated, userController.getUnregisteredUsers)
router.get('/admin-clubs', isAuthenticated, userController.getUserAdminClubs);

// auths routes

router.post("/signup",signup);
router.post("/verify", isAuthenticated, verifyAccount);
router.post('/resend-otp', isAuthenticated, resentOTP);
router.post('/login',login);
router.post('/logout', logout);
router.post('/forget-password', forgetPassword);
router.post('/reset-password', resetPassword);

// Get user profile with clubs
// router.get('/profile', isAuthenticated, userController.getUserProfile);
module.exports = router;

