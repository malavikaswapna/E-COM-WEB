// backend/controllers/marketingController.js
const User = require('../models/userModel');
const emailService = require('../utils/emailService');

// Add user to newsletter
exports.subscribeToNewsletter = async (req, res) => {
  try {
    const { email, name = '' } = req.body;
    
    // Validate email
    if (!email) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email is required'
      });
    }

    console.log(`Processing subscription for ${email}`);
    
    // Check if user already exists
    let user = await User.findOne({ email });
    let isNewSubscription = false;
    
    if (user) {
        console.log(`User ${email} already exists, updating subscription status`);
      // Update existing user to subscribe to newsletter
      if (!user.newsletterSubscribed) {
        isNewSubscription = true;
        user.newsletterSubscribed = true;
        await user.save();
        console.log(`User ${email} subscription updated`);
      } else {
        console.log(`User ${email} is already subscribed`);
      }
    } else {
        console.log(`Creating new user for ${email}`);
      // Create a newsletter subscriber
      isNewSubscription = true;
      user = await User.create({
        email,
        name: name || email.split('@')[0], // Use part of email as name
        password: Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12), // Random secure password
        newsletterSubscribed: true,
        role: 'subscriber' // You might want to add this role to your schema
      });
      console.log(`New subscriber created for ${email}`);
    }

    // Send confirmation email if this is a new subscription
    if (isNewSubscription) {
        await emailService.sendSubscriptionConfirmation(email, user.name);
      }
      
    res.status(200).json({
      status: 'success',
      message: 'Successfully subscribed to newsletter'
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to subscribe to newsletter'
    });
  }
};

// Add to marketingController.js
exports.unsubscribeFromNewsletter = async (req, res) => {
    try {
      const { email } = req.query;
      
      if (!email) {
        return res.status(400).json({
          status: 'fail',
          message: 'Email is required'
        });
      }
      
      const user = await User.findOne({ email });
      
      if (user) {
        user.newsletterSubscribed = false;
        await user.save();
      }
      
      res.status(200).json({
        status: 'success',
        message: 'Successfully unsubscribed from newsletter'
      });
    } catch (error) {
      console.error('Unsubscribe error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to unsubscribe from newsletter'
      });
    }
  };