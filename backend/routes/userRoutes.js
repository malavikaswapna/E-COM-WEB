// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const authController = require('../controllers/authController');

// Get user profile
router.get('/profile', authController.protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Update user profile
router.patch('/profile', authController.protect, async (req, res) => {
  try {
    const allowedFields = ['name', 'flavorPreferences', 'shippingAddresses'];
    
    // Filter out unwanted fields
    const filteredBody = Object.keys(req.body)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Add shipping address
router.post('/addresses', authController.protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Add new address
    user.shippingAddresses.push(req.body);
    
    // If it's the first address or set as default
    if (user.shippingAddresses.length === 1 || req.body.isDefault) {
      // Set all addresses to non-default
      user.shippingAddresses = user.shippingAddresses.map(address => {
        address.isDefault = false;
        return address;
      });
      
      // Set the new address as default
      user.shippingAddresses[user.shippingAddresses.length - 1].isDefault = true;
    }
    
    await user.save();
    
    res.status(201).json({
      status: 'success',
      data: {
        addresses: user.shippingAddresses
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;