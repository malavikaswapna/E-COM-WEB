// frontend/src/pages/OrderPage.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getOrderDetails, payOrder } from '../redux/slices/orderSlice';
import axios from 'axios';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';

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
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Card Details</label>
        <div className="p-3 border rounded-md bg-white">
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
        <p className="text-sm text-gray-500 mt-1">Test card: 4242 4242 4242 4242, any future date, any CVC</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full py-2 px-4 rounded-lg text-white ${
          !stripe || processing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
        }`}
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

if (loading) {
  return <div className="text-center py-10">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
      <p className="mt-2 text-gray-600">Loading order details...</p>
    </div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        <p className="text-2xl mb-2">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-10">
        <p className="text-2xl mb-2">Order Not Found</p>
        <p className="text-gray-600">The order you're looking for may have been removed or doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Order {order._id}</h1>
      <p className="text-gray-600 mb-8">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Shipping</h2>
              <p className="mt-2 text-gray-600">
                <strong>Name:</strong> {order.user?.name}
              </p>
              <p className="text-gray-600">
                <strong>Email:</strong> {order.user?.email}
              </p>
              <p className="text-gray-600">
                <strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
              
              {order.isDelivered ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-3">
                  Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                </div>
              ) : (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mt-3">
                  Not Delivered
                </div>
              )}
            </div>
            
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Payment Method</h2>
              <p className="mt-2 text-gray-600">
                <strong>Method:</strong> {order.paymentMethod}
              </p>
              
              {order.isPaid ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-3">
                  Paid on {new Date(order.paidAt).toLocaleDateString()}
                </div>
              ) : (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mt-3">
                  Not Paid
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
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
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>${order.itemsPrice?.toFixed(2) || (order.totalPrice - order.shippingPrice - order.taxPrice).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${order.shippingPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${order.taxPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total:</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Payment Section */}
            {!order.isPaid && order.paymentMethod === 'Stripe' && clientSecret && !paymentSuccess && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Complete Payment</h3>
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
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-6">
                Payment successful! Thank you for your order.
              </div>
            )}
            
            {order.isPaid && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                Payment completed on {new Date(order.paidAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;