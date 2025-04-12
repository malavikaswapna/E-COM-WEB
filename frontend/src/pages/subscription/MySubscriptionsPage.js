// frontend/src/pages/subscription/MySubscriptionsPage.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserSubscriptions } from '../../redux/slices/subscriptionSlice';
import { toast } from 'react-toastify';

const MySubscriptionsPage = () => {
  const dispatch = useDispatch();
  const { subscriptions, loading, error } = useSelector((state) => state.subscriptions);

  useEffect(() => {
    dispatch(getUserSubscriptions());
  }, [dispatch]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Calculate next billing amount
  const calculateBillingAmount = (subscription) => {
    if (!subscription || !subscription.price) return '$0.00';
    return `$${subscription.price.total.toFixed(2)}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Subscriptions</h1>
        <Link 
          to="/subscriptions/create" 
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Create New Subscription
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your subscriptions...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-5xl text-gray-300 mb-4">📦</div>
          <h2 className="text-xl font-semibold mb-2">No Subscriptions Yet</h2>
          <p className="text-gray-600 mb-6">
            Create a subscription to have your favorite spices and teas delivered regularly at a discounted price.
          </p>
          <Link 
            to="/subscriptions/create" 
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors inline-block"
          >
            Start a Subscription
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((subscription) => (
            <div key={subscription._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Subscription Header */}
              <div className="p-4 bg-gray-50 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">{subscription.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    subscription.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : subscription.status === 'paused'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                  </span>
                </div>
              </div>
              
              {/* Subscription Content */}
              <div className="p-4">
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-1">Next Delivery:</div>
                  <div className="font-medium">{formatDate(subscription.nextDeliveryDate)}</div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-1">Frequency:</div>
                  <div className="font-medium">
                    {subscription.frequency.charAt(0).toUpperCase() + subscription.frequency.slice(1)}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-1">Amount:</div>
                  <div className="font-medium">{calculateBillingAmount(subscription)}</div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-1">Products:</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {subscription.products.map((item, index) => (
                      <div key={index} className="bg-gray-100 rounded-lg p-2 flex items-center">
                        <div className="w-8 h-8 rounded overflow-hidden">
                          {item.product && item.product.images && item.product.images.length > 0 ? (
                            <img 
                              src={item.product.images[0]} 
                              alt={item.product.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs text-gray-500">
                              No img
                            </div>
                          )}
                        </div>
                        <div className="ml-2 text-sm">
                          <span className="font-medium">
                            {item.product ? item.product.name : 'Product'}
                          </span>
                          <span className="text-gray-500 ml-1">× {item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Subscription Actions */}
              <div className="p-4 bg-gray-50 border-t">
                <div className="flex space-x-2">
                  <Link 
                    to={`/subscriptions/${subscription._id}`} 
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded text-center hover:bg-green-700 transition-colors"
                  >
                    Manage
                  </Link>
                  
                  {subscription.status === 'active' ? (
                    <button 
                      className="bg-yellow-100 text-yellow-800 border border-yellow-200 py-2 px-4 rounded hover:bg-yellow-200 transition-colors"
                      onClick={() => {
                        toast.info("This feature would allow you to pause the subscription");
                      }}
                    >
                      Pause
                    </button>
                  ) : subscription.status === 'paused' ? (
                    <button 
                      className="bg-green-100 text-green-800 border border-green-200 py-2 px-4 rounded hover:bg-green-200 transition-colors"
                      onClick={() => {
                        toast.info("This feature would allow you to resume the subscription");
                      }}
                    >
                      Resume
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Benefits Banner */}
      {subscriptions.length > 0 && (
        <div className="mt-10 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-green-800">Subscription Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start">
              <div className="bg-white p-2 rounded-full mr-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Save 10%</h3>
                <p className="text-sm text-gray-600">
                  Automatically enjoy a 10% discount on all subscription products
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white p-2 rounded-full mr-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Free Shipping</h3>
                <p className="text-sm text-gray-600">
                  All subscription orders ship for free, no minimum required
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-white p-2 rounded-full mr-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Freshness Guarantee</h3>
                <p className="text-sm text-gray-600">
                  Products delivered at peak freshness, guaranteed
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MySubscriptionsPage;