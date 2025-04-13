// frontend/src/pages/CartPage.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateCartItemQuantity, getCartTotals } from '../redux/slices/cartSlice';
import './CartPage.css';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } = useSelector((state) => state.cart);
  
  // Calculate totals whenever cart items change
  useEffect(() => {
    dispatch(getCartTotals());
  }, [cartItems, dispatch]);
  
  const removeFromCartHandler = (id) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      dispatch(removeFromCart(id));
    }
  };
  
  const checkoutHandler = () => {
    navigate('/shipping');
  };
  
  const updateQuantityHandler = (id, quantity) => {
    dispatch(updateCartItemQuantity({ id, quantity }));
  };
  
  return (
    <div className="cart-page-container">
      <div className="cart-header">
        <h1>Your Magical Cart ✨</h1>
        <p>Review your items before checkout</p>
      </div>
      
      <div className="cart-content">
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any products to your cart yet.</p>
            <Link to="/products" className="continue-shopping-button">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="cart-grid">
            <div className="cart-items-container">
              <div className="bento-card">
                <div className="card-header">
                  <h2>Shopping Cart ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</h2>
                </div>
                
                <div className="cart-items">
                  {cartItems.map((item) => (
                    <div key={item.product} className="cart-item">
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
                        <p className="item-price">${item.price.toFixed(2)} / {item.unit}</p>
                        
                        <div className="item-actions">
                          <div className="quantity-selector">
                            <button
                              onClick={() => updateQuantityHandler(item.product, Math.max(1, item.qty - 1))}
                              className="quantity-button"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            
                            <span className="quantity-value">{item.qty}</span>
                            
                            <button
                              onClick={() => updateQuantityHandler(item.product, Math.min(item.stock, item.qty + 1))}
                              className="quantity-button"
                              aria-label="Increase quantity"
                              disabled={item.qty >= item.stock}
                            >
                              +
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeFromCartHandler(item.product)}
                            className="remove-button"
                            aria-label="Remove item"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      
                      <div className="item-total">
                        ${(item.price * item.qty).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="cart-footer">
                  <Link to="/products" className="continue-link">
                    <span>←</span> Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="cart-summary-container">
              <div className="bento-card">
                <div className="card-header">
                  <h2>Order Summary</h2>
                </div>
                
                <div className="summary-content">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${itemsPrice?.toFixed(2) || '0.00'}</span>
                  </div>
                  
                  <div className="summary-row">
                    <span>Shipping</span>
                    {shippingPrice === 0 ? (
                      <span className="free-shipping">FREE</span>
                    ) : (
                      <span>${shippingPrice?.toFixed(2) || '0.00'}</span>
                    )}
                  </div>
                  
                  <div className="summary-row">
                    <span>Tax</span>
                    <span>${taxPrice?.toFixed(2) || '0.00'}</span>
                  </div>
                  
                  <div className="summary-total">
                    <span>Total</span>
                    <span>${totalPrice || '0.00'}</span>
                  </div>
                  
                  <button
                    onClick={checkoutHandler}
                    className="checkout-button"
                    disabled={cartItems.length === 0}
                  >
                    Proceed to Checkout
                  </button>
                  
                  {shippingPrice > 0 && (
                    <div className="shipping-note">
                      Add ${(100 - itemsPrice).toFixed(2)} more to qualify for FREE shipping
                    </div>
                  )}
                  
                  {shippingPrice === 0 && (
                    <div className="shipping-success">
                      ✓ Your order qualifies for FREE shipping!
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bento-card payment-methods">
                <div className="payment-icons">
                  <span className="payment-icon">💳</span>
                  <span className="payment-icon">💵</span>
                  <span className="payment-icon">💰</span>
                </div>
                <p>We accept credit cards, PayPal, and more</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default CartPage;