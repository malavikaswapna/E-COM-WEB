// backend/controllers/productController.js
const Product = require('../models/productModel');
const { sortByFlavorMatch } = require('../utils/flavorMatching');

// Get all products with flavor matching for logged in users
exports.getProducts = async (req, res) => {
  try {
    const { type, origin, flavor, minPrice, maxPrice } = req.query;
    const filter = {};
    
    // Apply filters if provided
    if (type) filter.type = type;
    if (origin) filter['origin.country'] = origin;
    if (flavor) filter['flavorProfile.characteristics'] = flavor;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const products = await Product.find(filter);
    res.json({
      status: 'success',
      results: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
    
// Get single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found'
      });
    }
    res.json({
      status: 'success',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        product: newProduct
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found'
      });
    }
    
    res.json({
      status: 'success',
      data: {
        product
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found'
      });
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Search Bar
exports.searchProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword 
      ? { 
          $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } },
            { 'origin.country': { $regex: req.query.keyword, $options: 'i' } }
          ] 
        } 
      : {};
      
    const products = await Product.find({ ...keyword });
    
    res.json({
      status: 'success',
      results: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};