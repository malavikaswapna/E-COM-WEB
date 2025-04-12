// backend/controllers/paymentController.js
const stripe = require('../config/stripe');
const Order = require('../models/orderModel');

exports.createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    // Get order details
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        status: 'fail',
        message: 'Order not found'
      });
    }
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Stripe requires amount in cents
      currency: 'usd',
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString()
      }
    });
    
    res.status(200).json({
      status: 'success',
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Could not create payment intent'
    });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { orderId, paymentId, paymentStatus } = req.body;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        status: 'fail',
        message: 'Order not found'
      });
    }
    
    // Update order with payment information
    order.paymentResult = {
      id: paymentId,
      status: paymentStatus,
      update_time: Date.now(),
      email_address: req.user.email
    };
    
    order.isPaid = true;
    order.paidAt = Date.now();
    
    const updatedOrder = await order.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        order: updatedOrder
      }
    });
  } catch (error) {
    console.error('Payment update error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Could not update payment status'
    });
  }
};