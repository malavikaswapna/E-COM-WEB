// backend/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.post('/create-intent', paymentController.createIntent);
router.post('/create-payment-intent', paymentController.createPaymentIntent);
router.post('/update-payment-status', paymentController.updatePaymentStatus);

module.exports = router;