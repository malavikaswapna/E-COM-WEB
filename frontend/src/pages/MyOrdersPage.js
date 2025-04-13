// frontend/src/pages/MyOrdersPage.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { listMyOrders } from '../redux/slices/orderSlice';
import './MyOrdersPage.css';

const MyOrdersPage = () => {
  const dispatch = useDispatch();
  
  const { loading, error, orders } = useSelector((state) => state.order);
  
  useEffect(() => {
    dispatch(listMyOrders());
  }, [dispatch]);
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Get shortened order ID
  const getShortOrderId = (orderId) => {
    return orderId.substring(0, 8);
  };
  
  return (
    <div className="my-orders-container">
      <div className="my-orders-header">
        <h1>Order History</h1>
        <p>View your past orders</p>
      </div>
      
      <div className="my-orders-content">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>Error: {error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-orders">
            <p>You haven't placed any orders yet.</p>
            <Link to="/products" className="shop-button">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-id-date">
                    <h3 className="order-id">Order #{getShortOrderId(order._id)}</h3>
                    <p className="order-date">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="order-status">
                    {order.isPaid ? (
                      order.isDelivered ? (
                        <span className="status delivered">Delivered</span>
                      ) : (
                        <span className="status processing">Processing</span>
                      )
                    ) : (
                      <span className="status pending">Pending</span>
                    )}
                  </div>
                </div>
                
                <div className="order-items">
                  {order.orderItems.map((item) => (
                    <div key={item._id || item.product} className="order-item">
                      <div className="item-name">{item.name}</div>
                      <div className="item-quantity">{item.qty} × ${item.price.toFixed(2)}</div>
                    </div>
                  ))}
                  {order.orderItems.length > 3 && (
                    <div className="more-items">
                      + {order.orderItems.length - 3} more items
                    </div>
                  )}
                </div>
                
                <div className="order-footer">
                  <div className="order-total">
                    Total: ${order.totalPrice.toFixed(2)}
                  </div>
                  <Link to={`/order/${order._id}`} className="view-details-button">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;