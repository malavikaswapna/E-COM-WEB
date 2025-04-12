// backend/controllers/subscriptionController.js
const Subscription = require('../models/subscriptionModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const stripe = require('../config/stripe');
const { calculateFlavorMatch } = require('../utils/flavorMatching');

// Create new subscription
exports.createSubscription = async (req, res) => {
  try {
    const {
      name,
      frequency,
      products,
      customizations,
      shippingAddress,
      paymentMethod,
      nextDeliveryDate
    } = req.body;

    // Validate required fields
    if (!name || !frequency || !products || !shippingAddress || !paymentMethod) {
      return res.status(400).json({
        status: 'fail',
        message: 'Missing required fields'
      });
    }

    // Calculate price
    let basePrice = 0;
    const productDetails = [];

    for (const item of products) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          status: 'fail',
          message: `Product with ID ${item.product} not found`
        });
      }
      
      basePrice += product.price * item.quantity;
      
      productDetails.push({
        product: item.product,
        quantity: item.quantity
      });
    }

    // Apply subscription discount (10% off)
    const discount = basePrice * 0.1;
    
    // Calculate tax (15%)
    const tax = (basePrice - discount) * 0.15;
    
    // Determine shipping (free for subscriptions)
    const shipping = 0;
    
    // Calculate total
    const total = basePrice - discount + tax + shipping;

    // Create subscription
    const subscription = await Subscription.create({
      user: req.user._id,
      name,
      frequency,
      products: productDetails,
      customizations: customizations || {
        preferences: { flavorTypes: [], intensity: 3, surpriseElement: false },
        exclusions: []
      },
      shippingAddress,
      paymentDetails: {
        method: paymentMethod,
        // These would be populated when actually processing payment
        lastFour: '',
        stripeCustomerId: '',
        stripeSubscriptionId: ''
      },
      nextDeliveryDate: nextDeliveryDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 1 week
      price: {
        basePrice,
        discount,
        shipping,
        tax,
        total
      }
    });

    // Update user record
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { subscriptions: subscription._id } }
    );

    res.status(201).json({
      status: 'success',
      data: {
        subscription
      }
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Could not create subscription',
      error: error.message
    });
  }
};

// Get all user subscriptions
exports.getUserSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user._id })
      .populate({
        path: 'products.product',
        select: 'name price images type flavorProfile'
      });
    
    res.status(200).json({
      status: 'success',
      results: subscriptions.length,
      data: {
        subscriptions
      }
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Could not retrieve subscriptions'
    });
  }
};

// Get subscription by ID
exports.getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id)
      .populate({
        path: 'products.product',
        select: 'name price images type flavorProfile origin'
      })
      .populate({
        path: 'history.orderId',
        select: 'createdAt isPaid isDelivered totalPrice'
      });
    
    if (!subscription) {
      return res.status(404).json({
        status: 'fail',
        message: 'Subscription not found'
      });
    }
    
    // Check if subscription belongs to user or if user is admin
    if (subscription.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'Not authorized to access this subscription'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        subscription
      }
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Could not retrieve subscription'
    });
  }
};

// Update subscription
exports.updateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    
    if (!subscription) {
      return res.status(404).json({
        status: 'fail',
        message: 'Subscription not found'
      });
    }
    
    // Check if subscription belongs to user
    if (subscription.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'Not authorized to update this subscription'
      });
    }
    
    const {
      name,
      frequency,
      products,
      customizations,
      shippingAddress,
      status
    } = req.body;
    
    // Update fields if provided
    if (name) subscription.name = name;
    if (frequency) subscription.frequency = frequency;
    if (customizations) subscription.customizations = customizations;
    if (shippingAddress) subscription.shippingAddress = shippingAddress;
    if (status) subscription.status = status;
    
    // Update products and recalculate price if products array is provided
    if (products && products.length > 0) {
      let basePrice = 0;
      const productDetails = [];
      
      for (const item of products) {
        const product = await Product.findById(item.product);
        
        if (!product) {
          return res.status(404).json({
            status: 'fail',
            message: `Product with ID ${item.product} not found`
          });
        }
        
        basePrice += product.price * item.quantity;
        
        productDetails.push({
          product: item.product,
          quantity: item.quantity
        });
      }
      
      // Apply subscription discount (10% off)
      const discount = basePrice * 0.1;
      
      // Calculate tax (15%)
      const tax = (basePrice - discount) * 0.15;
      
      // Determine shipping (free for subscriptions)
      const shipping = 0;
      
      // Calculate total
      const total = basePrice - discount + tax + shipping;
      
      subscription.products = productDetails;
      subscription.price = {
        basePrice,
        discount,
        shipping,
        tax,
        total
      };
    }
    
    // Recalculate next delivery date if frequency changed
    if (frequency) {
      subscription.calculateNextDeliveryDate();
    }
    
    const updatedSubscription = await subscription.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        subscription: updatedSubscription
      }
    });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Could not update subscription'
    });
  }
};

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    
    if (!subscription) {
      return res.status(404).json({
        status: 'fail',
        message: 'Subscription not found'
      });
    }
    
    // Check if subscription belongs to user
    if (subscription.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'Not authorized to cancel this subscription'
      });
    }
    
    subscription.status = 'cancelled';
    await subscription.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Could not cancel subscription'
    });
  }
};

