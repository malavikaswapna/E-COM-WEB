// frontend/src/pages/CartPage.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateCartItemQuantity, getCartTotals } from '../redux/slices/cartSlice';

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="mb-4">Your cart is empty</p>
          <Link
            to="/products"
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {cartItems.map((item) => (
                <div
                  key={item.product}
                  className="border-b last:border-b-0 p-4 flex items-center"
                >
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={item.image || '/images/placeholder-spice.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  
                  <div className="ml-4 flex-grow">
                    <Link
                      to={`/products/${item.product}`}
                      className="text-lg font-medium hover:text-green-600 transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                    
                    <div className="text-gray-600 text-sm">
                      ${item.price.toFixed(2)} / {item.unit}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <select
                      value={item.qty}
                      onChange={(e) =>
                        updateQuantityHandler(
                          item.product,
                          Number(e.target.value)
                        )
                      }
                      className="border rounded mr-4 p-1"
                    >
                      {[...Array(Math.min(10, item.stock)).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                    
                    <button
                      type="button"
                      onClick={() => removeFromCartHandler(item.product)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                      aria-label="Remove item"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)}):</span>
                  <span>${itemsPrice?.toFixed(2) || '0.00'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>${shippingPrice?.toFixed(2) || '0.00'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${taxPrice?.toFixed(2) || '0.00'}</span>
                </div>
                
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>${totalPrice || '0.00'}</span>
                </div>
              </div>
              
              <button
                type="button"
                onClick={checkoutHandler}
                disabled={cartItems.length === 0}
                className={`w-full py-2 px-4 rounded-lg text-white ${
                  cartItems.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 transition-colors duration-200'
                }`}
              >
                Proceed to Checkout
              </button>
              
              <div className="mt-4 text-center text-sm text-gray-500">
                {cartItems.length > 0 && shippingPrice === 0 && (
                  <p className="text-green-600">Your order qualifies for free shipping!</p>
                )}
                {cartItems.length > 0 && shippingPrice > 0 && (
                  <p>Add ${(100 - itemsPrice).toFixed(2)} more to qualify for free shipping</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CartPage;