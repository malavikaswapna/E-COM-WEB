// backend/models/subscriptionModel.js
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'cancelled'],
    default: 'active'
  },
  frequency: {
    type: String,
    enum: ['weekly', 'biweekly', 'monthly', 'quarterly'],
    default: 'monthly'
  },
  nextDeliveryDate: {
    type: Date,
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }],
  customizations: {
    preferences: {
      flavorTypes: [String],
      intensity: Number,
      surpriseElement: {
        type: Boolean,
        default: false
      }
    },
    exclusions: [String] // Flavors or specific products to exclude
  },
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentDetails: {
    method: {
      type: String,
      required: true
    },
    lastFour: String,
    stripeCustomerId: String,
    stripeSubscriptionId: String
  },
  price: {
    basePrice: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    },
    shipping: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  history: [{
    deliveryDate: Date,
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    status: String
  }]
}, {
  timestamps: true
});

// Index for faster queries
subscriptionSchema.index({ user: 1, status: 1 });
subscriptionSchema.index({ nextDeliveryDate: 1, status: 1 });

// Calculate next delivery date based on frequency
subscriptionSchema.methods.calculateNextDeliveryDate = function() {
  const currentDate = this.nextDeliveryDate || new Date();
  let nextDate = new Date(currentDate);
  
  switch(this.frequency) {
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'biweekly':
      nextDate.setDate(nextDate.getDate() + 14);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    default:
      nextDate.setMonth(nextDate.getMonth() + 1);
  }
  
  this.nextDeliveryDate = nextDate;
  return nextDate;
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;