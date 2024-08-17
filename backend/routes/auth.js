const express = require('express');
const { Signup, Login, Logout } = require('../controllers/authController');

const router = express.Router();

// Signup route
router.post('/signup', Signup);

// Login route
router.post('/login', Login);

// Logout route
router.post('/logout', Logout);

module.exports = router;
