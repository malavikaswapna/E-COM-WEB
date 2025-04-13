import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ProfilePage.css';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [flavorPreferences, setFlavorPreferences] = useState({
    likedFlavors: [],
    dislikedFlavors: [],
    preferredIntensity: 3
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { userInfo, userToken, loading } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.order);
  
  useEffect(() => {
    // Redirect if not logged in
    if (!userToken) {
      navigate('/login');
      return;
    }
    
    // Fetch user profile if not already loaded
    if (!userInfo) {
      dispatch(getUserProfile());
    } else {
      // Fill form fields with user data
      setName(userInfo.name || '');
      if (userInfo.flavorPreferences) {
        setFlavorPreferences({
          likedFlavors: userInfo.flavorPreferences.likedFlavors || [],
          dislikedFlavors: userInfo.flavorPreferences.dislikedFlavors || [],
          preferredIntensity: userInfo.flavorPreferences.preferredIntensity || 3
        });
      }
    }
  }, [dispatch, navigate, userToken, userInfo]);
  
  const handleFlavorChange = (e, type) => {
    const value = e.target.value;
    
    if (e.target.checked) {
      // Add to array if checked
      setFlavorPreferences({
        ...flavorPreferences,
        [type]: [...flavorPreferences[type], value]
      });
    } else {
      // Remove from array if unchecked
      setFlavorPreferences({
        ...flavorPreferences,
        [type]: flavorPreferences[type].filter(item => item !== value)
      });
    }
  };
  
  const handleIntensityChange = (e) => {
    setFlavorPreferences({
      ...flavorPreferences,
      preferredIntensity: Number(e.target.value)
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        }
      };
      
      // Make sure we're using the correct endpoint with proper API base URL
      await axios.patch(
        '/api/users/profile', 
        { 
          name,
          flavorPreferences
        },
        config
      );
      
      setMessage('Profile updated successfully');
      // Refresh user profile
      dispatch(getUserProfile());
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error.response?.data?.message || 'Error updating profile. Please try again.');
    }
  };
  
  const flavorOptions = [
    'Sweet', 'Spicy', 'Bitter', 'Sour', 'Umami',
    'Floral', 'Earthy', 'Fruity', 'Smoky', 'Herbal'
  ];
  
  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Your Magical Profile ✨</h1>
        <p>Manage your account and preferences</p>
      </div>
      
      <div className="profile-content">
        {/* Tab Navigation */}
        <div className="profile-tabs">
          <button 
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`} 
            onClick={() => setActiveTab('profile')}
          >
            My Profile
          </button>
          <button 
            className={`tab-button ${activeTab === 'preferences' ? 'active' : ''}`} 
            onClick={() => setActiveTab('preferences')}
          >
            Flavor Preferences
          </button>
          <button 
            className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`} 
            onClick={() => setActiveTab('orders')}
          >
            Order History
          </button>
          <button 
            className={`tab-button ${activeTab === 'addresses' ? 'active' : ''}`} 
            onClick={() => setActiveTab('addresses')}
          >
            Addresses
          </button>
        </div>
        
        {/* Main Content Area */}
        <div className="profile-main">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading your profile...</p>
            </div>
          ) : (
            <>
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="bento-card">
                  <div className="card-header">
                    <h2>Personal Information</h2>
                    <p>Update your basic information</p>
                  </div>
                  
                  {message && (
                    <div className="success-message">
                      {message}
                    </div>
                  )}
                  
                  {error && (
                    <div className="error-message">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        value={userInfo?.email || ''}
                        disabled
                        className="form-input disabled"
                      />
                      <p className="input-help">Email cannot be changed</p>
                    </div>
                    
                    <div className="form-actions">
                      <button
                        type="submit"
                        className="submit-button"
                      >
                        Update Profile
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Flavor Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="bento-card">
                  <div className="card-header">
                    <h2>Flavor Preferences</h2>
                    <p>Help us recommend products you'll love</p>
                  </div>
                  
                  {message && (
                    <div className="success-message">
                      {message}
                    </div>
                  )}
                  
                  {error && (
                    <div className="error-message">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <h3>Flavors You Enjoy</h3>
                      <div className="flavor-options">
                        {flavorOptions.map(flavor => (
                          <label key={`like-${flavor}`} className="flavor-option">
                            <input
                              type="checkbox"
                              checked={flavorPreferences.likedFlavors.includes(flavor)}
                              onChange={(e) => handleFlavorChange(e, 'likedFlavors')}
                              value={flavor}
                            />
                            <span>{flavor}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <h3>Flavors You Dislike</h3>
                      <div className="flavor-options">
                        {flavorOptions.map(flavor => (
                          <label key={`dislike-${flavor}`} className="flavor-option">
                            <input
                              type="checkbox"
                              checked={flavorPreferences.dislikedFlavors.includes(flavor)}
                              onChange={(e) => handleFlavorChange(e, 'dislikedFlavors')}
                              value={flavor}
                            />
                            <span>{flavor}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <h3>Preferred Intensity (1-5)</h3>
                      <div className="intensity-slider">
                        <span>Mild</span>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={flavorPreferences.preferredIntensity}
                          onChange={handleIntensityChange}
                          className="range-slider"
                        />
                        <span>Strong</span>
                      </div>
                      <div className="intensity-value">
                        Current: {flavorPreferences.preferredIntensity}
                      </div>
                    </div>
                    
                    <div className="form-actions">
                      <button
                        type="submit"
                        className="submit-button"
                      >
                        Save Preferences
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="bento-card">
                  <div className="card-header">
                    <h2>Order History</h2>
                    <p>View your past orders</p>
                  </div>
                  
                  <div className="orders-list">
                    {orders && orders.length > 0 ? (
                      orders.map(order => (
                        <div key={order._id} className="order-item">
                          <div className="order-header">
                            <div>
                              <h3>Order #{order._id.substring(0, 8)}</h3>
                              <p className="order-date">
                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            <div className="order-status">
                              {order.isDelivered ? (
                                <span className="status delivered">Delivered</span>
                              ) : order.isPaid ? (
                                <span className="status processing">Processing</span>
                              ) : (
                                <span className="status pending">Pending</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="order-items">
                            {order.orderItems.slice(0, 2).map((item, idx) => (
                              <div key={idx} className="order-product">
                                <div className="product-name">{item.name}</div>
                                <div className="product-qty">{item.qty} × ${item.price.toFixed(2)}</div>
                              </div>
                            ))}
                            {order.orderItems.length > 2 && (
                              <div className="more-items">
                                +{order.orderItems.length - 2} more items
                              </div>
                            )}
                          </div>
                          
                          <div className="order-footer">
                            <div className="order-total">
                              Total: ${order.totalPrice.toFixed(2)}
                            </div>
                            <button 
                              onClick={() => navigate(`/order/${order._id}`)}
                              className="view-order-button"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-orders">
                        <div className="empty-icon">📦</div>
                        <h3>No Orders Yet</h3>
                        <p>When you place orders, they'll appear here</p>
                        <button 
                          onClick={() => navigate('/products')}
                          className="shop-now-button"
                        >
                          Shop Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="bento-card">
                  <div className="card-header">
                    <h2>Saved Addresses</h2>
                    <p>Manage your shipping addresses</p>
                  </div>
                  
                  {userInfo && userInfo.shippingAddresses && userInfo.shippingAddresses.length > 0 ? (
                    <div className="addresses-list">
                      {userInfo.shippingAddresses.map((address, index) => (
                        <div key={index} className="address-card">
                          {address.isDefault && (
                            <div className="default-badge">Default</div>
                          )}
                          <h3>{address.name || 'Shipping Address'}</h3>
                          <p>{address.street}</p>
                          <p>{address.city}, {address.state} {address.zipCode}</p>
                          <p>{address.country}</p>
                          
                          <div className="address-actions">
                            <button className="edit-button">Edit</button>
                            {!address.isDefault && (
                              <button className="set-default-button">Set as Default</button>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      <div className="add-address-card">
                        <div className="add-icon">+</div>
                        <p>Add New Address</p>
                      </div>
                    </div>
                  ) : (
                    <div className="empty-addresses">
                      <div className="empty-icon">🏠</div>
                      <h3>No Saved Addresses</h3>
                      <p>Add an address for faster checkout</p>
                      <button className="add-address-button">
                        Add New Address
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;