// src/pages/admin/ProductsListPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './ProductsListPage.css';

const ProductsListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [filter, setFilter] = useState('');
  const [filterType, setFilterType] = useState('');
  
  const { userInfo, userToken } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      };
      
      const { data } = await axios.get('/api/products', config);
      
      // Apply filters if any
      let filteredProducts = data.data;
      
      if (filterType) {
        filteredProducts = filteredProducts.filter(product => 
          product.type === filterType
        );
      }
      
      if (filter) {
        const searchRegex = new RegExp(filter, 'i');
        filteredProducts = filteredProducts.filter(product => 
          searchRegex.test(product.name) || 
          searchRegex.test(product.description)
        );
      }
      
      setProducts(filteredProducts);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Could not fetch products');
      setLoading(false);
      toast.error('Failed to load products');
    }
  };
  
  useEffect(() => {
    // Check if user is admin
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/login');
      toast.error('You do not have access to this page');
      return;
    }
    
    fetchProducts();
  }, [userInfo, navigate, userToken, filter, filterType]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const deleteProductHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        };
        
        await axios.delete(`/api/products/${id}`, config);
        
        // Update products list
        setProducts(products.filter(product => product._id !== id));
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete product');
      }
    }
  };
  
  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Get unique product types for filtering
  const productTypes = [...new Set(products.map(p => p.type))];

  // Format price
  const formatPrice = (price, unit) => {
    return price ? `$${price.toFixed(2)} / ${unit || 'unit'}` : 'N/A';
  };
  
  if (userInfo && userInfo.role !== 'admin') {
    return (
      <div className="admin-container">
        <div className="admin-header">
          <h1>Access Denied</h1>
          <p>You don't have permission to view this page</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="products-list-container">
      {/* Header Banner */}
      <div className="products-list-banner">
        <h1>Products Management ✨</h1>
        <p>Manage your magical collection of teas, spices, and blends</p>
      </div>
      
      <div className="products-list-content">
        <div className="bento-card">
          <div className="card-header">
            <h2>Products Inventory</h2>
            
            <Link
              to="/admin/products/create"
              className="add-product-button"
            >
              + Add New Product
            </Link>
          </div>
          
          {/* Filters */}
          <div className="filter-panel">
            <div className="filter-group">
              <label htmlFor="search">Search Products</label>
              <input
                type="text"
                id="search"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search by name or description..."
                className="filter-input"
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="filterType">Product Type</label>
              <select
                id="filterType"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select"
              >
                <option value="">All Types</option>
                {productTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => { setFilter(''); setFilterType(''); }}
              className="clear-filter-button"
            >
              Clear Filters
            </button>
          </div>
          
          <div className="card-content">
            {loading ? (
              <div className="loading-center">
                <LoadingSpinner size="large" color="purple" />
              </div>
            ) : error ? (
              <div className="error-container">
                <div className="error-icon">❌</div>
                <p className="error-message">{error}</p>
                <button 
                  onClick={() => fetchProducts()}
                  className="retry-button"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <div className="products-table-container">
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Type</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Origin</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentProducts.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="empty-message">No products found</td>
                        </tr>
                      ) : (
                        currentProducts.map((product) => (
                          <tr key={product._id}>
                            <td className="product-cell">
                              <div className="product-info">
                                <div className="product-image">
                                  <img 
                                    src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder-spice.jpg'} 
                                    alt={product.name} 
                                  />
                                </div>
                                <div className="product-details">
                                  <span className="product-name">{product.name}</span>
                                  <span className="product-description">
                                    {product.description?.substring(0, 50)}...
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="product-type-badge">
                                {product.type}
                              </span>
                            </td>
                            <td className="price-cell">
                              {formatPrice(product.price, product.unit)}
                            </td>
                            <td>
                              <div className={`stock-level ${product.stock < 10 ? 'low-stock' : ''}`}>
                                {product.stock} units
                                {product.stock < 10 && (
                                  <span className="low-stock-warning">Low stock!</span>
                                )}
                              </div>
                            </td>
                            <td>
                              {product.origin?.country || 'Not specified'}
                            </td>
                            <td>
                              <div className="action-buttons">
                                <Link
                                  to={`/admin/products/${product._id}/edit`}
                                  className="edit-button"
                                >
                                  Edit
                                </Link>
                                <button
                                  onClick={() => deleteProductHandler(product._id)}
                                  className="delete-button"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {products.length > productsPerPage && (
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className="pagination-button"
                      disabled={currentPage === 1}
                    >
                      &larr;
                    </button>
                    
                    {[...Array(Math.ceil(products.length / productsPerPage)).keys()].map(number => (
                      <button
                        key={number + 1}
                        onClick={() => paginate(number + 1)}
                        className={`pagination-button ${
                          currentPage === number + 1 ? 'active' : ''
                        }`}
                      >
                        {number + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(products.length / productsPerPage)))}
                      className="pagination-button"
                      disabled={currentPage === Math.ceil(products.length / productsPerPage)}
                    >
                      &rarr;
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsListPage;