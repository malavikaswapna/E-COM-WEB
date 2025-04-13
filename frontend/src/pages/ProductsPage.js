// frontend/src/pages/ProductsPage.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './ProductsPage.css';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  
  // Filter states
  const [type, setType] = useState('');
  const [origin, setOrigin] = useState('');
  const [flavor, setFlavor] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  
  // Unique values for filters
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [uniqueOrigins, setUniqueOrigins] = useState([]);
  const [uniqueFlavors, setUniqueFlavors] = useState([]);
  
  useEffect(() => {
    console.log('Dispatching fetchProducts');
    // Fetch all products on initial load
    dispatch(fetchProducts());
  }, [dispatch]);
  
  useEffect(() => {
    if (products && products.length > 0) {
      // Extract unique values for filters
      setUniqueTypes([...new Set(products.map(p => p.type))]);
      setUniqueOrigins([...new Set(products.map(p => p.origin?.country).filter(Boolean))]);
      
      // Extract unique flavors from all products
      const allFlavors = products.flatMap(p => p.flavorProfile?.characteristics || []);
      setUniqueFlavors([...new Set(allFlavors)]);
    }
  }, [products]);
  
  const handleFilter = () => {
    const filters = {};
    
    if (type) filters.type = type;
    if (origin) filters.origin = origin;
    if (flavor) filters.flavor = flavor;
    if (priceRange.min) filters.minPrice = priceRange.min;
    if (priceRange.max) filters.maxPrice = priceRange.max;
    
    dispatch(fetchProducts(filters));
  };
  
  const clearFilters = () => {
    setType('');
    setOrigin('');
    setFlavor('');
    setPriceRange({ min: '', max: '' });
    dispatch(fetchProducts());
  };
  
  return (
    <div className="products-page-container">
      {/* Header Banner */}
      <div className="products-banner">
        <h1>Our Magical Collection ✨</h1>
        <p>Discover the finest teas, spices, and blends from around the world</p>
      </div>
      
      <div className="products-content">
        {/* Filters */}
        <div className="filters-container">
          <div className="filters-card">
            <h2>Enchant Your Search ✨</h2>
            
            <div className="filter-group">
              <label>Product Type</label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Origin</label>
              <select 
                value={origin} 
                onChange={(e) => setOrigin(e.target.value)}
              >
                <option value="">All Origins</option>
                {uniqueOrigins.map(origin => (
                  <option key={origin} value={origin}>{origin}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Flavor Profile</label>
              <select 
                value={flavor} 
                onChange={(e) => setFlavor(e.target.value)}
              >
                <option value="">All Flavors</option>
                {uniqueFlavors.map(flavor => (
                  <option key={flavor} value={flavor}>{flavor}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Price Range</label>
              <div className="price-inputs">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                />
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                />
              </div>
            </div>
            
            <div className="filter-buttons">
              <button 
                onClick={handleFilter}
                className="apply-button"
              >
                ✨ Apply Filters
              </button>
              <button 
                onClick={clearFilters}
                className="clear-button"
              >
                Clear
              </button>
            </div>
          </div>
          
          {/* Quick Categories */}
          <div className="quick-categories">
            <button className={type === 'tea' ? 'active' : ''} onClick={() => {setType('tea'); handleFilter();}}>
              🍵 Teas
            </button>
            <button className={type === 'spice' ? 'active' : ''} onClick={() => {setType('spice'); handleFilter();}}>
              🌶️ Spices
            </button>
            <button className={type === 'blend' ? 'active' : ''} onClick={() => {setType('blend'); handleFilter();}}>
              🧪 Blends
            </button>
            <button className={flavor === 'Sweet' ? 'active' : ''} onClick={() => {setFlavor('Sweet'); handleFilter();}}>
              🍯 Sweet
            </button>
            <button className={flavor === 'Spicy' ? 'active' : ''} onClick={() => {setFlavor('Spicy'); handleFilter();}}>
              🔥 Spicy
            </button>
          </div>
        </div>
        
        {/* Product Grid */}
        <div className="products-grid-container">
          {loading ? (
            <div className="loading-container">
              <LoadingSpinner size="large" color="purple" />
            </div>
          ) : error ? (
            <div className="error-container">
              <div className="error-message">
                <p>Oops! Something went wrong.</p>
                <p>{error}</p>
              </div>
              <button className="retry-button" onClick={() => dispatch(fetchProducts())}>
                Try Again
              </button>
            </div>
          ) : products && products.length > 0 ? (
            <div className="bento-products-grid">
              {products.map((product, index) => (
                <div key={product._id} className={`bento-product-item item-${index % 5 + 1}`}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="no-products">
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No Products Found</h3>
                <p>We couldn't find any products matching your criteria</p>
                <button onClick={clearFilters} className="reset-button">
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;