// src/pages/admin/ProductCreatePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './ProductCreatePage.css';

const ProductCreatePage = () => {
  const navigate = useNavigate();
  const { userToken } = useSelector((state) => state.auth);
  
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      
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
      
      const { data } = await axios.post('/api/products', dataToSubmit, config);
      
      setLoading(false);
      toast.success('Product created successfully');
      navigate('/admin/products');
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || 'Failed to create product');
    }
  };
  
  return (
    <div className="product-create-container">
      {/* Header Banner */}
      <div className="product-create-banner">
        <h1>Create Magical Product ✨</h1>
        <p>Add a new item to your enchanted collection</p>
      </div>
      
      <div className="product-create-content">
        <div className="action-header">
          <button
            onClick={() => navigate('/admin/products')}
            className="back-button"
          >
            &larr; Back to Products
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="create-form">
          {/* Basic Information */}
          <div className="form-section">
            <div className="section-header">
              <h2>Basic Information</h2>
              <p>Essential details about your product</p>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Product Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={productData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Product Type <span className="required">*</span></label>
                <select
                  name="type"
                  value={productData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="spice">Spice</option>
                  <option value="tea">Tea</option>
                  <option value="blend">Blend</option>
                </select>
              </div>
              
              <div className="form-group full-width">
                <label>Description <span className="required">*</span></label>
                <textarea
                  name="description"
                  value={productData.description}
                  onChange={handleChange}
                  rows="4"
                  required
                ></textarea>
              </div>
              
              <div className="form-group">
                <label>Price <span className="required">*</span></label>
                <input
                  type="number"
                  name="price"
                  value={productData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Unit <span className="required">*</span></label>
                <select
                  name="unit"
                  value={productData.unit}
                  onChange={handleChange}
                  required
                >
                  <option value="g">Grams (g)</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="oz">Ounces (oz)</option>
                  <option value="lb">Pounds (lb)</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Stock <span className="required">*</span></label>
                <input
                  type="number"
                  name="stock"
                  value={productData.stock}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Status</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={productData.isActive}
                      onChange={(e) => setProductData({...productData, isActive: e.target.checked})}
                    />
                    <span>Active</span>
                  </label>
                  
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={productData.featured}
                      onChange={(e) => setProductData({...productData, featured: e.target.checked})}
                    />
                    <span>Featured</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Images */}
          <div className="form-section">
            <div className="section-header">
              <h2>Product Images</h2>
              <p>Showcase your product with stunning imagery</p>
            </div>
            
            <div className="array-items">
              {productData.images.map((image, index) => (
                <div key={index} className="array-item">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => handleArrayChange(e, index, 'images')}
                    placeholder="Image URL"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'images')}
                    className="remove-button"
                    disabled={productData.images.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => addArrayItem('images')}
                className="add-button"
              >
                + Add Image URL
              </button>
            </div>
          </div>
          
          {/* Origin Information */}
          <div className="form-section">
            <div className="section-header">
              <h2>Origin Information</h2>
              <p>Tell the story of where your product comes from</p>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="origin.country"
                  value={productData.origin.country}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Region</label>
                <input
                  type="text"
                  name="origin.region"
                  value={productData.origin.region}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label>Cultivation Method</label>
                <select
                  name="origin.cultivationMethod"
                  value={productData.origin.cultivationMethod}
                  onChange={handleChange}
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
          <div className="form-section">
            <div className="section-header">
              <h2>Flavor Profile</h2>
              <p>Describe the unique taste experience</p>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Primary Flavors</label>
                <div className="array-items">
                  {productData.flavorProfile.primary.map((flavor, index) => (
                    <div key={index} className="array-item">
                      <input
                        type="text"
                        value={flavor}
                        onChange={(e) => handleArrayChange(e, index, 'flavorProfile.primary')}
                        placeholder="Primary flavor"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem(index, 'flavorProfile.primary')}
                        className="remove-button small"
                        disabled={productData.flavorProfile.primary.length <= 1}
                      >
                        -
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => addArrayItem('flavorProfile.primary')}
                    className="add-button"
                  >
                    + Add Primary Flavor
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label>Tasting Notes</label>
                <div className="array-items">
                  {productData.flavorProfile.notes.map((note, index) => (
                    <div key={index} className="array-item">
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => handleArrayChange(e, index, 'flavorProfile.notes')}
                        placeholder="Tasting note"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem(index, 'flavorProfile.notes')}
                        className="remove-button small"
                        disabled={productData.flavorProfile.notes.length <= 1}
                      >
                        -
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => addArrayItem('flavorProfile.notes')}
                    className="add-button"
                  >
                    + Add Tasting Note
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label>Intensity</label>
                <div className="intensity-slider">
                  <input
                    type="range"
                    name="flavorProfile.intensity"
                    min="1"
                    max="5"
                    value={productData.flavorProfile.intensity}
                    onChange={handleChange}
                  />
                  <span className="intensity-value">{productData.flavorProfile.intensity}</span>
                </div>
              </div>
              
              <div className="form-group full-width">
                <label>Flavor Characteristics</label>
                <div className="flavor-characteristics">
                  {flavorOptions.map(flavor => (
                    <label key={flavor} className="checkbox-label">
                      <input
                        type="checkbox"
                        value={flavor}
                        checked={productData.flavorProfile.characteristics.includes(flavor)}
                        onChange={handleCharacteristicsChange}
                      />
                      <span>{flavor}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Categories */}
          <div className="form-section">
            <div className="section-header">
              <h2>Categories</h2>
              <p>Help customers find your product</p>
            </div>
            
            <div className="array-items">
              {productData.categories.map((category, index) => (
                <div key={index} className="array-item">
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => handleArrayChange(e, index, 'categories')}
                    placeholder="Category"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'categories')}
                    className="remove-button"
                    disabled={productData.categories.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => addArrayItem('categories')}
                className="add-button"
              >
                + Add Category
              </button>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="cancel-button"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" color="white" />
                  <span>Creating...</span>
                </>
              ) : (
                'Create Magical Product ✨'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCreatePage;