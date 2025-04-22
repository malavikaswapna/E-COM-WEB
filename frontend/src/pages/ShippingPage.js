// frontend/src/pages/ShippingPage.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../redux/slices/cartSlice';
import './ShippingPage.css';

const ShippingPage = () => {
  const { shippingAddress } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveShippingAddress({
        address,
        city,
        postalCode,
        country,
        userId: user?._id,
      })
    );
    navigate('/payment');
  };
  
  return (
    <div className="shipping-page-container">
      <div className="shipping-header">
        <h1>Shipping Details ✨</h1>
        <p>Where shall we deliver your magical flavors?</p>
      </div>
      
      <div className="checkout-steps">
        <div className="step active">
          <div className="step-number">1</div>
          <div className="step-label">Shipping</div>
        </div>
        <div className="step-connector"></div>
        <div className="step">
          <div className="step-number">2</div>
          <div className="step-label">Payment</div>
        </div>
        <div className="step-connector"></div>
        <div className="step">
          <div className="step-number">3</div>
          <div className="step-label">Place Order</div>
        </div>
      </div>
      
      <div className="shipping-content">
        <div className="bento-grid">
          <div className="bento-card shipping-form-card">
            <div className="card-header">
              <h2>Shipping Address</h2>
              <p>Please enter your shipping information</p>
            </div>
            
            <form onSubmit={submitHandler} className="shipping-form">
              <div className="form-group">
                <label htmlFor="address">Street Address</label>
                <input
                  type="text"
                  id="address"
                  placeholder="Enter your street address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  placeholder="Enter city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  placeholder="Enter postal code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  placeholder="Enter country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="back-button"
                >
                  Back to Cart
                </button>
                <button
                  type="submit"
                  className="continue-button"
                >
                  Continue to Payment
                </button>
              </div>
            </form>
          </div>
          
          <div className="bento-card shipping-info-card">
            <div className="shipping-info">
              <div className="info-icon">🚚</div>
              <h3>Shipping Information</h3>
              <ul className="info-list">
                <li>Free shipping on orders over $75</li>
                <li>Standard delivery: 3-5 business days</li>
                <li>Express delivery: 1-2 business days (additional fee)</li>
                <li>International shipping available to select countries</li>
              </ul>
            </div>
          </div>
          
          <div className="bento-card save-address-card">
            <div className="save-address-content">
              <div className="info-icon">🏠</div>
              <h3>Save this address?</h3>
              <p>Create an account or sign in to save this address for future orders.</p>
              <div className="checkbox-wrapper">
                <label className="save-address-checkbox">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                  />
                  <span>Save this address for future orders</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="bento-card contact-info-card">
            <div className="card-header">
              <h2>Need Help?</h2>
            </div>
            <div className="contact-content">
              <p>If you have questions about shipping or delivery, our customer support team is here to help!</p>
              <p className="contact-detail">📧 support@spicetea.com</p>
              <p className="contact-detail">📞 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;