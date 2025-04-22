// backend/controllers/orderController.js
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;
    
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'No order items'
      });
    }

    // Set initial payment status
    let isPaid = false;
    let paidAt = null;
    let paymentResult = null;
    
    // If Stripe payment was already processed, mark as paid
    if (paymentMethod === 'Stripe' && paymentDetails && paymentDetails.id) {
      isPaid = true;
      paidAt = Date.now();
      paymentResult = {
        id: paymentDetails.id,
        status: 'succeeded',
        update_time: new Date().toISOString(),
        email_address: req.user.email
      };
    }
    
    // Create order
    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      paymentResult,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid,
      paidAt,
      isDelivered: false
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Could not create order'
    });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({
        status: 'fail',
        message: 'Order not found'
      });
    }
    
    // Check if order belongs to user or if user is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'Not authorized to access this order'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        order
      }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Could not retrieve order'
    });
  }
};

// Get logged in user orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    
    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: {
        orders
      }
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Could not retrieve orders'
    });
  }
};

// Update order to delivered - Admin only
exports.updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        status: 'fail',
        message: 'Order not found'
      });
    }
    
    // Update inventory if not already updated
    if (order.isPaid && !order.inventoryUpdated) {
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock -= item.qty;
          await product.save();
        }
      }
      
      order.inventoryUpdated = true;
    }
    
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    
    const updatedOrder = await order.save();
    
    res.status(200).json({
      status: 'success',
      data: {
        order: updatedOrder
      }
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Could not update order'
    });
  }
};

// Get all orders - Admin only
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    
    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: {
        orders
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Could not retrieve orders'
    });
  }
};