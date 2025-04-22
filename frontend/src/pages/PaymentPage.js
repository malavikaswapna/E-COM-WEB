// frontend/src/pages/PaymentPage.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../redux/slices/cartSlice';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { toast } from 'react-toastify';
import './PaymentPage.css';

const stripePromise = loadStripe('pk_test_51RCTVd4UqftcztGBKSEhcSlAxpdNsdcQKhoYiyUSerteZREmXedeXiOQi0Imi2m6LXDoLbQPdNh3IR3VjkGCEpdY00uMNrEGC1');

// Stripe Payment Form Component
const StripePaymentForm = ({ onNext }) => {
  const [clientSecret, setClientSecret] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const { userToken } = useSelector((state) => state.auth);
  const { cartItems, totalPrice } = useSelector((state) => state.cart);
  
  // Get payment intent when component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        setProcessing(true);
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`
          }
        };
        
        const { data } = await axios.post(
          '/api/payments/create-intent',
          { amount: totalPrice },
          config
        );
        
        setClientSecret(data.clientSecret);
        setProcessing(false);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        toast.error('Could not initialize payment. Please try again.');
        setProcessing(false);
      }
    };
    
    if (totalPrice > 0) {
      createPaymentIntent();
    }
  }, [totalPrice, userToken]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setProcessing(true);
    
    try {
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      });
      
      if (error) {
        setError(`Payment failed: ${error.message}`);
        toast.error(`Payment failed: ${error.message}`);
        setProcessing(false);
        return;
      }
      
      if (paymentIntent.status === 'succeeded') {
        // Payment is complete and successful
        dispatch(savePaymentMethod({
          type: 'Stripe',
          id: paymentIntent.id,
          status: paymentIntent.status
        }));
        
        toast.success('Payment successful!');
        setProcessing(false);
        onNext();
      } else {
        // Payment is in another state (requires_action, etc.)
        setError(`Payment status: ${paymentIntent.status}. Please try again.`);
        toast.error('Payment was not completed. Please try again.');
        setProcessing(false);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred during payment processing');
      setProcessing(false);
    }
  };
  
  if (!clientSecret && processing) {
    return (
      <div className="payment-loading">
        <div className="spinner"></div>
        <p>Preparing payment form...</p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-group">
        <label className="form-label">Card Details</label>
        <div className="card-element-container">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4'
                  }
                },
                invalid: {
                  color: '#9e2146'
                }
              }
            }}
          />
        </div>
        <p className="form-note">Test card: 4242 4242 4242 4242, any future date, any CVC</p>
      </div>
      
      {error && (
        <div className="payment-error">
          {error}
        </div>
      )}
      
      <div className="form-actions">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="back-button"
        >
          Back
        </button>
        
        <button
          type="submit"
          disabled={!stripe || processing}
          className="payment-submit-button"
        >
          {processing ? 'Processing...' : 'Continue to Place Order'}
        </button>
      </div>
    </form>
  );
};

// PayPal Payment Component
const PayPalPayment = ({ onNext }) => {
  const dispatch = useDispatch();
  
  const handlePayPalContinue = () => {
    dispatch(savePaymentMethod({
      type: 'PayPal'
    }));
    toast.info('You will complete PayPal payment when placing your order');
    onNext();
  };
  
  return (
    <div className="paypal-container">
      <p>You'll be redirected to PayPal to complete payment in the next step.</p>
      <div className="form-actions">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="back-button"
        >
          Back
        </button>
        
        <button
          onClick={handlePayPalContinue}
          className="payment-submit-button"
        >
          Continue to Place Order
        </button>
      </div>
    </div>
  );
};

// Main Payment Page Component
const PaymentPage = () => {
  const { shippingAddress } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState('Stripe');
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Redirect to shipping if no shipping address
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);
  
  const handleContinue = () => {
    setShowPaymentForm(true);
  };
  
  const handlePaymentComplete = () => {
    navigate('/placeorder');
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
          {!showPaymentForm ? (
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
                  Continue
                </button>
              </div>
            </div>
          ) : (
            <div className="bento-card payment-form-card">
              <div className="card-header">
                <h2>
                  {paymentMethod === 'Stripe' 
                    ? 'Enter Card Details' 
                    : 'Continue with PayPal'}
                </h2>
              </div>
              
              <div className="payment-form-container">
                {paymentMethod === 'Stripe' ? (
                  <Elements stripe={stripePromise}>
                    <StripePaymentForm onNext={handlePaymentComplete} />
                  </Elements>
                ) : (
                  <PayPalPayment onNext={handlePaymentComplete} />
                )}
              </div>
            </div>
          )}
          
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