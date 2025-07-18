const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { signup, verifyAccount, resentOTP, login, logout, forgetPassword, resetPassword } = require('../controllers/auth');
const { isAuthenticated } = require('../middlewares/auth');
const { getMe } = require('../controllers/user');

router.get('/', userController.showAllUsers);
router.get('/details/:id', userController.showUser);
router.get('/me', isAuthenticated, getMe);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// auths routes

router.post("/signup",signup);
router.post("/verify", isAuthenticated, verifyAccount);
router.post('/resend-otp', isAuthenticated, resentOTP);
router.post('/login',login);
router.post('/logout', logout);
router.post('/forget-password', forgetPassword);
router.post('/reset-password', resetPassword)

module.exports = router;

