// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

// Admin routes for CRUD operations would go here
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Add protected routes for admin
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;