// frontend/src/pages/subscription/SubscriptionDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getSubscriptionDetails, updateSubscription, cancelSubscription } from '../../redux/slices/subscriptionSlice';
import { toast } from 'react-toastify';
import './SubscriptionDetailPage.css';

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
      <div className="subscription-detail-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading subscription details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="subscription-detail-container">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h2>Error</h2>
          <p>{error}</p>
          <Link to="/subscriptions" className="back-button">Back to Subscriptions</Link>
        </div>
      </div>
    );
  }
  
  if (!subscription) {
    return (
      <div className="subscription-detail-container">
        <div className="not-found-container">
          <div className="not-found-icon">🔍</div>
          <h2>Subscription Not Found</h2>
          <p>The subscription you're looking for may have been removed or doesn't exist.</p>
          <Link to="/subscriptions" className="back-button">Back to Subscriptions</Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="subscription-detail-container">
      <div className="subscription-detail-header">
        <h1>Subscription Details ✨</h1>
        <p>Manage your magical flavor deliveries</p>
      </div>
      
      <div className="subscription-detail-content">
        <div className="subscription-detail-grid">
          <div className="subscription-main-column">
            <div className="bento-card subscription-info-card">
              {/* Header with Status */}
              <div className="card-header">
                <div className="header-content">
                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleChange}
                      className="edit-name-input"
                    />
                  ) : (
                    <h2>{subscription.name}</h2>
                  )}
                  
                  <span className={`status-badge ${subscription.status}`}>
                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                  </span>
                </div>
              </div>
              
              {/* Subscription Details */}
              <div className="card-content">
                <div className="detail-section">
                  <h3>Delivery Schedule</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Frequency:</span>
                      {editing ? (
                        <div className="edit-field">
                          <select
                            name="frequency"
                            value={editData.frequency}
                            onChange={handleChange}
                            className="edit-select"
                          >
                            <option value="weekly">Weekly</option>
                            <option value="biweekly">Biweekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                          </select>
                        </div>
                      ) : (
                        <span className="detail-value">
                          {subscription.frequency.charAt(0).toUpperCase() + subscription.frequency.slice(1)}
                        </span>
                      )}
                    </div>
                    
                    <div className="detail-item">
                      <span className="detail-label">Next Delivery:</span>
                      <span className="detail-value">{formatDate(subscription.nextDeliveryDate)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>Products</h3>
                  <div className="product-list">
                    {subscription.products && subscription.products.length > 0 ? (
                      subscription.products.map((item, index) => (
                        <div key={index} className="product-item">
                          <div className="product-image">
                            {item.product && item.product.images && item.product.images.length > 0 ? (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                              />
                            ) : (
                              <div className="placeholder-image">
                                <span>No image</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="product-details">
                            <h4 className="product-name">
                              {item.product ? item.product.name : 'Product'}
                            </h4>
                            <p className="product-type">
                              {item.product && item.product.type 
                                ? item.product.type.charAt(0).toUpperCase() + item.product.type.slice(1) 
                                : 'Type not specified'}
                            </p>
                          </div>
                          
                          <div className="product-quantity">
                            <span>Qty: {item.quantity}</span>
                          </div>
                          
                          <div className="product-price">
                            ${item.product ? (item.product.price * item.quantity).toFixed(2) : '0.00'}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="empty-message">No products in this subscription</p>
                    )}
                  </div>
                  
                  <div className="subscription-actions">
                    <Link to="/subscriptions/create" className="action-link">
                      Create a new subscription with different products
                    </Link>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>Flavor Preferences</h3>
                  {editing ? (
                    <div className="edit-preferences">
                      <div className="edit-group">
                        <label>Preferred Flavors:</label>
                        <div className="checkbox-grid">
                          {flavorOptions.map(flavor => (
                            <label key={flavor} className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={editData.customizations.preferences.flavorTypes.includes(flavor)}
                                onChange={(e) => handleFlavorChange(flavor, e.target.checked)}
                                className="checkbox-input"
                              />
                              <span>{flavor}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div className="edit-group">
                        <label>Flavor Intensity:</label>
                        <div className="slider-container">
                          <span className="slider-label">Mild</span>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={editData.customizations.preferences.intensity}
                            onChange={handleIntensityChange}
                            className="intensity-slider"
                          />
                          <span className="slider-label">Strong</span>
                        </div>
                        <div className="intensity-value">
                          {editData.customizations.preferences.intensity}/5
                        </div>
                      </div>
                      
                      <div className="edit-group">
                        <label className="checkbox-label wide">
                          <input
                            type="checkbox"
                            checked={editData.customizations.preferences.surpriseElement}
                            onChange={handleSurpriseToggle}
                            className="checkbox-input"
                          />
                          <span>Include a surprise product in each delivery</span>
                        </label>
                      </div>
                      
                      <div className="edit-group">
                        <label>Excluded Flavors:</label>
                        <div className="checkbox-grid">
                          {flavorOptions.map(flavor => (
                            <label key={`exclude-${flavor}`} className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={editData.customizations.exclusions.includes(flavor)}
                                onChange={(e) => handleExclusionChange(flavor, e.target.checked)}
                                className="checkbox-input"
                              />
                              <span>{flavor}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="preferences-display">
                      <div className="preferences-item">
                        <span className="preferences-label">Preferred Flavors:</span>
                        <div className="flavor-chips">
                          {subscription.customizations && subscription.customizations.preferences && 
                           subscription.customizations.preferences.flavorTypes &&
                           subscription.customizations.preferences.flavorTypes.length > 0 ? (
                            subscription.customizations.preferences.flavorTypes.map((flavor, index) => (
                              <span key={index} className="flavor-chip preferred">
                                {flavor}
                              </span>
                            ))
                          ) : (
                            <span className="empty-text">No preferences set</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="preferences-item">
                        <span className="preferences-label">Flavor Intensity:</span>
                        <div className="intensity-display">
                          {subscription.customizations && subscription.customizations.preferences ? (
                            <div className="intensity-bar-container">
                              <div 
                                className="intensity-bar" 
                                style={{ width: `${(subscription.customizations.preferences.intensity / 5) * 100}%` }}
                              ></div>
                              <span className="intensity-number">{subscription.customizations.preferences.intensity}/5</span>
                            </div>
                          ) : (
                            <span className="empty-text">Not specified</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="preferences-item">
                        <span className="preferences-label">Surprise Element:</span>
                        <span className={`preference-value ${subscription.customizations?.preferences?.surpriseElement ? 'active' : 'inactive'}`}>
                          {subscription.customizations && subscription.customizations.preferences && 
                           subscription.customizations.preferences.surpriseElement ? (
                            'Enabled'
                          ) : (
                            'Disabled'
                          )}
                        </span>
                      </div>
                      
                      <div className="preferences-item">
                        <span className="preferences-label">Excluded Flavors:</span>
                        <div className="flavor-chips">
                          {subscription.customizations && subscription.customizations.exclusions && 
                           subscription.customizations.exclusions.length > 0 ? (
                            subscription.customizations.exclusions.map((flavor, index) => (
                              <span key={index} className="flavor-chip excluded">
                                {flavor}
                              </span>
                            ))
                          ) : (
                            <span className="empty-text">No exclusions set</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="detail-section">
                  <h3>Shipping Address</h3>
                  {editing ? (
                    <div className="edit-address">
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="address">Street Address</label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={editData.shippingAddress.address}
                            onChange={handleShippingChange}
                            className="form-input"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="city">City</label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={editData.shippingAddress.city}
                            onChange={handleShippingChange}
                            className="form-input"
                            required
                          />
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="postalCode">Postal Code</label>
                          <input
                            type="text"
                            id="postalCode"
                            name="postalCode"
                            value={editData.shippingAddress.postalCode}
                            onChange={handleShippingChange}
                            className="form-input"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="country">Country</label>
                          <input
                            type="text"
                            id="country"
                            name="country"
                            value={editData.shippingAddress.country}
                            onChange={handleShippingChange}
                            className="form-input"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="address-display">
                      <p>{subscription.shippingAddress.address}</p>
                      <p>{subscription.shippingAddress.city}, {subscription.shippingAddress.postalCode}</p>
                      <p>{subscription.shippingAddress.country}</p>
                    </div>
                  )}
                </div>
                
                {/* Delivery History */}
                {!editing && subscription.history && subscription.history.length > 0 && (
                  <div className="detail-section">
                    <h3>Delivery History</h3>
                    <div className="history-list">
                      {subscription.history.map((delivery, index) => (
                        <div key={index} className="history-item">
                          <div className="history-date">
                            {formatDate(delivery.deliveryDate)}
                          </div>
                          <div className="history-status">
                            Status: {delivery.status}
                          </div>
                          {delivery.orderId && (
                            <Link to={`/order/${delivery.orderId}`} className="view-order-link">
                              View Order
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Edit Buttons */}
                <div className="form-actions">
                  {editing ? (
                    <>
                      <button
                        onClick={() => setEditing(false)}
                        className="cancel-button"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="save-button"
                      >
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditing(true)}
                      className="edit-button"
                      disabled={subscription.status !== 'active'}
                    >
                      Edit Subscription
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="subscription-sidebar">
            <div className="bento-card price-summary-card">
              <div className="card-header">
                <h2>Price Summary</h2>
              </div>
              <div className="card-content">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${subscription.price ? subscription.price.basePrice.toFixed(2) : '0.00'}</span>
                </div>
                <div className="summary-row discount">
                  <span>Subscription Discount:</span>
                  <span>-${subscription.price ? subscription.price.discount.toFixed(2) : '0.00'}</span>
                </div>
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>${subscription.price ? subscription.price.tax.toFixed(2) : '0.00'}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>
                    {subscription.price && subscription.price.shipping > 0 
                      ? `$${subscription.price.shipping.toFixed(2)}` 
                      : 'FREE'}
                  </span>
                </div>
                <div className="summary-total">
                  <span>Total per delivery:</span>
                  <span>${subscription.price ? subscription.price.total.toFixed(2) : '0.00'}</span>
                </div>
              </div>
            </div>
            
            <div className="bento-card subscription-actions-card">
              <div className="card-header">
                <h2>Subscription Actions</h2>
              </div>
              <div className="card-content">
                {subscription.status === 'active' && (
                  <div className="action-buttons">
                    <button className="pause-button">
                      Pause Subscription
                    </button>
                    
                    <button
                      className="cancel-subscription-button"
                      onClick={() => setShowCancelModal(true)}
                    >
                      Cancel Subscription
                    </button>
                  </div>
                )}
                
                {subscription.status === 'paused' && (
                  <button className="resume-button">
                    Resume Subscription
                  </button>
                )}
                
                {subscription.status === 'cancelled' && (
                  <div className="cancelled-message">
                    <p>This subscription has been cancelled</p>
                    <Link to="/subscriptions/create" className="new-subscription-button">
                      Create New Subscription
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bento-card help-card">
              <div className="card-header">
                <h2>Help & Support</h2>
              </div>
              <div className="card-content">
                <div className="help-links">
                  <button className="help-link">
                    Subscription FAQ
                  </button>
                  
                  <button className="help-link">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3>Cancel Subscription</h3>
            <p>
              Are you sure you want to cancel your "{subscription.name}" subscription? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                className="keep-button"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Subscription
              </button>
              <button
                className="confirm-cancel-button"
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