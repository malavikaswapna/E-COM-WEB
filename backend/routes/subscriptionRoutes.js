// backend/routes/subscriptionRoutes.js
const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const authController = require('../controllers/authController');

// Protect all subscription routes
router.use(authController.protect);

router.get('/recommendations', subscriptionController.getRecommendedProducts);

// Admin routes
router.post(
  '/process',
  authController.restrictTo('admin'),
  subscriptionController.processSubscriptions
);

// User subscription routes
router.route('/')
  .get(subscriptionController.getUserSubscriptions)
  .post(subscriptionController.createSubscription);

router.route('/:id')
  .get(subscriptionController.getSubscriptionById)
  .put(subscriptionController.updateSubscription);

router.post('/:id/cancel', subscriptionController.cancelSubscription);

module.exports = router;
