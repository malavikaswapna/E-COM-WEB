// backend/routes/marketingRoutes.js
const express = require('express');
const router = express.Router();
const marketingController = require('../controllers/marketingController');

router.post('/subscribe', marketingController.subscribeToNewsletter);

module.exports = router;