// Process subscriptions (admin or cron job)
exports.processSubscriptions = async (req, res) => {
  try {
    // Only admins can manually process subscriptions
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'Not authorized'
      });
    }
    
    // Find active subscriptions due for delivery
    const dueSubscriptions = await Subscription.find({
      status: 'active',
      nextDeliveryDate: { $lte: new Date() }
    }).populate('user').populate('products.product');
    
    console.log(`Processing ${dueSubscriptions.length} due subscriptions`);
    
    const results = {
      processed: 0,
      failed: 0,
      details: []
    };
    
    // Process each subscription
    for (const subscription of dueSubscriptions) {
      try {
        // Create order from subscription
        const orderItems = subscription.products.map(item => {
          const product = item.product;
          return {
            name: product.name,
            qty: item.quantity,
            image: product.images && product.images.length > 0 ? product.images[0] : '',
            price: product.price,
            unit: product.unit || 'g',
            product: product._id
          };
        });
        
        // Create the order
        const order = await Order.create({
          user: subscription.user._id,
          orderItems,
          shippingAddress: subscription.shippingAddress,
          paymentMethod: subscription.paymentDetails.method,
          itemsPrice: subscription.price.basePrice,
          taxPrice: subscription.price.tax,
          shippingPrice: subscription.price.shipping,
          totalPrice: subscription.price.total,
          isPaid: true, // Auto-paid for subscriptions
          paidAt: new Date(),
          isSubscription: true,
          subscriptionId: subscription._id
        });
        
        // Add to subscription history
        subscription.history.push({
          deliveryDate: new Date(),
          orderId: order._id,
          status: 'completed'
        });
        
        // Calculate next delivery date
        subscription.calculateNextDeliveryDate();
        await subscription.save();
        
        results.processed++;
        results.details.push({
          subscriptionId: subscription._id,
          orderId: order._id,
          status: 'success'
        });
      } catch (error) {
        console.error(`Error processing subscription ${subscription._id}:`, error);
        results.failed++;
        results.details.push({
          subscriptionId: subscription._id,
          status: 'failed',
          error: error.message
        });
      }
    }
    
    res.status(200).json({
      status: 'success',
      data: results
    });
  } catch (error) {
    console.error('Process subscriptions error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Could not process subscriptions'
    });
  }
};

// Get recommended products for subscription
exports.getRecommendedProducts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.flavorPreferences) {
      return res.status(200).json({
        status: 'success',
        data: {
          message: 'Please complete your flavor preferences to get recommendations',
          recommendations: []
        }
      });
    }
    
    // Get products
    const products = await Product.find({ isActive: true });
    
    // Calculate flavor match scores
    const productsWithScores = products.map(product => {
      const matchScore = calculateFlavorMatch(user.flavorPreferences, product.flavorProfile);
      return {
        ...product.toObject(),
        matchScore
      };
    });
    
    // Sort by match score
    const sortedProducts = productsWithScores.sort((a, b) => b.matchScore - a.matchScore);
    
    // Get top recommendations
    const recommendations = sortedProducts.slice(0, 5);
    
    res.status(200).json({
      status: 'success',
      data: {
        recommendations
      }
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Could not get recommendations'
    });
  }
};