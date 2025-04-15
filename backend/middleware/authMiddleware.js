// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Helper function to check if route should bypass auth
const shouldBypassAuth = (req) => {
  // List of paths that should bypass authentication
  const publicPaths = [
    { method: 'GET', regex: /^\/api\/products\/related\/[^\/]+$/ }
  ];
  
  // Check if the current request matches any public path
  return publicPaths.some(path => {
    return req.method === path.method && path.regex.test(req.originalUrl);
  });
};


// Protect routes - verify token
exports.protect = async (req, res, next) => {
  if (shouldBypassAuth(req)) {
    return next();
  }

  try {
    let token;
    
    // Check if token exists in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in. Please log in to get access.'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.'
      });
    }
    
    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid token. Please log in again.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Your token has expired. Please log in again.'
      });
    }
    
    return res.status(401).json({
      status: 'fail',
      message: 'Authentication failed.'
    });
  }
};

// Restrict to certain roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {

    if (shouldBypassAuth(req)) {
      return next();
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};