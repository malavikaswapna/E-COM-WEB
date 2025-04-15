// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const productController = require('./controllers/productController');

// Middleware
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

// Update the cors configuration
app.use(cors({
  origin: 'http://localhost:3001', // Your frontend URL
  credentials: true
}));

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.send('Spice & Tea Exchange API is running');
});

app.get('/api/recipes/search', async (req, res) => {
  try {
    const { ingredient } = req.query;
    if (!ingredient) {
      return res.status(400).json({ status: 'fail', message: 'Ingredient parameter is required' });
    }
    
    // Call Spoonacular API
    const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
      params: {
        apiKey: process.env.SPOONACULAR_API_KEY,
        query: ingredient,
        addRecipeInformation: true,
        number: 4
      }
    });
    
    res.json({
      status: 'success',
      data: response.data.results
    });
  } catch (error) {
    console.error('Recipe API error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch recipes'
    });
  }
});

// Define the related products route BEFORE any auth middleware or route mounting
app.get('/api/products/related/:id', productController.getRelatedProducts);

app.get('/api/product-suggestions/:id', async (req, res) => {
  try {
    console.log('Product suggestions route hit for ID:', req.params.id);
    
    const product = await mongoose.model('Product').findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found'
      });
    }
    
    // Find products of the same type, excluding the current product
    const relatedProducts = await mongoose.model('Product').find({
      _id: { $ne: product._id },
      $or: [
        { type: product.type },
        { 'flavorProfile.characteristics': { $in: product.flavorProfile?.characteristics || [] } },
        { 'origin.country': product.origin?.country }
      ]
    }).limit(4);
    
    res.json({
      status: 'success',
      results: relatedProducts.length,
      data: relatedProducts
    });
  } catch (error) {
    console.error('Error in product suggestions:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Import routes (we'll create these next)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: err.message
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));