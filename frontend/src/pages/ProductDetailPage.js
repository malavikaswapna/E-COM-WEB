// frontend/src/pages/ProductDetailPage.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchProductById } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import OriginMap from '../components/products/EnhancedOriginMap';
import { toast } from 'react-toastify';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState('g');
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { product, loading, error } = useSelector((state) => state.products);
  
  useEffect(() => {
    dispatch(fetchProductById(id));
    setAddedToCart(false);
    window.scrollTo(0, 0);
  }, [dispatch, id]);
  
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product: id,
        name: product.name,
        image: product.images && product.images.length > 0 ? product.images[0] : null,
        price: product.price,
        unit: selectedUnit,
        stock: product.stock,
        qty: quantity,
      })
    );
    setAddedToCart(true);
    toast.success(`${product.name} added to cart!`);
  };

  const handleGoToCart = () => {
    navigate('/cart');
  };
  
  // Origin detail display formatting
  const getOriginDetails = () => {
    if (!product?.origin) return 'Information not available';
    
    const { country, region, farm } = product.origin;
    let details = country;
    
    if (region) details += `, ${region}`;
    if (farm) details += ` (${farm})`;
    
    return details;
  };
  
  // Format harvest date
  const formatHarvestDate = (dateString) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };
  
  // Render flavor profile stars
  const renderIntensityStars = (intensity) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <span 
            key={i} 
            className={`star ${i < intensity ? 'active' : ''}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading magical flavors...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="product-detail-container">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h2>Oh no! Something went wrong</h2>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/products')}
            className="back-button"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="product-detail-container">
        <div className="not-found-container">
          <div className="not-found-icon">🔍</div>
          <h2>Product Not Found</h2>
          <p>We couldn't find the magical flavor you're looking for.</p>
          <button 
            onClick={() => navigate('/products')}
            className="browse-button"
          >
            Browse Our Collection
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="product-detail-container">
      <div className="product-detail-header">
        <h1>{product.name} ✨</h1>
        <p>Origin: {getOriginDetails()}</p>
      </div>
      
      <div className="product-detail-content">
        <div className="product-detail-grid">
          {/* Product Image Card */}
          <div className="bento-card product-image-card">
            <div className="product-image-container">
              <img
                src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder-spice.jpg'}
                alt={product.name}
                className="product-main-image"
              />
              
              {/* Product type badge */}
              <div className="product-type-badge">
                {product.type}
              </div>
              
              {/* Stock badge */}
              {product.stock <= 0 ? (
                <div className="stock-badge out-of-stock">
                  Out of Stock
                </div>
              ) : product.stock < 10 ? (
                <div className="stock-badge low-stock">
                  Only {product.stock} left!
                </div>
              ) : (
                <div className="stock-badge in-stock">
                  In Stock
                </div>
              )}
            </div>
            
            {/* Thumbnail images would go here */}
            {product.images && product.images.length > 1 && (
              <div className="product-thumbnails">
                {product.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="thumbnail-container">
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="thumbnail-image"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info Card */}
          <div className="bento-card product-info-card">
            <div className="product-info-header">
              {/* Product Category Path */}
              <div className="product-category-path">
                <Link to="/products">All Products</Link>
                <span className="path-separator">›</span>
                <Link to={`/products?type=${product.type}`}>{product.type.charAt(0).toUpperCase() + product.type.slice(1)}s</Link>
              </div>
              
              {/* Price and Rating */}
              <div className="product-price-container">
                <div className="product-price">${product.price ? product.price.toFixed(2) : '0.00'}</div>
                <div className="product-unit">per {product.unit}</div>
              </div>
            </div>
            
            {/* Product Description */}
            <div className="product-description">
              <p>{product.description}</p>
            </div>
            
            {/* Add to Cart Section */}
            {product.stock > 0 && (
              <div className="add-to-cart-section">
                <div className="quantity-row">
                  {/* Quantity Selector */}
                  <div className="quantity-selector">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="quantity-button"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    
                    <span className="quantity-value">{quantity}</span>
                    
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="quantity-button"
                      aria-label="Increase quantity"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                  
                  {/* Unit Selector */}
                  <div className="unit-selector">
                    <select
                      value={selectedUnit}
                      onChange={(e) => setSelectedUnit(e.target.value)}
                      className="unit-select"
                    >
                      <option value="g">Grams (g)</option>
                      <option value="oz">Ounces (oz)</option>
                      {product.type === 'tea' && (
                        <option value="servings">Servings</option>
                      )}
                    </select>
                  </div>
                  
                  {/* Total Price */}
                  <div className="item-total">
                    Total: ${(product.price * quantity).toFixed(2)}
                  </div>
                </div>
                
                {/* Action Buttons */}
                {!addedToCart ? (
                  <button
                    onClick={handleAddToCart}
                    className="add-to-cart-button"
                  >
                    Add to Cart
                  </button>
                ) : (
                  <div className="cart-buttons">
                    <div className="added-to-cart-message">
                      ✓ Item added to cart!
                    </div>
                    <div className="cart-action-buttons">
                      <button
                        onClick={handleAddToCart}
                        className="add-again-button"
                      >
                        Add Again
                      </button>
                      <button
                        onClick={handleGoToCart}
                        className="go-to-cart-button"
                      >
                        View Cart
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Out of Stock Message */}
            {product.stock <= 0 && (
              <div className="out-of-stock-message">
                <p>This product is currently out of stock.</p>
                <button className="notify-button">
                  Notify Me When Available
                </button>
              </div>
            )}
            
            {/* Product Tags */}
            <div className="product-tags">
              {product.categories && product.categories.length > 0 && (
                <div className="tags-list">
                  {product.categories.map((category, index) => (
                    <Link 
                      to={`/products?category=${category}`} 
                      key={index}
                      className="tag-link"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Product Details Tab Card */}
          <div className="bento-card product-details-card">
            {/* Tabs Navigation */}
            <div className="tabs-navigation">
              <button
                className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                Product Details
              </button>
              <button
                className={`tab-button ${activeTab === 'flavor' ? 'active' : ''}`}
                onClick={() => setActiveTab('flavor')}
              >
                Flavor Profile
              </button>
              <button
                className={`tab-button ${activeTab === 'origin' ? 'active' : ''}`}
                onClick={() => setActiveTab('origin')}
              >
                Origin & Traceability
              </button>
              <button
                className={`tab-button ${activeTab === 'usage' ? 'active' : ''}`}
                onClick={() => setActiveTab('usage')}
              >
                Usage & Storage
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="tab-content">
              {/* Details Tab */}
              {activeTab === 'details' && (
                <div className="details-tab">
                  <h3>Product Information</h3>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Type:</span>
                      <span className="detail-value">{product.type.charAt(0).toUpperCase() + product.type.slice(1)}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Origin:</span>
                      <span className="detail-value">{getOriginDetails()}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Batch Number:</span>
                      <span className="detail-value">{product.batchInfo?.batchNumber || 'Not available'}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Best Before:</span>
                      <span className="detail-value">{formatHarvestDate(product.batchInfo?.bestBefore)}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Harvest Date:</span>
                      <span className="detail-value">{formatHarvestDate(product.origin?.harvestDate)}</span>
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Cultivation:</span>
                      <span className="detail-value">{product.origin?.cultivationMethod || 'Not specified'}</span>
                    </div>
                  </div>
                  
                  <div className="product-description-full">
                    <h3>Description</h3>
                    <p>{product.description}</p>
                  </div>
                </div>
              )}
              
              {/* Flavor Profile Tab */}
              {activeTab === 'flavor' && (
                <div className="flavor-tab">
                  <div className="flavor-profile-container">
                    <div className="flavor-section">
                      <h3>Primary Flavors</h3>
                      <div className="flavor-chips">
                        {product.flavorProfile?.primary?.map((flavor, index) => (
                          <div key={index} className="flavor-chip primary">
                            {flavor}
                          </div>
                        )) || <p>No primary flavors specified</p>}
                      </div>
                    </div>
                    
                    <div className="flavor-section">
                      <h3>Tasting Notes</h3>
                      <div className="flavor-chips">
                        {product.flavorProfile?.notes?.map((note, index) => (
                          <div key={index} className="flavor-chip note">
                            {note}
                          </div>
                        )) || <p>No tasting notes specified</p>}
                      </div>
                    </div>
                    
                    <div className="flavor-section">
                      <h3>Flavor Intensity</h3>
                      <div className="intensity-container">
                        <div className="intensity-label">Mild</div>
                        <div className="intensity-bar">
                          {renderIntensityStars(product.flavorProfile?.intensity || 0)}
                        </div>
                        <div className="intensity-label">Strong</div>
                      </div>
                    </div>
                    
                    <div className="flavor-section">
                      <h3>Characteristics</h3>
                      <div className="flavor-chips">
                        {product.flavorProfile?.characteristics?.map((char, index) => (
                          <div key={index} className="flavor-chip characteristic">
                            {char}
                          </div>
                        )) || <p>No characteristics specified</p>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flavor-wheel-container">
                    <h3>Flavor Wheel</h3>
                    <div className="flavor-wheel-placeholder">
                      {/* A visual flavor wheel would go here - placeholder for now */}
                      <div className="flavor-wheel-message">
                        Interactive flavor wheel coming soon!
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Origin Tab */}
              {activeTab === 'origin' && (
                <div className="origin-tab">
                  <OriginMap 
                    product={product} 
                    productName={product.name}
                    producerInfo={{
                      story: "Our partners at this farm have been growing premium spices for generations, using traditional organic methods that preserve the unique terroir of the region.",
                      images: [
                        "https://images.unsplash.com/photo-1558818061-c8e3ba22672a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1334&q=80",
                        "https://images.unsplash.com/photo-1589563413363-64114ef4acdf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1334&q=80"
                      ]
                    }}
                  />
                </div>
              )}
              
              {/* Usage & Storage Tab */}
              {activeTab === 'usage' && (
                <div className="usage-tab">
                  <div className="usage-section">
                    <h3>Recommended Uses</h3>
                    <div className="recommendations-container">
                      {product.usageRecommendations && product.usageRecommendations.length > 0 ? (
                        <ul className="usage-list">
                          {product.usageRecommendations.map((rec, index) => (
                            <li key={index} className="usage-item">
                              {rec}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>No specific usage recommendations available for this product.</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="storage-section">
                    <h3>Storage Instructions</h3>
                    <div className="storage-container">
                      <p className="storage-instructions">
                        {product.storageInstructions || 
                         `For maximum freshness, store in an airtight container away from direct sunlight, 
                          heat, and moisture. Keep in a cool, dry place.`}
                      </p>
                      
                      <div className="freshness-info">
                        <h4>Freshness Information</h4>
                        <div className="freshness-item">
                          <span className="freshness-label">Production Date:</span>
                          <span className="freshness-value">
                            {formatHarvestDate(product.batchInfo?.productionDate) || 'Not available'}
                          </span>
                        </div>
                        
                        <div className="freshness-item">
                          <span className="freshness-label">Best Before:</span>
                          <span className="freshness-value">
                            {formatHarvestDate(product.batchInfo?.bestBefore) || 'Not available'}
                          </span>
                        </div>
                        
                        <div className="freshness-item">
                          <span className="freshness-label">Shelf Life:</span>
                          <span className="freshness-value">
                            {product.batchInfo?.shelfLifeDays 
                              ? `${product.batchInfo.shelfLifeDays} days` 
                              : 'Not specified'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Related Products Card */}
          <div className="bento-card related-products-card">
            <div className="card-header">
              <h2>You Might Also Like ✨</h2>
            </div>
            <div className="related-products-content">
              <p className="related-products-message">
                Based on your browsing, these magical flavors might interest you:
              </p>
              
              <div className="related-products-placeholder">
                <div className="placeholder-message">
                  Related products will appear here
                </div>
              </div>
            </div>
          </div>
          
          {/* Recipes and Inspiration Card */}
          <div className="bento-card recipes-card">
            <div className="card-header">
              <h2>Recipes & Inspiration ✨</h2>
            </div>
            <div className="recipes-content">
              <p className="recipes-message">
                Discover magical ways to use {product.name} in your culinary adventures:
              </p>
              
              <div className="recipes-placeholder">
                <div className="placeholder-message">
                  Recipe suggestions coming soon!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;