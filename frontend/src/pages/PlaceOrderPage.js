// frontend/src/pages/PlaceOrderPage.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder, resetOrder } from '../redux/slices/orderSlice';
import { clearCart, getCartTotals } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import './PlaceOrderPage.css';

const PlaceOrderPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const cart = useSelector((state) => state.cart);
  const { order, success, error, loading } = useSelector((state) => state.order);
  
  // Calculate prices if not already calculated
  useEffect(() => {
    if (!cart.itemsPrice) {
      dispatch(getCartTotals());
    }
  }, [cart, dispatch]);
  
  useEffect(() => {
    if (success && order) {
      navigate(`/order/${order._id}`);
      dispatch(resetOrder());
      dispatch(clearCart());
      toast.success('Order placed successfully! Please complete payment in the next step.');
    }
  }, [success, navigate, order, dispatch]);

    // Check if shipping address is available
    useEffect(() => {
      if (!cart.shippingAddress.address) {
        navigate('/shipping');
      } else if (!cart.paymentMethod) {
        navigate('/payment');
      }
    }, [cart.shippingAddress, cart.paymentMethod, navigate]);
  
  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        paymentDetails: cart.paymentDetails,
        itemsPrice: cart.itemsPrice || 0,
        shippingPrice: cart.shippingPrice || 0,
        taxPrice: cart.taxPrice || 0,
        totalPrice: parseFloat(cart.totalPrice) || 0
      })
    );
  };
  
  return (
    <div className="place-order-container">
      <div className="place-order-header">
        <h1>Review Your Order ✨</h1>
        <p>Please confirm your order details before placing</p>
      </div>
      
      <div className="checkout-steps">
        <div className="step completed">
          <div className="step-number">1</div>
          <div className="step-label">Shipping</div>
        </div>
        <div className="step-connector completed"></div>
        <div className="step completed">
          <div className="step-number">2</div>
          <div className="step-label">Payment</div>
        </div>
        <div className="step-connector completed"></div>
        <div className="step active">
          <div className="step-number">3</div>
          <div className="step-label">Place Order</div>
        </div>
      </div>
      
      <div className="place-order-content">
        <div className="place-order-grid">
          <div className="order-details-column">
            <div className="bento-card shipping-info-card">
              <div className="card-header">
                <h2>Shipping</h2>
              </div>
              <div className="card-content">
                <p><strong>Address:</strong> {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
                  {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}</p>
                <Link to="/shipping" className="edit-link">Edit</Link>
              </div>
            </div>
            
            <div className="bento-card payment-info-card">
              <div className="card-header">
              <h2>Payment</h2>
              </div>
              <div className="card-content">
                <p><strong>Method:</strong> {cart.paymentMethod}</p>
                <p className="payment-status">
                  {cart.paymentDetails?.id ? 
                    <span className="payment-verified">✓ Payment information verified</span> : 
                    <span>Payment will be completed after order placement</span>
                  }
                </p>
                <Link to="/payment" className="edit-link">Edit</Link>
              </div>
            </div>
            
            <div className="bento-card order-items-card">
              <div className="card-header">
                <h2>Order Items</h2>
              </div>
              <div className="card-content">
                {cart.cartItems.length === 0 ? (
                  <div className="empty-cart-message">
                    Your cart is empty{' '}
                    <Link to="/products" className="browse-link">
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="order-items">
                    {cart.cartItems.map((item, index) => (
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
                          {item.qty} {item.unit}
                        </div>
                        
                        <div className="item-price">
                          ${(item.qty * item.price).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                  <span>${cart.itemsPrice?.toFixed(2) || '0.00'}</span>
                </div>
                
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>${cart.shippingPrice?.toFixed(2) || '0.00'}</span>
                </div>
                
                <div className="summary-row">
                  <span>Tax</span>
                  <span>${cart.taxPrice?.toFixed(2) || '0.00'}</span>
                </div>
                
                <div className="summary-total">
                  <span>Total</span>
                  <span>${cart.totalPrice || '0.00'}</span>
                </div>
                
                {error && (
                  <div className="order-error">
                    {error}
                  </div>
                )}
                
                <button
                  type="button"
                  className="place-order-button"
                  disabled={cart.cartItems.length === 0 || loading}
                  onClick={placeOrderHandler}
                >
                  {loading ? (
                    <div className="loading-indicator">
                      <div className="spinner"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            </div>
            
            <div className="bento-card order-note-card">
              <div className="card-content">
                <div className="info-icon">ℹ️</div>
                <h3>Important Information</h3>
                <p>By placing your order, you agree to our terms and conditions and privacy policy. We'll send a confirmation email once your order ships.</p>
              </div>
            </div>
            
            <div className="bento-card need-help-card">
              <div className="card-header">
                <h2>Need Help?</h2>
              </div>
              <div className="card-content">
                <p>Our customer support team is available to assist you with any questions about your order.</p>
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

export default PlaceOrderPage;