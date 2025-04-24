// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');

router.use(authController.protect);

// Admin routes
router.get(
  '/',
  authController.restrictTo('admin'),
  orderController.getOrders
);

router.post('/', orderController.createOrder);
router.get('/myorders', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);

router.put(
  '/:id/deliver',
  authController.restrictTo('admin'),
  orderController.updateOrderToDelivered
);

module.exports = router;
