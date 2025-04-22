// backend/routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Add a test route to help debug
router.get('/test', (req, res) => {
    res.json({ message: 'Auth routes are working!' });
  });

router.post('/register', authController.register);
router.post('/login', authController.login);
// Google OAuth routes
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);

router.post('/refresh-token', authController.protect, authController.refreshToken);

module.exports = router;