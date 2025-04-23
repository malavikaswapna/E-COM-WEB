// src/pages/admin/ProductEditPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './ProductEditPage.css';

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo, userToken } = useSelector((state) => state.auth);
  
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
      farm: '',
      coordinates: {
        latitude: '',
        longitude: ''
    },
    altitude: '',
    cultivationMethod: 'conventional'
    },
    producerInfo: {
      story: '',
      images: [''],
      sustainablePractices: []
    },
    flavorProfile: {
      primary: [''],
      notes: [''],
      intensity: 3,
      characteristics: []
    },
    batchInfo: {
      batchNumber: '',
      productionDate: '',
      bestBefore: '',
      shelfLifeDays: 365
    },
    usageRecommendations: [''],
    storageInstructions: '',
    categories: [''],
    isActive: true,
    featured: false
  });
  
  const flavorOptions = [
    'Sweet', 'Spicy', 'Bitter', 'Sour', 'Umami',
    'Floral', 'Earthy', 'Fruity', 'Smoky', 'Herbal',
    'Nutty', 'Pungent', 'Citrusy', 'Woody', 'Fresh',
    'Warm', 'Aromatic', 'Cool', 'Refreshing'
  ];

  const sustainablePracticeOptions = [
    'Organic', 'Fair Trade', 'Rainforest Alliance', 'Shade-Grown', 
    'Bird Friendly', 'Direct Trade', 'Small Batch', 'Recyclable Packaging', 
    'Carbon Neutral', 'Sustainable Farming'
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
            farm: product.origin?.farm || '',
            coordinates: {
              latitude: product.origin?.coordinates?.latitude || '',
              longitude: product.origin?.coordinates?.longitude || ''
            },
            altitude: product.origin?.altitude || '',
            cultivationMethod: product.origin?.cultivationMethod || 'conventional'
          },
          producerInfo: {
            story: product.producerInfo?.story || '',
            images: product.producerInfo?.images?.length ? product.producerInfo.images : [''],
            sustainablePractices: product.producerInfo?.sustainablePractices?.length ? product.producerInfo.sustainablePractices : ['']
          },
          flavorProfile: {
            primary: product.flavorProfile?.primary?.length ? product.flavorProfile.primary : [''],
            notes: product.flavorProfile?.notes?.length ? product.flavorProfile.notes : [''],
            intensity: product.flavorProfile?.intensity || 3,
            characteristics: product.flavorProfile?.characteristics || []
          },
          batchInfo: {
            batchNumber: product.batchInfo?.batchNumber || '',
            productionDate: product.batchInfo?.productionDate ? new Date(product.batchInfo.productionDate).toISOString().split('T')[0] : '',
            bestBefore: product.batchInfo?.bestBefore ? new Date(product.batchInfo.bestBefore).toISOString().split('T')[0] : '',
            shelfLifeDays: product.batchInfo?.shelfLifeDays || 365
          },
          usageRecommendations: product.usageRecommendations?.length ? product.usageRecommendations : [''],
          storageInstructions: product.storageInstructions || '',
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
    
    // Handle deeply nested properties
    if (name.includes('.')) {
      const parts = name.split('.');
      
      if (parts.length === 2) {
        // Handle single-level nesting (e.g., 'origin.country')
        const [parent, child] = parts;
        setProductData({
          ...productData,
          [parent]: {
            ...productData[parent],
            [child]: value
          }
        });
      } else if (parts.length === 3) {
        // Handle two-level nesting (e.g., 'origin.coordinates.latitude')
        const [grandparent, parent, child] = parts;
        setProductData({
          ...productData,
          [grandparent]: {
            ...productData[grandparent],
            [parent]: {
              ...productData[grandparent][parent],
              [child]: value
            }
          }
        });
      }
    } else {
      // Handle top-level properties
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
  
  const handleCheckboxArrayChange = (e, field) => {
    const { value, checked } = e.target;
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      
      if (checked) {
        setProductData({
          ...productData,
          [parent]: {
            ...productData[parent],
            [child]: [...productData[parent][child], value]
          }
        });
      } else {
        setProductData({
          ...productData,
          [parent]: {
            ...productData[parent],
            [child]: productData[parent][child].filter(item => item !== value)
          }
        });
      }
    } else {
      if (checked) {
        setProductData({
          ...productData,
          [field]: [...productData[field], value]
        });
      } else {
        setProductData({
          ...productData,
          [field]: productData[field].filter(item => item !== value)
        });
      }
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
      
      // Convert string values to numbers and format data
      const dataToSubmit = {
        ...productData,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock),
        origin: {
          ...productData.origin,
          coordinates: {
            latitude: parseFloat(productData.origin.coordinates.latitude) || 0,
            longitude: parseFloat(productData.origin.coordinates.longitude) || 0
          }
        },
        flavorProfile: {
          ...productData.flavorProfile,
          intensity: parseInt(productData.flavorProfile.intensity)
        },
        batchInfo: {
          ...productData.batchInfo,
          shelfLifeDays: parseInt(productData.batchInfo.shelfLifeDays) || 365,
          // Convert string dates to Date objects if they exist
          productionDate: productData.batchInfo.productionDate ? new Date(productData.batchInfo.productionDate) : null,
          bestBefore: productData.batchInfo.bestBefore ? new Date(productData.batchInfo.bestBefore) : null
        }
      };
      
      // Remove empty values from arrays
      dataToSubmit.images = dataToSubmit.images.filter(img => img.trim() !== '');
      dataToSubmit.categories = dataToSubmit.categories.filter(cat => cat.trim() !== '');
      dataToSubmit.flavorProfile.primary = dataToSubmit.flavorProfile.primary.filter(p => p.trim() !== '');
      dataToSubmit.flavorProfile.notes = dataToSubmit.flavorProfile.notes.filter(n => n.trim() !== '');
      dataToSubmit.usageRecommendations = dataToSubmit.usageRecommendations.filter(r => r.trim() !== '');
      dataToSubmit.producerInfo.images = dataToSubmit.producerInfo.images.filter(img => img.trim() !== '');
      dataToSubmit.producerInfo.sustainablePractices = dataToSubmit.producerInfo.sustainablePractices.filter(p => p.trim() !== '');
      
      await axios.put(`/api/products/${id}`, dataToSubmit, config);
      
      setUpdating(false);
      toast.success('Product updated successfully');
      navigate('/admin/products');
    } catch (error) {
      setUpdating(false);
      toast.error(error.response?.data?.message || 'Failed to update product');
    }
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
    <div className="product-edit-container">
      {/* Header Banner */}
      <div className="product-edit-banner">
        <h1>Edit Magical Product ✨</h1>
        <p>Refine your enchanted creation</p>
      </div>
      
      <div className="product-edit-content">
        {loading ? (
          <div className="loading-container">
            <LoadingSpinner size="large" color="purple" />
            <p>Loading product details...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">❌</div>
            <p className="error-message">{error}</p>
            <button
              onClick={() => navigate('/admin/products')}
              className="back-button"
            >
              Back to Products
            </button>
          </div>
        ) : (
          <>
            <div className="action-header">
              <h2>Editing: {productData.name}</h2>
              <button
                onClick={() => navigate('/admin/products')}
                className="back-button"
              >
                &larr; Back to Products
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="edit-form">
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
                    <label>Farm Name</label>
                    <input
                      type="text"
                      name="origin.farm"
                      value={productData.origin.farm}
                      onChange={handleChange}
                      placeholder="Name of the farm or estate"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Altitude</label>
                    <input
                      type="text"
                      name="origin.altitude"
                      value={productData.origin.altitude}
                      onChange={handleChange}
                      placeholder="e.g., 1,200-1,500m"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Latitude</label>
                    <input
                      type="number"
                      name="origin.coordinates.latitude"
                      value={productData.origin.coordinates.latitude}
                      onChange={handleChange}
                      step="0.00001"
                      placeholder="e.g., 9.76145"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Longitude</label>
                    <input
                      type="number"
                      name="origin.coordinates.longitude"
                      value={productData.origin.coordinates.longitude}
                      onChange={handleChange}
                      step="0.00001"
                      placeholder="e.g., 77.13805"
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
              
              {/* Producer Information */}
              <div className="form-section">
                <div className="section-header">
                  <h2>Producer Information</h2>
                  <p>Tell the story behind the product</p>
                </div>
                
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Producer Story</label>
                    <textarea
                      name="producerInfo.story"
                      value={productData.producerInfo.story}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Share the story of the producers and their traditions"
                    ></textarea>
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Producer Images</label>
                    <div className="array-items">
                      {productData.producerInfo.images.map((image, index) => (
                        <div key={index} className="array-item">
                          <input
                            type="text"
                            value={image}
                            onChange={(e) => handleArrayChange(e, index, 'producerInfo.images')}
                            placeholder="Producer image URL"
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayItem(index, 'producerInfo.images')}
                            className="remove-button"
                            disabled={productData.producerInfo.images.length <= 1}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={() => addArrayItem('producerInfo.images')}
                        className="add-button"
                      >
                        + Add Producer Image
                      </button>
                    </div>
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Sustainable Practices</label>
                    <div className="flavor-characteristics">
                      {sustainablePracticeOptions.map(practice => (
                        <label key={practice} className="checkbox-label">
                          <input
                            type="checkbox"
                            value={practice}
                            checked={productData.producerInfo.sustainablePractices.includes(practice)}
                            onChange={(e) => handleCheckboxArrayChange(e, 'producerInfo.sustainablePractices')}
                          />
                          <span>{practice}</span>
                        </label>
                      ))}
                    </div>
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
              
              {/* Batch Information */}
              <div className="form-section">
                <div className="section-header">
                  <h2>Batch Information</h2>
                  <p>Details about this specific product batch</p>
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>Batch Number</label>
                    <input
                      type="text"
                      name="batchInfo.batchNumber"
                      value={productData.batchInfo.batchNumber}
                      onChange={handleChange}
                      placeholder="e.g., CIN-2023-001"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Shelf Life (Days)</label>
                    <input
                      type="number"
                      name="batchInfo.shelfLifeDays"
                      value={productData.batchInfo.shelfLifeDays}
                      onChange={handleChange}
                      min="1"
                      placeholder="e.g., 365"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Production Date</label>
                    <input
                      type="date"
                      name="batchInfo.productionDate"
                      value={productData.batchInfo.productionDate}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Best Before Date</label>
                    <input
                      type="date"
                      name="batchInfo.bestBefore"
                      value={productData.batchInfo.bestBefore}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              
              {/* Usage & Storage */}
              <div className="form-section">
                <div className="section-header">
                  <h2>Usage & Storage</h2>
                  <p>Help customers get the most from your product</p>
                </div>
                
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Usage Recommendations</label>
                    <div className="array-items">
                      {productData.usageRecommendations.map((recommendation, index) => (
                        <div key={index} className="array-item">
                          <input
                            type="text"
                            value={recommendation}
                            onChange={(e) => handleArrayChange(e, index, 'usageRecommendations')}
                            placeholder="How to use this product"
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayItem(index, 'usageRecommendations')}
                            className="remove-button small"
                            disabled={productData.usageRecommendations.length <= 1}
                          >
                            -
                          </button>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={() => addArrayItem('usageRecommendations')}
                        className="add-button"
                      >
                        + Add Recommendation
                      </button>
                    </div>
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Storage Instructions</label>
                    <textarea
                      name="storageInstructions"
                      value={productData.storageInstructions}
                      onChange={handleChange}
                      rows="2"
                      placeholder="How to store this product for maximum freshness"
                    ></textarea>
                  </div>
                </div>
              </div>
              
              {/* Blend Components - Only show for blend type */}
              {productData.type === 'blend' && (
                <div className="form-section">
                  <div className="section-header">
                    <h2>Blend Components</h2>
                    <p>List the ingredients that make up this blend</p>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <p className="info-note">For blend components, please add details in the description field for now.</p>
                    </div>
                  </div>
                </div>
              )}
              
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
                  disabled={updating}
                >
                  {updating ? (
                    <>
                      <LoadingSpinner size="small" color="white" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    'Update Magical Product ✨'
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductEditPage;