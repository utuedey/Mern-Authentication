const express = require('express');
const { 
    Signup,
    Login,
    Logout,
    VerifyEmail,
    ForgetPassword,
    ResetPassword } = require('../controllers/authController');

const router = express.Router();

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
