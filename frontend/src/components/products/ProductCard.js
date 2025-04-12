// frontend/src/components/products/ProductCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import FlavorMatchBadge from './FlavorMatchBadge';

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
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="h-48 overflow-hidden">
        <img 
          src={productImage}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        
        <div className="flex items-center mt-2">
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
            {product.type}
          </span>
          {product.origin && product.origin.country && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full ml-2">
              {product.origin.country}
            </span>
          )}
        </div>
        
        <div className="mt-2">
          <div className="text-sm text-gray-600">
            Flavor Profile: {primaryFlavors}
          </div>
          
          <div className="flex items-center mt-1">
            <span className="text-sm text-gray-600 mr-1">Intensity: </span>
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i}
                className={`w-4 h-4 ${i < intensity ? 'text-yellow-500' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Display Flavor Match if available */}
        {product.matchScore !== undefined && (
          <div className="mt-2">
            <FlavorMatchBadge score={product.matchScore} />
          </div>
        )}
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-bold">${product.price ? product.price.toFixed(2) : '0.00'}</span>
          <Link 
            to={`/products/${product._id}`}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors duration-200"
          >
            View Details
          </Link>
        </div>
        
        {product.stock <= 0 && (
          <div className="mt-2 text-red-600 text-sm font-medium">
            Out of Stock
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;