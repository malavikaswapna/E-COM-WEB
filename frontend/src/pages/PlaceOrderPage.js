// frontend/src/pages/PlaceOrderPage.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder, resetOrder } from '../redux/slices/orderSlice';
import { clearCart, getCartTotals } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';

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
      toast.success('Order placed successfully!');
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
        itemsPrice: cart.itemsPrice || 0,
        shippingPrice: cart.shippingPrice || 0,
        taxPrice: cart.taxPrice || 0,
        totalPrice: parseFloat(cart.totalPrice) || 0
      })
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        
        <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
          <div className="flex space-x-8">
            <div className="flex items-center">
              <div className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-2">1</div>
              <span>Shipping</span>
            </div>
            <div className="flex items-center">
              <div className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-2">2</div>
              <span>Payment</span>
            </div>
            <div className="flex items-center">
              <div className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-2">3</div>
              <span className="font-semibold">Place Order</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Shipping</h2>
              <p className="mt-2 text-gray-600">
                <strong>Address:</strong> {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
                {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
              </p>
            </div>
            
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Payment Method</h2>
              <p className="mt-2 text-gray-600">
                <strong>Method:</strong> {cart.paymentMethod}
              </p>
            </div>
            
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              
              {cart.cartItems.length === 0 ? (
                <div className="text-center py-4">
                  Your cart is empty{' '}
                  <Link to="/products" className="text-green-600 hover:underline">
                    Go Back
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.cartItems.map((item, index) => (
                    <div key={index} className="flex items-center py-2 border-b last:border-b-0">
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={item.image || '/images/placeholder-spice.jpg'}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      
                      <div className="ml-4 flex-grow">
                        <Link
                          to={`/products/${item.product}`}
                          className="text-lg font-medium hover:text-green-600"
                        >
                          {item.name}
                        </Link>
                      </div>
                      
                      <div className="text-right">
                        {item.qty} {item.unit} x ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>${cart.itemsPrice?.toFixed(2) || '0.00'}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${cart.shippingPrice?.toFixed(2) || '0.00'}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${cart.taxPrice?.toFixed(2) || '0.00'}</span>
              </div>
              
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total:</span>
                <span>${cart.totalPrice || '0.00'}</span>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <button
              type="button"
              className={`w-full py-2 px-4 rounded-lg text-white ${
                cart.cartItems.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
              disabled={cart.cartItems.length === 0 || loading}
              onClick={placeOrderHandler}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Place Order'
              )}
            </button>
            
            <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded text-sm">
              <p className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                After placing your order, you'll be redirected to complete payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;