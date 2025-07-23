const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { signup, verifyAccount, resentOTP, login, logout, forgetPassword, resetPassword } = require('../controllers/auth');
const { isAuthenticated, restrictTo } = require('../middlewares/auth');


router.get('/', userController.showAllUsers);
router.get('/details/:id', userController.showUser);
router.get('/me', isAuthenticated, userController.getMe); // ✅ fixed
router.put('/:id', isAuthenticated, userController.updateUser);
router.delete('/:id', isAuthenticated, userController.deleteUser);
router.post("/request-club-admin", userController.requestClubAdmin);
router.get("/available/:eventId", isAuthenticated, userController.getAvailableUsers)
router.get("/unregistered/:eventId", isAuthenticated, userController.getUnregisteredUsers)

// auths routes

router.post("/signup",signup);
router.post("/verify", isAuthenticated, verifyAccount);
router.post('/resend-otp', isAuthenticated, resentOTP);
router.post('/login',login);
router.post('/logout', logout);
router.post('/forget-password', forgetPassword);
router.post('/reset-password', resetPassword);

module.exports = router;

