// src/pages/admin/ProductEditPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userToken } = useSelector((state) => state.auth);
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [productData, setProductData] = useState({
    name: '',
    type: 'spice',
    description: '',
    price: '',
    unit: 'g',
    stock: '',
    images: [''],
    origin: {
      country: '',
      region: '',
      cultivationMethod: 'conventional'
    },
    flavorProfile: {
      primary: [''],
      notes: [''],
      intensity: 3,
      characteristics: []
    },
    categories: [''],
    isActive: true,
    featured: false
  });
  
  const flavorOptions = [
    'Sweet', 'Spicy', 'Bitter', 'Sour', 'Umami',
    'Floral', 'Earthy', 'Fruity', 'Smoky', 'Herbal',
    'Nutty', 'Pungent', 'Citrusy', 'Woody', 'Fresh'
  ];
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        const config = {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        };
        
        const { data } = await axios.get(`/api/products/${id}`, config);
        
        // Transform data to match form structure
        const product = data.data;
        
        setProductData({
          name: product.name || '',
          type: product.type || 'spice',
          description: product.description || '',
          price: product.price || '',
          unit: product.unit || 'g',
          stock: product.stock || '',
          images: product.images?.length ? product.images : [''],
          origin: {
            country: product.origin?.country || '',
            region: product.origin?.region || '',
            cultivationMethod: product.origin?.cultivationMethod || 'conventional'
          },
          flavorProfile: {
            primary: product.flavorProfile?.primary?.length ? product.flavorProfile.primary : [''],
            notes: product.flavorProfile?.notes?.length ? product.flavorProfile.notes : [''],
            intensity: product.flavorProfile?.intensity || 3,
            characteristics: product.flavorProfile?.characteristics || []
          },
          categories: product.categories?.length ? product.categories : [''],
          isActive: product.isActive !== undefined ? product.isActive : true,
          featured: product.featured || false
        });
        
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch product');
        setLoading(false);
        toast.error('Failed to load product details');
      }
    };
    
    fetchProduct();
  }, [id, userToken]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProductData({
        ...productData,
        [parent]: {
          ...productData[parent],
          [child]: value
        }
      });
    } else {
      setProductData({
        ...productData,
        [name]: value
      });
    }
  };
  
  const handleArrayChange = (e, index, field) => {
    const { value } = e.target;
    
    // Handle nested arrays
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const newArray = [...productData[parent][child]];
      newArray[index] = value;
      
      setProductData({
        ...productData,
        [parent]: {
          ...productData[parent],
          [child]: newArray
        }
      });
    } else {
      const newArray = [...productData[field]];
      newArray[index] = value;
      
      setProductData({
        ...productData,
        [field]: newArray
      });
    }
  };
  
  const addArrayItem = (field) => {
    // Handle nested arrays
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProductData({
        ...productData,
        [parent]: {
          ...productData[parent],
          [child]: [...productData[parent][child], '']
        }
      });
    } else {
      setProductData({
        ...productData,
        [field]: [...productData[field], '']
      });
    }
  };
  
  const removeArrayItem = (index, field) => {
    // Handle nested arrays
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const newArray = [...productData[parent][child]];
      newArray.splice(index, 1);
      
      setProductData({
        ...productData,
        [parent]: {
          ...productData[parent],
          [child]: newArray
        }
      });
    } else {
      const newArray = [...productData[field]];
      newArray.splice(index, 1);
      
      setProductData({
        ...productData,
        [field]: newArray
      });
    }
  };
  
  const handleCharacteristicsChange = (e) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setProductData({
        ...productData,
        flavorProfile: {
          ...productData.flavorProfile,
          characteristics: [...productData.flavorProfile.characteristics, value]
        }
      });
    } else {
      setProductData({
        ...productData,
        flavorProfile: {
          ...productData.flavorProfile,
          characteristics: productData.flavorProfile.characteristics.filter(item => item !== value)
        }
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!productData.name || !productData.description || !productData.price || !productData.stock) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setUpdating(true);
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        }
      };
      
      // Convert string values to numbers
      const dataToSubmit = {
        ...productData,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock),
        flavorProfile: {
          ...productData.flavorProfile,
          intensity: parseInt(productData.flavorProfile.intensity)
        }
      };
      
      // Remove empty values from arrays
      dataToSubmit.images = dataToSubmit.images.filter(img => img.trim() !== '');
      dataToSubmit.categories = dataToSubmit.categories.filter(cat => cat.trim() !== '');
      dataToSubmit.flavorProfile.primary = dataToSubmit.flavorProfile.primary.filter(p => p.trim() !== '');
      dataToSubmit.flavorProfile.notes = dataToSubmit.flavorProfile.notes.filter(n => n.trim() !== '');
      
      await axios.put(`/api/products/${id}`, dataToSubmit, config);
      
      setUpdating(false);
      toast.success('Product updated successfully');
      navigate('/admin/products');
    } catch (error) {
      setUpdating(false);
      toast.error(error.response?.data?.message || 'Failed to update product');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        <p className="ml-2">Loading product...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
        {error}
        <button
          onClick={() => navigate('/admin/products')}
          className="ml-4 bg-gray-200 text-gray-800 px-4 py-1 rounded hover:bg-gray-300"
        >
          Back to Products
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Product: {productData.name}</h1>
        
        <button
          onClick={() => navigate('/admin/products')}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          Back to Products
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {/* Basic Information */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Product Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="name"
                value={productData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Product Type <span className="text-red-500">*</span></label>
              <select
                name="type"
                value={productData.type}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              >
                <option value="spice">Spice</option>
                <option value="tea">Tea</option>
                <option value="blend">Blend</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
              <textarea
                name="description"
                value={productData.description}
                onChange={handleChange}
                rows="4"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              ></textarea>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Price <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="price"
                value={productData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Unit <span className="text-red-500">*</span></label>
              <select
                name="unit"
                value={productData.unit}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              >
                <option value="g">Grams (g)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="oz">Ounces (oz)</option>
                <option value="lb">Pounds (lb)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Stock <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="stock"
                value={productData.stock}
                onChange={handleChange}
                min="0"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Status</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={productData.isActive}
                    onChange={(e) => setProductData({...productData, isActive: e.target.checked})}
                    className="form-checkbox h-5 w-5 text-green-600"
                  />
                  <span className="ml-2">Active</span>
                </label>
                
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={productData.featured}
                    onChange={(e) => setProductData({...productData, featured: e.target.checked})}
                    className="form-checkbox h-5 w-5 text-green-600"
                  />
                  <span className="ml-2">Featured</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Images */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Product Images</h2>
          
          <div className="space-y-2">
            {productData.images.map((image, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => handleArrayChange(e, index, 'images')}
                  placeholder="Image URL"
                  className="flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, 'images')}
                  className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200"
                  disabled={productData.images.length <= 1}
                >
                  Remove
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => addArrayItem('images')}
              className="bg-blue-100 text-blue-600 px-4 py-2 rounded hover:bg-blue-200"
            >
              Add Image URL
            </button>
          </div>
        </div>
        
        {/* Origin Information */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Origin Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Country</label>
              <input
                type="text"
                name="origin.country"
                value={productData.origin.country}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Region</label>
              <input
                type="text"
                name="origin.region"
                value={productData.origin.region}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Cultivation Method</label>
              <select
                name="origin.cultivationMethod"
                value={productData.origin.cultivationMethod}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="organic">Organic</option>
                <option value="conventional">Conventional</option>
                <option value="wild-harvested">Wild Harvested</option>
                <option value="biodynamic">Biodynamic</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Flavor Profile */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Flavor Profile</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Primary Flavors</label>
              <div className="space-y-2">
                {productData.flavorProfile.primary.map((flavor, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={flavor}
                      onChange={(e) => handleArrayChange(e, index, 'flavorProfile.primary')}
                      placeholder="Primary flavor"
                      className="flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'flavorProfile.primary')}
                      className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200"
                      disabled={productData.flavorProfile.primary.length <= 1}
                    >
                      -
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => addArrayItem('flavorProfile.primary')}
                  className="bg-blue-100 text-blue-600 px-4 py-2 rounded hover:bg-blue-200"
                >
                  Add Primary Flavor
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Tasting Notes</label>
              <div className="space-y-2">
                {productData.flavorProfile.notes.map((note, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={note}
                      onChange={(e) => handleArrayChange(e, index, 'flavorProfile.notes')}
                      placeholder="Tasting note"
                      className="flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'flavorProfile.notes')}
                      className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200"
                      disabled={productData.flavorProfile.notes.length <= 1}
                    >
                      -
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => addArrayItem('flavorProfile.notes')}
                  className="bg-blue-100 text-blue-600 px-4 py-2 rounded hover:bg-blue-200"
                >
                  Add Tasting Note
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Intensity (1-5)</label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  name="flavorProfile.intensity"
                  min="1"
                  max="5"
                  value={productData.flavorProfile.intensity}
                  onChange={handleChange}
                  className="w-full"
                />
                <span className="text-lg font-semibold">{productData.flavorProfile.intensity}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Flavor Characteristics</label>
              <div className="grid grid-cols-3 gap-2">
                {flavorOptions.map(flavor => (
                  <label key={flavor} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={flavor}
                      checked={productData.flavorProfile.characteristics.includes(flavor)}
                      onChange={handleCharacteristicsChange}
                      className="form-checkbox h-4 w-4 text-green-600"
                    />
                    <span className="ml-2 text-sm">{flavor}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Categories */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Categories</h2>
          
          <div className="space-y-2">
            {productData.categories.map((category, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={category}
                  onChange={(e) => handleArrayChange(e, index, 'categories')}
                  placeholder="Category"
                  className="flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, 'categories')}
                  className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200"
                  disabled={productData.categories.length <= 1}
                >
                  Remove
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => addArrayItem('categories')}
              className="bg-blue-100 text-blue-600 px-4 py-2 rounded hover:bg-blue-200"
            >
              Add Category
            </button>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded mr-2 hover:bg-gray-400"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 flex items-center"
            disabled={updating}
          >
            {updating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              'Update Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEditPage;