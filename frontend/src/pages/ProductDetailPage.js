// frontend/src/pages/ProductDetailPage.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import OriginMap from '../components/products/EnhancedOriginMap';
import { toast } from 'react-toastify';

const ProductDetailPage = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState('g');
  const [addedToCart, setAddedToCart] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { product, loading, error } = useSelector((state) => state.products);
  
  useEffect(() => {
    dispatch(fetchProductById(id));
    setAddedToCart(false);
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
          <svg
            key={i}
            className={`w-5 h-5 ${
              i < intensity ? 'text-yellow-500' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };
  
  if (loading) {
    return <div className="text-center py-10">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
      <p className="mt-2 text-gray-600">Loading product details...</p>
    </div>;
  }
  
  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        <p className="text-2xl mb-2">Error</p>
        <p>{error}</p>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="text-center py-10">
        <p className="text-2xl mb-2">Product Not Found</p>
        <p className="text-gray-600">The product you're looking for may have been removed or doesn't exist.</p>
        <button 
          onClick={() => navigate('/products')}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Browse Products
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <img
            src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder-spice.jpg'}
            alt={product.name}
            className="w-full h-auto rounded-lg"
          />
          
          {/* Additional images would go here */}
        </div>
        
        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full uppercase">
              {product.type}
            </span>
            <span className="ml-2 text-gray-600">
              Origin: {getOriginDetails()}
            </span>
          </div>
          
          <p className="text-gray-700 mb-6">
            {product.description}
          </p>

          {/* Price and Cart */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold">
                ${product.price ? product.price.toFixed(2) : '0.00'} / {product.unit || 'unit'}
              </span>
              <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stock > 0 ? `${product.stock} in Stock` : 'Out of Stock'}
              </span>
            </div>
            
            {product.stock > 0 && (
              <>
                <div className="flex items-center mb-4">
                  <label htmlFor="quantity" className="mr-2">
                    Quantity:
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border rounded p-2"
                  >
                    {[...Array(Math.min(10, product.stock)).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                  
                  <select
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.target.value)}
                    className="border rounded p-2 ml-2"
                  >
                    <option value="g">Grams</option>
                    <option value="oz">Ounces</option>
                    {product.type === 'tea' && (
                      <option value="servings">Servings</option>
                    )}
                  </select>
                </div>
                
                {!addedToCart ? (
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
                  >
                    Add to Cart
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="bg-green-100 text-green-800 p-2 rounded text-center">
                      Item added to cart!
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleAddToCart}
                        className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
                      >
                        Add Again
                      </button>
                      <button
                        onClick={handleGoToCart}
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                      >
                        View Cart
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Flavor Profile */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Flavor Profile</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-gray-600 mb-1">Primary Flavors</h3>
                <p>{product.flavorProfile?.primary?.join(', ') || 'Not specified'}</p>
              </div>
              
              <div>
                <h3 className="text-gray-600 mb-1">Tasting Notes</h3>
                <p>{product.flavorProfile?.notes?.join(', ') || 'Not specified'}</p>
              </div>
              
              <div>
                <h3 className="text-gray-600 mb-1">Intensity</h3>
                {renderIntensityStars(product.flavorProfile?.intensity || 0)}
              </div>
              
              <div>
                <h3 className="text-gray-600 mb-1">Characteristics</h3>
                <div className="flex flex-wrap gap-1">
                  {product.flavorProfile?.characteristics?.map((char) => (
                    <span
                      key={char}
                      className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Harvest Info */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Cultivation Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-gray-600 text-sm">Method</h3>
                <p>{product.origin?.cultivationMethod || 'Not specified'}</p>
              </div>
              <div>
                <h3 className="text-gray-600 text-sm">Harvest Date</h3>
                <p>{formatHarvestDate(product.origin?.harvestDate)}</p>
              </div>
              <div>
                <h3 className="text-gray-600 text-sm">Best Before</h3>
                <p>{formatHarvestDate(product.batchInfo?.bestBefore)}</p>
              </div>
              <div>
                <h3 className="text-gray-600 text-sm">Batch Number</h3>
                <p>{product.batchInfo?.batchNumber || 'Not available'}</p>
              </div>
            </div>
          </div>
          
          {/* Origin Map & Details */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Origin Traceability</h2>
            <OriginMap origin={product.origin} productName={product.name} />
          </div>
        </div>
      </div>
      
      {/* Recommended Products section would go here */}
      
      {/* Reviews section would go here */}
    </div>
  );
};

export default ProductDetailPage;