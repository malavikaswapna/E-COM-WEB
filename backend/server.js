// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();


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