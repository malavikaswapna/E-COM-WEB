// frontend/src/pages/PaymentPage.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../redux/slices/cartSlice';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from '../config/stripeConfig';
import { toast } from 'react-toastify';

// Payment method selection component
const PaymentMethodSelector = ({ paymentMethod, setPaymentMethod, handleContinue }) => {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Select Payment Method</h2>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-4 text-lg font-medium">
          Available Methods
        </label>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="stripe"
              name="paymentMethod"
              type="radio"
              value="Stripe"
              className="h-4 w-4 text-green-600 focus:ring-green-500"
              checked={paymentMethod === 'Stripe'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="stripe" className="ml-3 block text-gray-700">
              Credit Card (Stripe)
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="paypal"
              name="paymentMethod"
              type="radio"
              value="PayPal"
              className="h-4 w-4 text-green-600 focus:ring-green-500"
              checked={paymentMethod === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="paypal" className="ml-3 block text-gray-700">
              PayPal
            </label>
          </div>
        </div>
      </div>
      
      <button
        type="button"
        onClick={handleContinue}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
      >
        Continue
      </button>
    </div>
  );
};

const PaymentPage = () => {
  const { shippingAddress } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [paymentMethod, setPaymentMethod] = useState('Stripe');
  const [showMethodSelector, setShowMethodSelector] = useState(true);
  
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
      // (In a real app, you would integrate PayPal SDK here)
      dispatch(savePaymentMethod(paymentMethod));
      toast.success('Payment method selected: PayPal');
      navigate('/placeorder');
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
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
                <span className="font-semibold">Payment</span>
              </div>
              <div className="flex items-center">
                <div className="bg-gray-300 text-gray-600 w-6 h-6 rounded-full flex items-center justify-center mr-2">3</div>
                <span>Place Order</span>
              </div>
            </div>
          </div>
        </div>
        
        {showMethodSelector && (
          <PaymentMethodSelector 
            paymentMethod={paymentMethod} 
            setPaymentMethod={setPaymentMethod} 
            handleContinue={handleContinue}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentPage;