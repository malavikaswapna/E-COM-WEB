
// backend/routes/subscriptionRoutes.js
const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const authController = require('../controllers/authController');

// Protect all subscription routes
router.use(authController.protect);

// User subscription routes
router.route('/')
  .get(subscriptionController.getUserSubscriptions)
  .post(subscriptionController.createSubscription);

router.get('/recommendations', subscriptionController.getRecommendedProducts);

router.route('/:id')
  .get(subscriptionController.getSubscriptionById)
  .put(subscriptionController.updateSubscription);

router.post('/:id/cancel', subscriptionController.cancelSubscription);

// Admin routes
router.post(
  '/process',
  authController.restrictTo('admin'),
  subscriptionController.processSubscriptions
);

module.exports = router;