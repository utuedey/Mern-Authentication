const express = require('express');
const { 
    Signup,
    Login,
    Logout,
    VerifyEmail,
    ForgetPassword,
    ResetPassword, checkAuth } = require('../controllers/authController');

const { verifyToken } = require('../middleware/verifyToken');
const router = express.Router();

// Verification token
router.get("/check-auth", verifyToken, checkAuth);

// Signup route
router.post('/signup', Signup);

// Login route
router.post('/login', Login);

// Logout route
router.post('/logout', Logout);

// Email verification Link
router.post('/verify-email', VerifyEmail);

// Forget Password route
router.post('/forget-password', ForgetPassword);

// Reset Password route
router.post('/reset-password/:token', ResetPassword);

module.exports = router;
