// frontend/src/pages/subscription/SubscriptionDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSubscriptionDetails, updateSubscription, cancelSubscription } from '../../redux/slices/subscriptionSlice';
import { toast } from 'react-toastify';

const SubscriptionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { subscription, loading, error, success } = useSelector((state) => state.subscriptions);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  useEffect(() => {
    dispatch(getSubscriptionDetails(id));
  }, [dispatch, id]);
  
  useEffect(() => {
    if (subscription) {
      setEditData({
        name: subscription.name || '',
        frequency: subscription.frequency || 'monthly',
        customizations: subscription.customizations || {
          preferences: {
            flavorTypes: [],
            intensity: 3,
            surpriseElement: false
          },
          exclusions: []
        },
        shippingAddress: subscription.shippingAddress || {
          address: '',
          city: '',
          postalCode: '',
          country: ''
        }
      });
    }
  }, [subscription]);
  
  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditData({
        ...editData,
        [parent]: {
          ...editData[parent],
          [child]: value
        }
      });
    } else {
      setEditData({
        ...editData,
        [name]: value
      });
    }
  };
  
  // Handle shipping address changes
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      shippingAddress: {
        ...editData.shippingAddress,
        [name]: value
      }
    });
  };
  
  // Handle flavor preference changes
  const handleFlavorChange = (flavor, isChecked) => {
    if (isChecked) {
      setEditData({
        ...editData,
        customizations: {
          ...editData.customizations,
          preferences: {
            ...editData.customizations.preferences,
            flavorTypes: [...editData.customizations.preferences.flavorTypes, flavor]
          }
        }
      });
    } else {
      setEditData({
        ...editData,
        customizations: {
          ...editData.customizations,
          preferences: {
            ...editData.customizations.preferences,
            flavorTypes: editData.customizations.preferences.flavorTypes.filter(f => f !== flavor)
          }
        }
      });
    }
  };
  
  // Handle exclusions changes
  const handleExclusionChange = (flavor, isChecked) => {
    if (isChecked) {
      setEditData({
        ...editData,
        customizations: {
          ...editData.customizations,
          exclusions: [...editData.customizations.exclusions, flavor]
        }
      });
    } else {
      setEditData({
        ...editData,
        customizations: {
          ...editData.customizations,
          exclusions: editData.customizations.exclusions.filter(f => f !== flavor)
        }
      });
    }
  };
  
  // Handle intensity change
  const handleIntensityChange = (e) => {
    setEditData({
      ...editData,
      customizations: {
        ...editData.customizations,
        preferences: {
          ...editData.customizations.preferences,
          intensity: parseInt(e.target.value)
        }
      }
    });
  };
  
  // Handle surprise element toggle
  const handleSurpriseToggle = (e) => {
    setEditData({
      ...editData,
      customizations: {
        ...editData.customizations,
        preferences: {
          ...editData.customizations.preferences,
          surpriseElement: e.target.checked
        }
      }
    });
  };
  
  // Save changes
  const handleSave = () => {
    dispatch(updateSubscription({ id, subscriptionData: editData }));
    setEditing(false);
    toast.success('Subscription updated successfully');
  };
  
  // Cancel subscription
  const handleCancelSubscription = () => {
    dispatch(cancelSubscription(id));
    setShowCancelModal(false);
    toast.success('Subscription cancelled successfully');
  };
  
  // Flavor options for preferences
  const flavorOptions = [
    'Sweet', 'Spicy', 'Bitter', 'Sour', 'Umami',
    'Floral', 'Earthy', 'Fruity', 'Smoky', 'Herbal'
  ];
  
  if (loading && !subscription) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading subscription details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => navigate('/subscriptions')}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
        >
          Back to Subscriptions
        </button>
      </div>
    );
  }
  
  if (!subscription) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-10">
          <p className="text-2xl mb-2">Subscription Not Found</p>
          <p className="text-gray-600">The subscription you're looking for may have been removed or doesn't exist.</p>
          <button 
            onClick={() => navigate('/subscriptions')}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            View My Subscriptions
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subscription Details</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/subscriptions')}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
          
          {subscription.status === 'active' && !editing && (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Edit
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header with Status */}
            <div className="p-6 bg-gray-50 border-b flex justify-between items-center">
              {editing ? (
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleChange}
                  className="text-xl font-semibold bg-white border rounded px-2 py-1 w-full"
                />
              ) : (
                <h2 className="text-xl font-semibold">{subscription.name}</h2>
              )}
              
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                subscription.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : subscription.status === 'paused'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
              }`}>
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </span>
            </div>
            
            {/* Subscription Details */}
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Delivery Schedule</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 text-sm">Frequency:</p>
                      {editing ? (
                        <div className="mt-1">
                          <select
                            name="frequency"
                            value={editData.frequency}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                          >
                            <option value="weekly">Weekly</option>
                            <option value="biweekly">Biweekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                          </select>
                        </div>
                      ) : (
                        <p className="font-medium">
                          {subscription.frequency.charAt(0).toUpperCase() + subscription.frequency.slice(1)}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-gray-600 text-sm">Next Delivery:</p>
                      <p className="font-medium">{formatDate(subscription.nextDeliveryDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Products</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {subscription.products && subscription.products.length > 0 ? (
                    <div className="space-y-4">
                      {subscription.products.map((item, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-16 h-16 flex-shrink-0 mr-4">
                            {item.product && item.product.images && item.product.images.length > 0 ? (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded">
                                <span className="text-xs text-gray-500">No image</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-grow">
                            <p className="font-medium">
                              {item.product ? item.product.name : 'Product'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.product && item.product.type 
                                ? item.product.type.charAt(0).toUpperCase() + item.product.type.slice(1) 
                                : 'Type not specified'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">Qty: {item.quantity}</p>
                            <p className="text-sm text-gray-600">
                              ${item.product ? (item.product.price * item.quantity).toFixed(2) : '0.00'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 italic">No products in this subscription</p>
                  )}
                  
                  <div className="mt-4 pt-4 border-t">
                    <button
                      onClick={() => navigate('/subscriptions/create')}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Create a new subscription with different products
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Flavor Preferences</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {editing ? (
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium mb-2">Preferred Flavors:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {flavorOptions.map(flavor => (
                            <label key={flavor} className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={editData.customizations.preferences.flavorTypes.includes(flavor)}
                                onChange={(e) => handleFlavorChange(flavor, e.target.checked)}
                                className="form-checkbox h-4 w-4 text-green-600"
                              />
                              <span className="ml-2 text-sm">{flavor}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="font-medium mb-2">Flavor Intensity:</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Mild</span>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={editData.customizations.preferences.intensity}
                            onChange={handleIntensityChange}
                            className="flex-grow"
                          />
                          <span className="text-sm text-gray-600">Strong</span>
                        </div>
                        <div className="text-center text-sm text-gray-600 mt-1">
                          {editData.customizations.preferences.intensity}/5
                        </div>
                      </div>
                      
                      <div>
                        <p className="font-medium mb-2">Surprise Element:</p>
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={editData.customizations.preferences.surpriseElement}
                            onChange={handleSurpriseToggle}
                            className="form-checkbox h-4 w-4 text-green-600"
                          />
                          <span className="ml-2">Include a surprise product in each delivery</span>
                        </label>
                      </div>
                      
                      <div>
                        <p className="font-medium mb-2">Flavors to Exclude:</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {flavorOptions.map(flavor => (
                            <label key={`exclude-${flavor}`} className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={editData.customizations.exclusions.includes(flavor)}
                                onChange={(e) => handleExclusionChange(flavor, e.target.checked)}
                                className="form-checkbox h-4 w-4 text-red-600"
                              />
                              <span className="ml-2 text-sm">{flavor}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">Preferred Flavors:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {subscription.customizations && subscription.customizations.preferences && 
                           subscription.customizations.preferences.flavorTypes &&
                           subscription.customizations.preferences.flavorTypes.length > 0 ? (
                            subscription.customizations.preferences.flavorTypes.map((flavor, index) => (
                              <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                {flavor}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-600 italic">No preferences set</span>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <p className="font-medium">Flavor Intensity:</p>
                        <div className="flex items-center mt-1">
                          {subscription.customizations && subscription.customizations.preferences ? (
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mr-2">
                                <div 
                                  className="bg-green-600 h-2 rounded-full" 
                                  style={{ width: `${(subscription.customizations.preferences.intensity / 5) * 100}%` }}
                                ></div>
                              </div>
                              <span>{subscription.customizations.preferences.intensity}/5</span>
                            </div>
                          ) : (
                            <span className="text-gray-600 italic">Not specified</span>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <p className="font-medium">Surprise Element:</p>
                        <p className="mt-1">
                          {subscription.customizations && subscription.customizations.preferences && 
                           subscription.customizations.preferences.surpriseElement ? (
                            <span className="text-green-600">Enabled</span>
                          ) : (
                            <span className="text-gray-600">Disabled</span>
                          )}
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-medium">Excluded Flavors:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {subscription.customizations && subscription.customizations.exclusions && 
                           subscription.customizations.exclusions.length > 0 ? (
                            subscription.customizations.exclusions.map((flavor, index) => (
                              <span key={index} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                                {flavor}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-600 italic">No exclusions set</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Shipping Address</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {editing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-1 text-sm" htmlFor="address">
                          Street Address
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={editData.shippingAddress.address}
                          onChange={handleShippingChange}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
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
                          value={editData.shippingAddress.city}
                          onChange={handleShippingChange}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
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
                          value={editData.shippingAddress.postalCode}
                          onChange={handleShippingChange}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
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
                          value={editData.shippingAddress.country}
                          onChange={handleShippingChange}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <address className="not-italic">
                      <p>{subscription.shippingAddress.address}</p>
                      <p>{subscription.shippingAddress.city}, {subscription.shippingAddress.postalCode}</p>
                      <p>{subscription.shippingAddress.country}</p>
                    </address>
                  )}
                </div>
              </div>
              
              {/* Delivery History */}
              {!editing && subscription.history && subscription.history.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Delivery History</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-4">
                      {subscription.history.map((delivery, index) => (
                        <div key={index} className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0">
                          <div>
                            <p className="font-medium">{formatDate(delivery.deliveryDate)}</p>
                            <p className="text-sm text-gray-600">Status: {delivery.status}</p>
                          </div>
                          {delivery.orderId && (
                            <button
                              onClick={() => navigate(`/order/${delivery.orderId}`)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              View Order
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Edit Buttons */}
              {editing && (
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Price Summary */}
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold mb-4">Price Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subscription.price ? subscription.price.basePrice.toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Subscription Discount:</span>
                  <span>-${subscription.price ? subscription.price.discount.toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${subscription.price ? subscription.price.tax.toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>
                    {subscription.price && subscription.price.shipping > 0 
                      ? `$${subscription.price.shipping.toFixed(2)}` 
                      : 'FREE'}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span>${subscription.price ? subscription.price.total.toFixed(2) : '0.00'}</span>
                </div>
              </div>
            </div>
            
            {/* Subscription Actions */}
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Subscription Actions</h3>
              
              {subscription.status === 'active' && (
                <div className="space-y-3">
                  <button
                    className="w-full py-2 px-4 border border-yellow-300 bg-yellow-50 text-yellow-800 rounded-md hover:bg-yellow-100 transition-colors flex items-center justify-center"
                    onClick={() => {
                      toast.info("This would allow you to pause the subscription");
                    }}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pause Subscription
                  </button>
                  
                  <button
                    className="w-full py-2 px-4 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors flex items-center justify-center"
                    onClick={() => setShowCancelModal(true)}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel Subscription
                  </button>
                </div>
              )}
              
              {subscription.status === 'paused' && (
                <button
                  className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                  onClick={() => {
                    toast.info("This would allow you to resume the subscription");
                  }}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Resume Subscription
                </button>
              )}
              
              {subscription.status === 'cancelled' && (
                <div className="text-center">
                  <p className="text-gray-600 mb-3">This subscription has been cancelled</p>
                  <button
                    className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    onClick={() => navigate('/subscriptions/create')}
                  >
                    Create New Subscription
                  </button>
                </div>
              )}
            </div>
            
            {/* Help & Support */}
            <div className="p-6 border-t bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">Help & Support</h3>
              <div className="space-y-4">
                <button
                  className="w-full text-left flex items-center text-blue-600 hover:text-blue-800"
                  onClick={() => toast.info("This would open a FAQ modal")}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Subscription FAQ
                </button>
                
                <button
                  className="w-full text-left flex items-center text-blue-600 hover:text-blue-800"
                  onClick={() => toast.info("This would open a contact form")}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Cancel Subscription</h3>
            <p className="mb-4">
              Are you sure you want to cancel your "{subscription.name}" subscription? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Subscription
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={handleCancelSubscription}
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionDetailPage;