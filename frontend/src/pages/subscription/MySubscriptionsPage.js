// frontend/src/pages/subscription/MySubscriptionsPage.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserSubscriptions } from '../../redux/slices/subscriptionSlice';
import { toast } from 'react-toastify';
import './MySubscriptionsPage.css';

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

  const handlePauseSubscription = (id) => {
    toast.info("This feature would allow you to pause the subscription");
  };

  const handleResumeSubscription = (id) => {
    toast.info("This feature would allow you to resume the subscription");
  };

  return (
    <div className="subscriptions-container">
      <div className="subscriptions-header">
        <h1>Your Magical Subscriptions ✨</h1>
        <p>Manage your recurring flavor deliveries</p>
      </div>
      
      <div className="subscriptions-content">
        <div className="subscriptions-actions">
          <Link to="/subscriptions/create" className="create-button">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Create New Subscription
          </Link>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">❌</div>
            <p className="error-message">{error}</p>
            <button 
              onClick={() => dispatch(getUserSubscriptions())}
              className="retry-button"
            >
              Try Again
            </button>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="no-subscriptions">
            <div className="empty-icon">📦</div>
            <h2>No Subscriptions Yet</h2>
            <p>Create a subscription to have your favorite spices and teas delivered regularly at a discounted price.</p>
            <Link to="/subscriptions/create" className="start-button">
              Start a Subscription
            </Link>
          </div>
        ) : (
          <div className="subscriptions-grid">
            {subscriptions.map((subscription) => (
              <div key={subscription._id} className="subscription-card">
                <div className="subscription-header">
                  <h3 className="subscription-name">{subscription.name}</h3>
                  <span className={`subscription-status ${
                    subscription.status === 'active' 
                      ? 'status-active' 
                      : subscription.status === 'paused'
                        ? 'status-paused'
                        : 'status-cancelled'
                  }`}>
                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                  </span>
                </div>
                
                <div className="subscription-content">
                  <div className="subscription-detail">
                    <div className="detail-label">Next Delivery:</div>
                    <div className="detail-value">{formatDate(subscription.nextDeliveryDate)}</div>
                  </div>
                  
                  <div className="subscription-detail">
                    <div className="detail-label">Frequency:</div>
                    <div className="detail-value">
                      {subscription.frequency.charAt(0).toUpperCase() + subscription.frequency.slice(1)}
                    </div>
                  </div>
                  
                  <div className="subscription-products">
                    <div className="products-label">Products:</div>
                    <div className="product-chips">
                      {subscription.products.map((item, index) => (
                        <div key={index} className="product-chip">
                          {item.product && item.product.images && item.product.images.length > 0 ? (
                            <img 
                              src={item.product.images[0]} 
                              alt={item.product.name} 
                            />
                          ) : null}
                          <span>
                            {item.product ? item.product.name : 'Product'} × {item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {subscription.status === 'active' ? (
                    <div className="subscription-actions">
                      <button 
                        className="action-button pause-button"
                        onClick={() => handlePauseSubscription(subscription._id)}
                      >
                        Pause
                      </button>
                    </div>
                  ) : subscription.status === 'paused' ? (
                    <div className="subscription-actions">
                      <button 
                        className="action-button resume-button"
                        onClick={() => handleResumeSubscription(subscription._id)}
                      >
                        Resume
                      </button>
                    </div>
                  ) : null}
                </div>
                
                <div className="subscription-footer">
                  <div className="subscription-price">
                    {calculateBillingAmount(subscription)}
                    <span className="price-label">/delivery</span>
                  </div>
                  
                  <Link to={`/subscriptions/${subscription._id}`} className="manage-button">
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Benefits Banner */}
        {subscriptions.length > 0 && (
          <div className="benefits-section">
            <h2 className="benefits-title">Subscription Benefits</h2>
            <div className="benefits-grid">
              <div className="benefit-item">
                <div className="benefit-icon">💰</div>
                <h3 className="benefit-name">Save 10%</h3>
                <p className="benefit-description">
                  Automatically enjoy a 10% discount on all subscription products
                </p>
              </div>
              
              <div className="benefit-item">
                <div className="benefit-icon">🚚</div>
                <h3 className="benefit-name">Free Shipping</h3>
                <p className="benefit-description">
                  All subscription orders ship for free, no minimum required
                </p>
              </div>
              
              <div className="benefit-item">
                <div className="benefit-icon">⏰</div>
                <h3 className="benefit-name">Freshness Guarantee</h3>
                <p className="benefit-description">
                  Products delivered at peak freshness, guaranteed
                </p>
              </div>
              
              <div className="benefit-item">
                <div className="benefit-icon">🔄</div>
                <h3 className="benefit-name">Flexible Management</h3>
                <p className="benefit-description">
                  Easily pause, modify, or cancel your subscriptions anytime
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySubscriptionsPage;