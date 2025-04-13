// frontend/src/components/products/ProductCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import FlavorMatchBadge from './FlavorMatchBadge';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  // Default image if none provided
  const productImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://i.imgur.com/wvZgscv.jpeg';
  
  // Ensure primary flavors exist before trying to access them
  const primaryFlavors = product.flavorProfile && product.flavorProfile.primary 
    ? product.flavorProfile.primary.slice(0, 2).join(', ')
    : 'Not specified';
  
  // Ensure flavorProfile.intensity exists
  const intensity = product.flavorProfile ? product.flavorProfile.intensity || 0 : 0;
  
  return (
    <div className="bento-product-card">
      <div className="product-image-container">
        <img 
          src={productImage}
          alt={product.name}
          className="product-image"
        />
        
        <div className="product-type-badge">
          {product.type}
        </div>
        
        {product.stock <= 0 && (
          <div className="out-of-stock-badge">
            Out of Stock
          </div>
        )}
      </div>
      
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-origin">
          {product.origin && product.origin.country && (
            <span>From {product.origin.country}</span>
          )}
        </div>
        
        <div className="product-flavor">
          <span className="flavor-label">Flavor:</span> {primaryFlavors}
        </div>
        
        <div className="product-intensity">
          <span className="intensity-label">Intensity:</span>
          <div className="intensity-stars">
            {[...Array(5)].map((_, i) => (
              <span 
                key={i}
                className={`intensity-star ${i < intensity ? 'active' : ''}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        
        {/* Display Flavor Match if available */}
        {product.matchScore !== undefined && (
          <div className="flavor-match">
            <FlavorMatchBadge score={product.matchScore} />
          </div>
        )}
        
        <div className="product-footer">
          <div className="product-price">
            ${product.price ? product.price.toFixed(2) : '0.00'}
          </div>
          <Link 
            to={`/products/${product._id}`}
            className="view-button"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;