// frontend/src/pages/subscription/CreateSubscriptionPage.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createSubscription, getSubscriptionRecommendations, resetSubscriptionState } from '../../redux/slices/subscriptionSlice';
import { fetchProducts } from '../../redux/slices/productSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './CreateSubscriptionPage.css';

const CreateSubscriptionPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [subscriptionData, setSubscriptionData] = useState({
    name: '',
    frequency: 'monthly',
    products: [],
    customizations: {
      preferences: {
        flavorTypes: [],
        intensity: 3,
        surpriseElement: false
      },
      exclusions: []
    },
    shippingAddress: {
      address: '',
      city: '',
      postalCode: '',
      country: ''
    },
    paymentMethod: 'Stripe',
    nextDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  
  // Redux states
  const { loading, error, success } = useSelector((state) => state.subscriptions);
  const { products } = useSelector((state) => state.products);
  const { userInfo } = useSelector((state) => state.auth);
  const { recommendations } = useSelector((state) => state.subscriptions);
  const { shippingAddress } = useSelector((state) => state.cart);
  
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(getSubscriptionRecommendations());
    
    // If the user has a shipping address, prefill it
    if (shippingAddress && shippingAddress.address) {
      setSubscriptionData(prev => ({
        ...prev,
        shippingAddress: {
          address: shippingAddress.address,
          city: shippingAddress.city,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country
        }
      }));
    }
    
    // If success, redirect to subscriptions page
    if (success) {
      toast.success('Subscription created successfully!');
      navigate('/subscriptions');
      dispatch(resetSubscriptionState());
    }
  }, [dispatch, success, navigate, shippingAddress]);
  
  // Handle product selection
  const handleProductSelect = (product) => {
    const existingProductIndex = subscriptionData.products.findIndex(
      p => p.product === product._id
    );
    
    if (existingProductIndex >= 0) {
      // Product already selected, update quantity
      const updatedProducts = [...subscriptionData.products];
      updatedProducts[existingProductIndex] = {
        ...updatedProducts[existingProductIndex],
        quantity: updatedProducts[existingProductIndex].quantity + 1
      };
      
      setSubscriptionData({
        ...subscriptionData,
        products: updatedProducts
      });
    } else {
      // Add new product
      setSubscriptionData({
        ...subscriptionData,
        products: [
          ...subscriptionData.products, 
          { 
            product: product._id,
            name: product.name,
            image: product.images && product.images.length > 0 ? product.images[0] : '',
            price: product.price,
            quantity: 1 
          }
        ]
      });
    }
  };
  
  // Handle product removal
  const handleRemoveProduct = (productId) => {
    setSubscriptionData({
      ...subscriptionData,
      products: subscriptionData.products.filter(p => p.product !== productId)
    });
  };
  
  // Handle quantity change
  const handleQuantityChange = (productId, quantity) => {
    setSubscriptionData({
      ...subscriptionData,
      products: subscriptionData.products.map(p => 
        p.product === productId ? { ...p, quantity: parseInt(quantity) } : p
      )
    });
  };
  
  // Handle flavor preferences
  const handleFlavorChange = (flavor, isChecked) => {
    if (isChecked) {
      setSubscriptionData({
        ...subscriptionData,
        customizations: {
          ...subscriptionData.customizations,
          preferences: {
            ...subscriptionData.customizations.preferences,
            flavorTypes: [...subscriptionData.customizations.preferences.flavorTypes, flavor]
          }
        }
      });
    } else {
      setSubscriptionData({
        ...subscriptionData,
        customizations: {
          ...subscriptionData.customizations,
          preferences: {
            ...subscriptionData.customizations.preferences,
            flavorTypes: subscriptionData.customizations.preferences.flavorTypes.filter(f => f !== flavor)
          }
        }
      });
    }
  };
  
  // Handle exclusions
  const handleExclusionChange = (flavor, isChecked) => {
    if (isChecked) {
      setSubscriptionData({
        ...subscriptionData,
        customizations: {
          ...subscriptionData.customizations,
          exclusions: [...subscriptionData.customizations.exclusions, flavor]
        }
      });
    } else {
      setSubscriptionData({
        ...subscriptionData,
        customizations: {
          ...subscriptionData.customizations,
          exclusions: subscriptionData.customizations.exclusions.filter(f => f !== flavor)
        }
      });
    }
  };
  
  // Handle shipping address
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setSubscriptionData({
      ...subscriptionData,
      shippingAddress: {
        ...subscriptionData.shippingAddress,
        [name]: value
      }
    });
  };
  
  // Handle surprise element toggle
  const handleSurpriseToggle = (e) => {
    setSubscriptionData({
      ...subscriptionData,
      customizations: {
        ...subscriptionData.customizations,
        preferences: {
          ...subscriptionData.customizations.preferences,
          surpriseElement: e.target.checked
        }
      }
    });
  };
  
  // Handle intensity change
  const handleIntensityChange = (e) => {
    setSubscriptionData({
      ...subscriptionData,
      customizations: {
        ...subscriptionData.customizations,
        preferences: {
          ...subscriptionData.customizations.preferences,
          intensity: parseInt(e.target.value)
        }
      }
    });
  };
  
  // Handle next step
  const handleNextStep = () => {
    // Validation for each step
    if (step === 1 && subscriptionData.products.length === 0) {
      toast.error('Please select at least one product for your subscription');
      return;
    }
    
    if (step === 2 && !subscriptionData.name) {
      toast.error('Please name your subscription');
      return;
    }
    
    if (step === 3) {
      // Shipping address validation
      const { address, city, postalCode, country } = subscriptionData.shippingAddress;
      if (!address || !city || !postalCode || !country) {
        toast.error('Please fill in all shipping address fields');
        return;
      }
    }
    
    setStep(step + 1);
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    setStep(step - 1);
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Final validation
    if (subscriptionData.products.length === 0) {
      toast.error('Please select at least one product');
      return;
    }
    
    if (!subscriptionData.name) {
      toast.error('Please name your subscription');
      return;
    }
    
    const { address, city, postalCode, country } = subscriptionData.shippingAddress;
    if (!address || !city || !postalCode || !country) {
      toast.error('Please fill in all shipping address fields');
      return;
    }
    
    // Prepare data for API
    const formattedProducts = subscriptionData.products.map(p => ({
      product: p.product,
      quantity: p.quantity
    }));
    
    const subscriptionPayload = {
      ...subscriptionData,
      products: formattedProducts
    };
    
    dispatch(createSubscription(subscriptionPayload));
  };
  
  // Calculate subscription total
  const calculateTotal = () => {
    const basePrice = subscriptionData.products.reduce(
      (total, item) => total + (item.price * item.quantity), 0
    );
    const discount = basePrice * 0.1; // 10% subscription discount
    const subtotal = basePrice - discount;
    const tax = subtotal * 0.15; // 15% tax
    const shipping = 0; // Free shipping for subscriptions
    
    return {
      basePrice,
      discount,
      subtotal,
      tax,
      shipping,
      total: subtotal + tax + shipping
    };
  };
  
  // Flavor options for preferences
  const flavorOptions = [
    'Sweet', 'Spicy', 'Bitter', 'Sour', 'Umami',
    'Floral', 'Earthy', 'Fruity', 'Smoky', 'Herbal'
  ];
  
  // Calculate subscription summary
  const totals = calculateTotal();
  
  return (
    <div className="subscription-container">
      <div className="subscription-header">
        <h1>Create Your Subscription Box ✨</h1>
        <p>Customize your magical flavors delivered regularly</p>
      </div>
      
      {/* Progress indicator */}
      <div className="subscription-steps">
        <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Select Products</div>
        </div>
        <div className={`step-connector ${step > 1 ? 'completed' : ''}`}></div>
        <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Customize</div>
        </div>
        <div className={`step-connector ${step > 2 ? 'completed' : ''}`}></div>
        <div className={`step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Delivery</div>
        </div>
        <div className={`step-connector ${step > 3 ? 'completed' : ''}`}></div>
        <div className={`step ${step >= 4 ? 'active' : ''}`}>
          <div className="step-number">4</div>
          <div className="step-label">Review & Confirm</div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="subscription-content">
        <div className="subscription-grid">
          {/* Main Column */}
          <div className="main-column">
            {/* Step 1: Product Selection */}
            {step === 1 && (
              <div className="bento-card">
                <div className="card-header">
                  <h2>Select Products for Your Box</h2>
                  <p>Choose magical flavors to include in your subscription</p>
                </div>
                <div className="card-content">
                  {loading ? (
                    <div className="loading-center">
                      <LoadingSpinner size="large" color="purple" />
                    </div>
                  ) : (
                    <>
                      <h3 className="section-title">Recommended Based on Your Preferences</h3>
                      {recommendations && recommendations.length > 0 ? (
                        <div className="product-selection-grid">
                          {recommendations.map(product => (
                            <div 
                              key={product._id} 
                              className={`product-card ${
                                subscriptionData.products.some(p => p.product === product._id) ? 'selected' : ''
                              }`}
                            >
                              <img 
                                src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder-spice.jpg'} 
                                alt={product.name} 
                                className="product-card-image"
                              />
                              <h4 className="product-card-name">{product.name}</h4>
                              <p className="product-card-type">{product.type}</p>
                              <p className="product-card-price">${product.price.toFixed(2)}</p>
                              
                              {product.matchScore && (
                                <div className="match-score">
                                  {product.matchScore}% Match
                                </div>
                              )}
                              
                              <div className="product-card-controls">
                                {subscriptionData.products.some(p => p.product === product._id) ? (
                                  <div className="quantity-control">
                                    <button 
                                      onClick={() => {
                                        const currentQty = subscriptionData.products.find(p => p.product === product._id).quantity;
                                        if (currentQty === 1) {
                                          handleRemoveProduct(product._id);
                                        } else {
                                          handleQuantityChange(product._id, currentQty - 1);
                                        }
                                      }}
                                      className="quantity-button"
                                    >
                                      -
                                    </button>
                                    <span className="quantity-value">
                                      {subscriptionData.products.find(p => p.product === product._id).quantity}
                                    </span>
                                    <button 
                                      onClick={() => handleQuantityChange(
                                        product._id, 
                                        subscriptionData.products.find(p => p.product === product._id).quantity + 1
                                      )}
                                      className="quantity-button"
                                    >
                                      +
                                    </button>
                                  </div>
                                ) : (
                                  <button 
                                    onClick={() => handleProductSelect(product)}
                                    className="add-button"
                                  >
                                    Add to Box
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="no-recommendations">Loading recommendations...</p>
                      )}
                      
                      <h3 className="section-title">Browse All Products</h3>
                      {products && products.length > 0 ? (
                        <div className="product-selection-grid">
                          {products.map(product => (
                            <div 
                              key={product._id} 
                              className={`product-card ${
                                subscriptionData.products.some(p => p.product === product._id) ? 'selected' : ''
                              }`}
                            >
                              <img 
                                src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder-spice.jpg'} 
                                alt={product.name} 
                                className="product-card-image"
                              />
                              <h4 className="product-card-name">{product.name}</h4>
                              <p className="product-card-type">{product.type}</p>
                              <p className="product-card-price">${product.price.toFixed(2)}</p>
                              
                              <div className="product-card-controls">
                                {subscriptionData.products.some(p => p.product === product._id) ? (
                                  <div className="quantity-control">
                                    <button 
                                      onClick={() => {
                                        const currentQty = subscriptionData.products.find(p => p.product === product._id).quantity;
                                        if (currentQty === 1) {
                                          handleRemoveProduct(product._id);
                                        } else {
                                          handleQuantityChange(product._id, currentQty - 1);
                                        }
                                      }}
                                      className="quantity-button"
                                    >
                                      -
                                    </button>
                                    <span className="quantity-value">
                                      {subscriptionData.products.find(p => p.product === product._id).quantity}
                                    </span>
                                    <button 
                                      onClick={() => handleQuantityChange(
                                        product._id, 
                                        subscriptionData.products.find(p => p.product === product._id).quantity + 1
                                      )}
                                      className="quantity-button"
                                    >
                                      +
                                    </button>
                                  </div>
                                ) : (
                                  <button 
                                    onClick={() => handleProductSelect(product)}
                                    className="add-button"
                                  >
                                    Add to Box
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="no-products">Loading products...</p>
                      )}
                    </>
                  )}
                  
                  <div className="navigation-buttons">
                    <button
                      onClick={() => navigate('/products')}
                      className="back-button"
                    >
                      Browse Products
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="next-button"
                      disabled={subscriptionData.products.length === 0}
                    >
                      Next: Customize
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Customization */}
            {step === 2 && (
              <div className="bento-card">
                <div className="card-header">
                  <h2>Customize Your Subscription</h2>
                  <p>Personalize your magical deliveries</p>
                </div>
                <div className="card-content">
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">
                      Subscription Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="form-input"
                      placeholder="Give your subscription a name (e.g. 'My Monthly Tea Mix')"
                      value={subscriptionData.name}
                      onChange={(e) => setSubscriptionData({...subscriptionData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      Delivery Frequency
                    </label>
                    <div className="frequency-options">
                      {['weekly', 'biweekly', 'monthly', 'quarterly'].map((freq) => (
                        <div key={freq} className="frequency-option">
                          <input
                            type="radio"
                            id={freq}
                            name="frequency"
                            checked={subscriptionData.frequency === freq}
                            onChange={() => setSubscriptionData({...subscriptionData, frequency: freq})}
                            className="frequency-radio"
                          />
                          <label
                            htmlFor={freq}
                            className={`frequency-label ${
                              subscriptionData.frequency === freq ? 'selected' : ''
                            }`}
                          >
                            {freq.charAt(0).toUpperCase() + freq.slice(1)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      Flavor Preferences
                    </label>
                    <div className="checkbox-group">
                      {flavorOptions.map(flavor => (
                        <label key={flavor} className="checkbox-label">
                          <input
                            type="checkbox"
                            className="checkbox-input"
                            checked={subscriptionData.customizations.preferences.flavorTypes.includes(flavor)}
                            onChange={(e) => handleFlavorChange(flavor, e.target.checked)}
                          />
                          <span>{flavor}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      Flavor Intensity Preference
                    </label>
                    <div className="intensity-slider">
                      <span className="intensity-label">Mild</span>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={subscriptionData.customizations.preferences.intensity}
                        onChange={handleIntensityChange}
                        className="range-slider"
                      />
                      <span className="intensity-label">Strong</span>
                    </div>
                    <div className="intensity-value">
                      Current: {subscriptionData.customizations.preferences.intensity}/5
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="checkbox-label wide">
                      <input
                        type="checkbox"
                        className="checkbox-input"
                        checked={subscriptionData.customizations.preferences.surpriseElement}
                        onChange={handleSurpriseToggle}
                      />
                      <span>Include a surprise product in each delivery</span>
                    </label>
                    <p className="helper-text">
                      We'll include a special product that matches your preferences but isn't in your regular selection
                    </p>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      Flavors to Exclude
                    </label>
                    <div className="checkbox-group">
                      {flavorOptions.map(flavor => (
                        <label key={`exclude-${flavor}`} className="checkbox-label">
                          <input
                            type="checkbox"
                            className="checkbox-input"
                            checked={subscriptionData.customizations.exclusions.includes(flavor)}
                            onChange={(e) => handleExclusionChange(flavor, e.target.checked)}
                          />
                          <span>{flavor}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="navigation-buttons">
                    <button
                      onClick={handlePrevStep}
                      className="back-button"
                    >
                      Back to Products
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="next-button"
                      disabled={!subscriptionData.name}
                    >
                      Next: Delivery Details
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Delivery */}
            {step === 3 && (
              <div className="bento-card">
                <div className="card-header">
                  <h2>Delivery Details</h2>
                  <p>Where would you like to receive your magical flavors?</p>
                </div>
                <div className="card-content">
                  <div className="form-group">
                    <label className="form-label" htmlFor="nextDeliveryDate">
                      First Delivery Date
                    </label>
                    <input
                      type="date"
                      id="nextDeliveryDate"
                      className="form-input"
                      value={subscriptionData.nextDeliveryDate}
                      onChange={(e) => setSubscriptionData({...subscriptionData, nextDeliveryDate: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <h3 className="section-title">Shipping Address</h3>
                  
                  <div className="shipping-form">
                    <div className="form-group">
                      <label className="form-label" htmlFor="address">
                        Street Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        className="form-input"
                        value={subscriptionData.shippingAddress.address}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label" htmlFor="city">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        className="form-input"
                        value={subscriptionData.shippingAddress.city}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label" htmlFor="postalCode">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        className="form-input"
                        value={subscriptionData.shippingAddress.postalCode}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label" htmlFor="country">
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        className="form-input"
                        value={subscriptionData.shippingAddress.country}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <h3 className="section-title">Payment Method</h3>
                    
                    <div className="payment-options">
                      <label className="payment-option">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="Stripe"
                          checked={subscriptionData.paymentMethod === 'Stripe'}
                          onChange={() => setSubscriptionData({...subscriptionData, paymentMethod: 'Stripe'})}
                          className="payment-radio"
                        />
                        <span className="payment-label">Credit Card</span>
                      </label>
                      
                      <label className="payment-option">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="PayPal"
                          checked={subscriptionData.paymentMethod === 'PayPal'}
                          onChange={() => setSubscriptionData({...subscriptionData, paymentMethod: 'PayPal'})}
                          className="payment-radio"
                        />
                        <span className="payment-label">PayPal</span>
                      </label>
                    </div>
                    
                    <p className="helper-text">
                      Your subscription payment will be processed automatically according to your chosen frequency. You can cancel or modify your subscription at any time.
                    </p>
                  </div>
                  
                  <div className="navigation-buttons">
                    <button
                      onClick={handlePrevStep}
                      className="back-button"
                    >
                      Back to Customize
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="next-button"
                      disabled={
                        !subscriptionData.shippingAddress.address ||
                        !subscriptionData.shippingAddress.city ||
                        !subscriptionData.shippingAddress.postalCode ||
                        !subscriptionData.shippingAddress.country
                      }
                    >
                      Next: Review & Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 4: Review & Confirm */}
            {step === 4 && (
              <div className="bento-card">
                <div className="card-header">
                  <h2>Review Your Subscription</h2>
                  <p>Please confirm your subscription details before finalizing</p>
                </div>
                <div className="card-content">
                  <div className="review-section">
                    <h3 className="section-title">Subscription Details</h3>
                    <div className="review-detail-grid">
                      <div className="review-detail">
                        <span className="review-label">Name:</span>
                        <span className="review-value">{subscriptionData.name}</span>
                      </div>
                      
                      <div className="review-detail">
                        <span className="review-label">Delivery Frequency:</span>
                        <span className="review-value">
                          {subscriptionData.frequency.charAt(0).toUpperCase() + subscriptionData.frequency.slice(1)}
                        </span>
                      </div>
                      
                      <div className="review-detail">
                        <span className="review-label">First Delivery:</span>
                        <span className="review-value">
                          {new Date(subscriptionData.nextDeliveryDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="review-detail">
                        <span className="review-label">Payment Method:</span>
                        <span className="review-value">{subscriptionData.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="review-section">
                    <h3 className="section-title">Products</h3>
                    <div className="review-products">
                      {subscriptionData.products.length === 0 ? (
                        <p className="empty-message">No products selected</p>
                      ) : (
                        <div className="product-list">
                          {subscriptionData.products.map((item) => (
                            <div key={item.product} className="review-product">
                              <div className="product-image-container">
                                <img
                                  src={item.image || '/images/placeholder-spice.jpg'}
                                  alt={item.name}
                                  className="product-thumbnail"
                                />
                              </div>
                              <div className="product-details">
                                <h4 className="product-name">{item.name}</h4>
                              </div>
                              <div className="product-quantity">
                                {item.quantity} × ${item.price.toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="review-section">
                    <h3 className="section-title">Shipping Address</h3>
                    <div className="address-details">
                      <p>{subscriptionData.shippingAddress.address}</p>
                      <p>{subscriptionData.shippingAddress.city}, {subscriptionData.shippingAddress.postalCode}</p>
                      <p>{subscriptionData.shippingAddress.country}</p>
                    </div>
                  </div>
                  
                  <div className="review-section">
                    <h3 className="section-title">Preferences</h3>
                    <div className="preference-details">
                      <div className="preference-item">
                        <span className="preference-label">Flavor Types:</span>
                        <div className="preference-value">
                          {subscriptionData.customizations.preferences.flavorTypes.length > 0
                            ? subscriptionData.customizations.preferences.flavorTypes.join(', ')
                            : 'No preferences set'}
                        </div>
                      </div>
                      
                      <div className="preference-item">
                        <span className="preference-label">Intensity:</span>
                        <div className="preference-value">
                          {subscriptionData.customizations.preferences.intensity}/5
                        </div>
                      </div>
                      
                      <div className="preference-item">
                        <span className="preference-label">Excluded Flavors:</span>
                        <div className="preference-value">
                          {subscriptionData.customizations.exclusions.length > 0
                            ? subscriptionData.customizations.exclusions.join(', ')
                            : 'None'}
                        </div>
                      </div>
                      
                      <div className="preference-item">
                        <span className="preference-label">Surprise Element:</span>
                        <div className="preference-value">
                          {subscriptionData.customizations.preferences.surpriseElement ? 'Yes' : 'No'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="navigation-buttons">
                    <button
                      onClick={handlePrevStep}
                      className="back-button"
                    >
                      Back to Delivery
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="submit-button"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="loading-indicator">
                          <div className="spinner-small"></div>
                          <span>Creating subscription...</span>
                        </div>
                      ) : (
                        "Create Subscription"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar/Summary Column */}
          <div className="summary-column">
            <div className="bento-card summary-section">
              <div className="card-header">
                <h2>Subscription Summary</h2>
              </div>
              <div className="card-content">
                {subscriptionData.products.length > 0 ? (
                  <>
                    <div className="summary-items">
                      {subscriptionData.products.map((item) => (
                        <div key={item.product} className="summary-item">
                          <img
                            src={item.image || '/images/placeholder-spice.jpg'}
                            alt={item.name}
                            className="summary-item-image"
                          />
                          <div className="summary-item-details">
                            <div className="summary-item-name">{item.name}</div>
                            <div className="summary-item-quantity">{item.quantity} × ${item.price.toFixed(2)}</div>
                          </div>
                          <div className="summary-item-price">
                            ${(item.quantity * item.price).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>${totals.basePrice.toFixed(2)}</span>
                    </div>
                    
                    <div className="summary-row">
                      <span>Subscription Discount (10%)</span>
                      <span>-${totals.discount.toFixed(2)}</span>
                    </div>
                    
                    <div className="summary-row">
                      <span>Tax (15%)</span>
                      <span>${totals.tax.toFixed(2)}</span>
                    </div>
                    
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span>FREE</span>
                    </div>
                    
                    <div className="summary-total">
                      <span>Total per delivery</span>
                      <span>${totals.total.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <div className="empty-summary">
                    <p>No products selected yet</p>
                    <p className="helper-text">Add products to see your subscription summary</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bento-card benefits-card">
              <div className="card-header">
                <h2>Subscription Benefits</h2>
              </div>
              <div className="card-content">
                <ul className="benefits-list">
                  <li>10% discount on all subscription products</li>
                  <li>Free shipping on all deliveries</li>
                  <li>Modify, pause, or cancel anytime</li>
                  <li>Priority access to limited edition products</li>
                  <li>Freshness guarantee</li>
                </ul>
              </div>
            </div>
            
            <div className="bento-card help-card">
              <div className="card-header">
                <h2>Need Help?</h2>
              </div>
              <div className="card-content">
                <p>Our customer support team is available to assist you with creating your subscription.</p>
                <p className="contact-detail">📧 support@spicetea.com</p>
                <p className="contact-detail">📞 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSubscriptionPage;