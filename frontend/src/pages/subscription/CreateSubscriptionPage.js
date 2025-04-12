// frontend/src/pages/subscription/CreateSubscriptionPage.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createSubscription, getSubscriptionRecommendations, resetSubscriptionState } from '../../redux/slices/subscriptionSlice';
import { fetchProducts } from '../../redux/slices/productSlice';

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create Your Subscription Box</h1>
      
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <span className="mt-2 text-sm">Select Products</span>
          </div>
          <div className="flex-1 h-1 mx-2 bg-gray-200">
            <div className={`h-full ${step >= 2 ? 'bg-green-500' : 'bg-gray-200'}`} style={{ width: step >= 2 ? '100%' : '0%' }}></div>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <span className="mt-2 text-sm">Customize</span>
          </div>
          <div className="flex-1 h-1 mx-2 bg-gray-200">
            <div className={`h-full ${step >= 3 ? 'bg-green-500' : 'bg-gray-200'}`} style={{ width: step >= 3 ? '100%' : '0%' }}></div>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
            <span className="mt-2 text-sm">Delivery</span>
          </div>
          <div className="flex-1 h-1 mx-2 bg-gray-200">
            <div className={`h-full ${step >= 4 ? 'bg-green-500' : 'bg-gray-200'}`} style={{ width: step >= 4 ? '100%' : '0%' }}></div>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 4 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              4
            </div>
            <span className="mt-2 text-sm">Review & Confirm</span>
          </div>
        </div>
      </div>
      
      {/* Error display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Step 1: Product Selection */}
            {step === 1 && (
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Select Products for Your Box</h2>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Recommended Based on Your Preferences</h3>
                  {recommendations && recommendations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recommendations.map(product => (
                        <div key={product._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex">
                            <div className="w-20 h-20 flex-shrink-0">
                              <img 
                                src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder-spice.jpg'} 
                                alt={product.name} 
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            <div className="ml-4 flex-grow">
                              <h4 className="font-medium">{product.name}</h4>
                              <p className="text-sm text-gray-600">{product.type}</p>
                              <p className="text-sm mt-1">${product.price.toFixed(2)}</p>
                              
                              {product.matchScore && (
                                <div className="mt-1 inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                  {product.matchScore}% Match
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleProductSelect(product)}
                            className="mt-3 w-full py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                          >
                            Add to Box
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">Loading recommendations...</p>
                  )}
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-2">Browse All Products</h3>
                  {products && products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {products.map(product => (
                        <div key={product._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex">
                            <div className="w-20 h-20 flex-shrink-0">
                              <img 
                                src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder-spice.jpg'} 
                                alt={product.name} 
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            <div className="ml-4 flex-grow">
                              <h4 className="font-medium">{product.name}</h4>
                              <p className="text-sm text-gray-600">{product.type}</p>
                              <p className="text-sm mt-1">${product.price.toFixed(2)}</p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleProductSelect(product)}
                            className="mt-3 w-full py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                          >
                            Add to Box
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">Loading products...</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Step 2: Customization */}
            {step === 2 && (
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Customize Your Subscription</h2>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2" htmlFor="name">
                    Subscription Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Give your subscription a name (e.g. 'My Monthly Tea Mix')"
                    value={subscriptionData.name}
                    onChange={(e) => setSubscriptionData({...subscriptionData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">
                    Delivery Frequency
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['weekly', 'biweekly', 'monthly', 'quarterly'].map((freq) => (
                      <div key={freq} className="relative">
                        <input
                          type="radio"
                          id={freq}
                          name="frequency"
                          checked={subscriptionData.frequency === freq}
                          onChange={() => setSubscriptionData({...subscriptionData, frequency: freq})}
                          className="absolute opacity-0 w-full h-full cursor-pointer"
                        />
                        <label
                          htmlFor={freq}
                          className={`block p-3 text-center border rounded-lg cursor-pointer ${
                            subscriptionData.frequency === freq
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-300 hover:border-green-300'
                          }`}
                        >
                          {freq.charAt(0).toUpperCase() + freq.slice(1)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">
                    Flavor Preferences
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-gray-50 p-4 rounded-lg">
                    {flavorOptions.map(flavor => (
                      <label key={flavor} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={subscriptionData.customizations.preferences.flavorTypes.includes(flavor)}
                          onChange={(e) => handleFlavorChange(flavor, e.target.checked)}
                          className="form-checkbox h-5 w-5 text-green-600"
                        />
                        <span className="ml-2 text-gray-700">{flavor}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">
                    Flavor Intensity Preference
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Mild</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={subscriptionData.customizations.preferences.intensity}
                      onChange={handleIntensityChange}
                      className="flex-grow"
                    />
                    <span className="text-sm text-gray-600">Strong</span>
                  </div>
                  <div className="text-center text-sm text-gray-600 mt-1">
                    {subscriptionData.customizations.preferences.intensity}/5
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={subscriptionData.customizations.preferences.surpriseElement}
                      onChange={handleSurpriseToggle}
                      className="form-checkbox h-5 w-5 text-green-600"
                    />
                    <span className="ml-2 text-gray-700">Include a surprise product in each delivery</span>
                  </label>
                  <p className="text-sm text-gray-600 ml-7 mt-1">
                    We'll include a special product that matches your preferences but isn't in your regular selection
                  </p>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">
                    Flavors to Exclude
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-gray-50 p-4 rounded-lg">
                    {flavorOptions.map(flavor => (
                      <label key={`exclude-${flavor}`} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={subscriptionData.customizations.exclusions.includes(flavor)}
                          onChange={(e) => handleExclusionChange(flavor, e.target.checked)}
                          className="form-checkbox h-5 w-5 text-red-600"
                        />
                        <span className="ml-2 text-gray-700">{flavor}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Delivery */}
            {step === 3 && (
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2" htmlFor="nextDeliveryDate">
                    First Delivery Date
                  </label>
                  <input
                    type="date"
                    id="nextDeliveryDate"
                    value={subscriptionData.nextDeliveryDate}
                    onChange={(e) => setSubscriptionData({...subscriptionData, nextDeliveryDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Shipping Address</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-1 text-sm" htmlFor="address">
                        Street Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={subscriptionData.shippingAddress.address}
                        onChange={handleShippingChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-1 text-sm" htmlFor="city">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={subscriptionData.shippingAddress.city}
                        onChange={handleShippingChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-1 text-sm" htmlFor="postalCode">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={subscriptionData.shippingAddress.postalCode}
                        onChange={handleShippingChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-1 text-sm" htmlFor="country">
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={subscriptionData.shippingAddress.country}
                        onChange={handleShippingChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Payment Method</h3>
                  
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Stripe"
                        checked={subscriptionData.paymentMethod === 'Stripe'}
                        onChange={() => setSubscriptionData({...subscriptionData, paymentMethod: 'Stripe'})}
                        className="form-radio h-4 w-4 text-green-600"
                      />
                      <span className="ml-2">Credit Card</span>
                    </label>
                    
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="PayPal"
                        checked={subscriptionData.paymentMethod === 'PayPal'}
                        onChange={() => setSubscriptionData({...subscriptionData, paymentMethod: 'PayPal'})}
                        className="form-radio h-4 w-4 text-green-600"
                      />
                      <span className="ml-2">PayPal</span>
                    </label>
                  </div>
                  
                  <p className="mt-3 text-sm text-gray-600">
                    Your subscription payment will be processed automatically according to your chosen frequency. You can cancel or modify your subscription at any time.
                  </p>
                </div>
              </div>
            )}
            
            {/* Step 4: Review & Confirm */}
            {step === 4 && (
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Review Your Subscription</h2>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Subscription Details</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">Name:</p>
                      <p>{subscriptionData.name}</p>
                    </div>
                    
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">Delivery Frequency:</p>
                      <p>{subscriptionData.frequency.charAt(0).toUpperCase() + subscriptionData.frequency.slice(1)}</p>
                    </div>
                    
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">First Delivery:</p>
                      <p>{new Date(subscriptionData.nextDeliveryDate).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <p className="font-medium">Payment Method:</p>
                      <p>{subscriptionData.paymentMethod}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Products</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {subscriptionData.products.length === 0 ? (
                      <p className="text-center text-gray-600">No products selected</p>
                    ) : (
                      <div className="space-y-4">
                        {subscriptionData.products.map((item) => (
                          <div key={item.product} className="flex items-center">
                            <div className="w-12 h-12 flex-shrink-0 mr-4">
                              <img
                                src={item.image || '/images/placeholder-spice.jpg'}
                                alt={item.name}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            <div className="flex-grow">
                              <p className="font-medium">{item.name}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{item.quantity} x ${item.price.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Shipping Address</h3>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p>{subscriptionData.shippingAddress.address}</p>
                      <p>{subscriptionData.shippingAddress.city}, {subscriptionData.shippingAddress.postalCode}</p>
                      <p>{subscriptionData.shippingAddress.country}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Preferences</h3>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="mb-2">
                        <p className="font-medium">Flavor Types:</p>
                        <p>
                          {subscriptionData.customizations.preferences.flavorTypes.length > 0
                            ? subscriptionData.customizations.preferences.flavorTypes.join(', ')
                            : 'No preferences set'}
                        </p>
                      </div>
                      
                      <div className="mb-2">
                        <p className="font-medium">Intensity:</p>
                        <p>{subscriptionData.customizations.preferences.intensity}/5</p>
                      </div>
                      
                      <div className="mb-2">
                        <p className="font-medium">Excluded Flavors:</p>
                        <p>
                          {subscriptionData.customizations.exclusions.length > 0
                            ? subscriptionData.customizations.exclusions.join(', ')
                            : 'None'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-medium">Surprise Element:</p>
                        <p>{subscriptionData.customizations.preferences.surpriseElement ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Navigation Buttons */}
              <div className="p-6 bg-gray-50 border-t flex justify-between">
                {step > 1 && (
                  <button
                    onClick={handlePrevStep}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                  >
                    Previous
                  </button>
                )}
                
                {step < 4 ? (
                  <button
                    onClick={handleNextStep}
                    className={`px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors ${
                      step === 1 && !subscriptionData.products.length || loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={step === 1 && !subscriptionData.products.length || loading}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Subscription'}
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-20">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Subscription Summary</h2>
                
                {/* Selected Products */}
                <div className="mb-6">
                  <h3 className="text-gray-600 mb-2 text-sm uppercase font-semibold">Selected Products</h3>
                  
                  {subscriptionData.products.length === 0 ? (
                    <p className="text-gray-500 italic">No products selected yet</p>
                  ) : (
                    <div className="space-y-3">
                      {subscriptionData.products.map((item) => (
                        <div key={item.product} className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-10 h-10 flex-shrink-0 mr-2">
                              <img
                                src={item.image || '/images/placeholder-spice.jpg'}
                                alt={item.name}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            <div>
                              <p className="text-sm">{item.name}</p>
                              <div className="flex items-center mt-1">
                                <button
                                  onClick={() => handleQuantityChange(item.product, Math.max(1, item.quantity - 1))}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                <span className="mx-2 text-sm">{item.quantity}</span>
                                <button
                                  onClick={() => handleQuantityChange(item.product, item.quantity + 1)}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <p className="text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                            <button
                              onClick={() => handleRemoveProduct(item.product)}
                              className="text-red-500 hover:text-red-700 text-xs mt-1"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Price Breakdown */}
                {subscriptionData.products.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-gray-600 mb-2 text-sm uppercase font-semibold">Price Breakdown</h3>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Products Total:</span>
                        <span>${totals.basePrice.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Subscription Discount (10%):</span>
                        <span>-${totals.discount.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>${totals.subtotal.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Tax (15%):</span>
                        <span>${totals.tax.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Shipping:</span>
                        <span className="text-green-600">FREE</span>
                      </div>
                      
                      <div className="flex justify-between font-bold text-lg pt-2 border-t">
                        <span>Total per delivery:</span>
                        <span>${totals.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Subscription Benefits */}
                <div>
                  <h3 className="text-gray-600 mb-2 text-sm uppercase font-semibold">Subscription Benefits</h3>
                  
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">10% discount on all subscription products</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Free shipping on all deliveries</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Modify, pause, or cancel anytime</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Priority access to limited edition products</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default CreateSubscriptionPage;