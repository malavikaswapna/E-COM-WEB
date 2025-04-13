// frontend/src/pages/OrderPage.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getOrderDetails, payOrder } from '../redux/slices/orderSlice';
import axios from 'axios';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';
import './OrderPage.css';

// Initialize Stripe - replace with your publishable key
const stripePromise = loadStripe('pk_test_51RCTVd4UqftcztGBKSEhcSlAxpdNsdcQKhoYiyUSerteZREmXedeXiOQi0Imi2m6LXDoLbQPdNh3IR3VjkGCEpdY00uMNrEGC1');

// Payment Form Component
const PaymentForm = ({ clientSecret, orderId, onSuccess }) => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setProcessing(true);
    
    try {
      // Confirm card payment
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      });
      
      if (error) {
        setError(`Payment failed: ${error.message}`);
        toast.error(`Payment failed: ${error.message}`);
        setProcessing(false);
      } else if (paymentIntent.status === 'succeeded') {
        // Update order payment status
        dispatch(
          payOrder({
            orderId,
            paymentResult: {
              id: paymentIntent.id,
              status: paymentIntent.status,
              update_time: new Date().toISOString(),
              email_address: paymentIntent.receipt_email
            }
          })
        );
        
        toast.success('Payment successful!');
        setProcessing(false);
        onSuccess();
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred during payment processing');
      setProcessing(false);
    }
  };
  
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
      
      <button
        type="submit"
        disabled={!stripe || processing}
        className="payment-submit-button"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

// Main Order Page Component
const OrderPage = () => {
  const { id: orderId } = useParams();
  const dispatch = useDispatch();
  
  const [clientSecret, setClientSecret] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const { order, loading, error } = useSelector((state) => state.order);
  const { userToken } = useSelector((state) => state.auth);
  
  useEffect(() => {
    dispatch(getOrderDetails(orderId));
  }, [dispatch, orderId]);
  
  useEffect(() => {
    // Get payment intent client secret
    if (order && !order.isPaid) {
      const getClientSecret = async () => {
        try {
          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userToken}`
            }
          };
          
          const { data } = await axios.post(
            `/api/payments/create-payment-intent`,
            { orderId },
            config
          );
          
          setClientSecret(data.clientSecret);
        } catch (error) {
          console.error('Error getting client secret:', error);
          toast.error('Could not initialize payment. Please try again.');
        }
    };
      
    getClientSecret();
  }
}, [order, orderId, userToken]);

const handlePaymentSuccess = () => {
  setPaymentSuccess(true);
  dispatch(getOrderDetails(orderId));
};

// Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not yet';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

if (loading) {
  return (
    <div className="order-page-container">
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading order details...</p>
      </div>
    </div>
  );
}

if (error) {
  return (
    <div className="order-page-container">
      <div className="error-container">
        <div className="error-icon">❌</div>
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/profile" className="back-button">Back to Profile</Link>
      </div>
    </div>
  );
}

if (!order) {
  return (
    <div className="order-page-container">
      <div className="error-container">
        <div className="error-icon">🔍</div>
        <h2>Order Not Found</h2>
        <p>The order you're looking for may have been removed or doesn't exist.</p>
        <Link to="/profile" className="back-button">Back to Profile</Link>
      </div>
    </div>
  );
}

return (
  <div className="order-page-container">
    <div className="order-header">
      <h1>Order Details ✨</h1>
      <p>Order #{order._id}</p>
      <div className="order-date">Placed on {formatDate(order.createdAt)}</div>
    </div>
    
    <div className="order-content">
      <div className="order-grid">
        <div className="order-details-column">
          <div className="bento-card shipping-info-card">
            <div className="card-header">
              <h2>Shipping</h2>
            </div>
            <div className="card-content">
              <div className="info-section">
                <p><strong>Name:</strong> {order.user?.name}</p>
                <p><strong>Email:</strong> {order.user?.email}</p>
                <p><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
              </div>
              
              <div className="status-badge-container">
                {order.isDelivered ? (
                  <div className="status-badge delivered">
                    Delivered on {formatDate(order.deliveredAt)}
                  </div>
                ) : (
                  <div className="status-badge pending">
                    Not Delivered
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bento-card payment-info-card">
            <div className="card-header">
              <h2>Payment</h2>
            </div>
            <div className="card-content">
              <div className="info-section">
                <p><strong>Method:</strong> {order.paymentMethod}</p>
              </div>
              
              <div className="status-badge-container">
                {order.isPaid ? (
                  <div className="status-badge delivered">
                    Paid on {formatDate(order.paidAt)}
                  </div>
                ) : (
                  <div className="status-badge pending">
                    Not Paid
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bento-card order-items-card">
            <div className="card-header">
              <h2>Order Items</h2>
            </div>
            <div className="card-content">
              <div className="order-items">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-image">
                      <img
                        src={item.image || '/images/placeholder-spice.jpg'}
                        alt={item.name}
                      />
                    </div>
                    
                    <div className="item-details">
                      <Link to={`/products/${item.product}`} className="item-name">
                        {item.name}
                      </Link>
                    </div>
                    
                    <div className="item-quantity">
                      {item.qty} {item.unit} x ${item.price.toFixed(2)}
                    </div>
                    
                    <div className="item-price">
                      ${(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="order-summary-column">
          <div className="bento-card order-summary-card">
            <div className="card-header">
              <h2>Order Summary</h2>
            </div>
            <div className="card-content">
              <div className="summary-row">
                <span>Items</span>
                <span>${order.itemsPrice?.toFixed(2) || (order.totalPrice - order.shippingPrice - order.taxPrice).toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span>${order.shippingPrice.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Tax</span>
                <span>${order.taxPrice.toFixed(2)}</span>
              </div>
              
              <div className="summary-total">
                <span>Total</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
              
              {/* Payment Section */}
              {!order.isPaid && order.paymentMethod === 'Stripe' && clientSecret && !paymentSuccess && (
                <div className="payment-section">
                  <h3>Complete Payment</h3>
                  <Elements stripe={stripePromise}>
                    <PaymentForm 
                      clientSecret={clientSecret} 
                      orderId={order._id}
                      onSuccess={handlePaymentSuccess} 
                    />
                  </Elements>
                </div>
              )}
              
              {paymentSuccess && (
                <div className="payment-success">
                  Payment successful! Thank you for your order.
                </div>
              )}
              
              {order.isPaid && (
                <div className="payment-complete">
                  Payment completed on {formatDate(order.paidAt)}
                </div>
              )}
            </div>
          </div>
          
          <div className="bento-card order-actions-card">
            <div className="card-content">
              <Link to="/profile" className="back-to-profile">
                Back to Profile
              </Link>
              
              <Link to="/products" className="continue-shopping">
                Continue Shopping
              </Link>
            </div>
          </div>
          
          <div className="bento-card need-help-card">
            <div className="card-header">
              <h2>Need Help?</h2>
            </div>
            <div className="card-content">
              <p>If you have questions about your order, our customer support team is ready to assist you!</p>
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

export default OrderPage;