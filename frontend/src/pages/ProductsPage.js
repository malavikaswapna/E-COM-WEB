// frontend/src/pages/ProductsPage.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/products/ProductCard';

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Our Products</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Product Type</label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Origin</label>
              <select 
                value={origin} 
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">All Origins</option>
                {uniqueOrigins.map(origin => (
                  <option key={origin} value={origin}>{origin}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Flavor Profile</label>
              <select 
                value={flavor} 
                onChange={(e) => setFlavor(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">All Flavors</option>
                {uniqueFlavors.map(flavor => (
                  <option key={flavor} value={flavor}>{flavor}</option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Price Range</label>
              <div className="flex space-x-2">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                  className="w-1/2 p-2 border rounded"
                />
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                  className="w-1/2 p-2 border rounded"
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={handleFilter}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex-1"
              >
                Apply Filters
              </button>
              <button 
                onClick={clearFilters}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
        
        {/* Product Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading products...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded">
              Error: {error}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-100 p-8 rounded text-center">
              <p className="text-gray-600">No products found matching your criteria</p>
              <button 
                onClick={clearFilters}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;