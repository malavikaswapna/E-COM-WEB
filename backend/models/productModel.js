// backend/models/productModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['spice', 'tea', 'blend']
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: 0
  },
  images: [String],
  
  // Origin traceability
  origin: {
    country: {
      type: String,
      required: true
    },
    region: String,
    farm: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    altitude: String,
    cultivationMethod: {
      type: String,
      enum: ['organic', 'conventional', 'wild-harvested', 'biodynamic']
    },
    harvestDate: Date
  },
  
  // Flavor profile
  flavorProfile: {
    primary: [String],
    notes: [String],
    intensity: {
      type: Number,
      min: 1,
      max: 5
    },
    characteristics: [String] // e.g., 'earthy', 'floral', 'spicy', 'sweet'
  },
  
  // Freshness tracking
  batchInfo: {
    batchNumber: String,
    productionDate: Date,
    bestBefore: Date,
    shelfLifeDays: Number
  },
  
  // Inventory
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['g', 'kg', 'oz', 'lb']
  },
  
  // Additional product info
  categories: [String],
  usageRecommendations: [String],
  storageInstructions: String,
  
  // SEO and Shop
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for search functionality
productSchema.index({ name: 'text', description: 'text', 'origin.country': 'text' });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;