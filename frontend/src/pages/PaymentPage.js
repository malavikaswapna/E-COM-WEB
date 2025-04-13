// frontend/src/pages/PaymentPage.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../redux/slices/cartSlice';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from '../config/stripeConfig';
import { toast } from 'react-toastify';
import './PaymentPage.css';

const PaymentPage = () => {
  const { shippingAddress } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] = useState('Stripe');

  // Redirect to shipping if no shipping address
  if (!shippingAddress.address) {
    navigate('/shipping');
    return null;
  }
  
  const handleContinue = () => {
    if (paymentMethod === 'Stripe') {
      // If Stripe is selected, save method and continue to place order
      dispatch(savePaymentMethod(paymentMethod));
      toast.success('Payment method selected: Credit Card');
      navigate('/placeorder');
    } else if (paymentMethod === 'PayPal') {
      // For PayPal, we'll just save the method and navigate
      dispatch(savePaymentMethod(paymentMethod));
      toast.success('Payment method selected: PayPal');
      navigate('/placeorder');
    }
  };

  return (
    <div className="payment-page-container">
      <div className="payment-header">
        <h1>Payment Method ✨</h1>
        <p>Choose how you'd like to pay for your order</p>
      </div>
      
      <div className="checkout-steps">
        <div className="step completed">
          <div className="step-number">1</div>
          <div className="step-label">Shipping</div>
        </div>
        <div className="step-connector completed"></div>
        <div className="step active">
          <div className="step-number">2</div>
          <div className="step-label">Payment</div>
        </div>
        <div className="step-connector"></div>
        <div className="step">
          <div className="step-number">3</div>
          <div className="step-label">Place Order</div>
        </div>
      </div>
      
      <div className="payment-content">
        <div className="payment-grid">
          <div className="bento-card payment-methods-card">
            <div className="card-header">
              <h2>Select Payment Method</h2>
              <p>Choose your preferred payment option</p>
            </div>
            
            <div className="payment-methods">
              <div 
                className={`payment-method-option ${paymentMethod === 'Stripe' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('Stripe')}
              >
                <div className="payment-icon">💳</div>
                <div className="payment-details">
                  <h3>Credit Card</h3>
                  <p>Pay securely with your credit card via Stripe</p>
                </div>
                <div className="payment-radio">
                  <div className={`radio-circle ${paymentMethod === 'Stripe' ? 'checked' : ''}`}>
                    {paymentMethod === 'Stripe' && <div className="radio-dot"></div>}
                  </div>
                </div>
              </div>
              
              <div 
                className={`payment-method-option ${paymentMethod === 'PayPal' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('PayPal')}
              >
                <div className="payment-icon">💵</div>
                <div className="payment-details">
                  <h3>PayPal</h3>
                  <p>Pay using your PayPal account</p>
                </div>
                <div className="payment-radio">
                  <div className={`radio-circle ${paymentMethod === 'PayPal' ? 'checked' : ''}`}>
                    {paymentMethod === 'PayPal' && <div className="radio-dot"></div>}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="payment-actions">
              <button
                onClick={() => navigate('/shipping')}
                className="back-button"
              >
                Back to Shipping
              </button>
              
              <button
                onClick={handleContinue}
                className="continue-button"
              >
                Continue to Place Order
              </button>
            </div>
          </div>
          
          <div className="payment-sidebar">
            <div className="bento-card shipping-summary-card">
              <div className="card-header">
                <h2>Shipping Address</h2>
              </div>
              <div className="shipping-summary">
                <p className="summary-address">{shippingAddress.address}</p>
                <p className="summary-city-state">
                  {shippingAddress.city}, {shippingAddress.postalCode}
                </p>
                <p className="summary-country">{shippingAddress.country}</p>
                <button 
                  onClick={() => navigate('/shipping')}
                  className="edit-button"
                >
                  Edit
                </button>
              </div>
            </div>
            
            <div className="bento-card secure-payment-card">
              <div className="secure-payment-content">
                <div className="secure-icon">🔒</div>
                <h3>Secure Payment</h3>
                <p>Your payment information is encrypted and secure. We never store your full credit card details.</p>
              </div>
            </div>
            
            <div className="bento-card payment-help-card">
              <div className="card-header">
                <h2>Need Help?</h2>
              </div>
              <div className="help-content">
                <p>If you're having trouble with payment, our customer support team is ready to assist you!</p>
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

export default PaymentPage;