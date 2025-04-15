// src/pages/admin/OrdersListPage.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './OrdersListPage.css';

const OrdersListPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState('');
  
  const { userInfo, userToken } = useSelector((state) => state.auth);
  
  // Move fetchOrders function outside of useEffect so it can be accessed from button click handlers
  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      };
      
      const { data } = await axios.get('/api/orders', config);
      
      // If a filter is active, apply it
      const filteredOrders = filterStatus 
        ? data.data.orders.filter(order => {
            if (filterStatus === 'paid') return order.isPaid;
            if (filterStatus === 'unpaid') return !order.isPaid;
            if (filterStatus === 'delivered') return order.isDelivered;
            if (filterStatus === 'undelivered') return !order.isDelivered;
            return true;
          })
        : data.data.orders;
        
      setOrders(filteredOrders);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Could not fetch orders');
      setLoading(false);
      toast.error('Failed to load orders');
    }
  };
  
  useEffect(() => {
    if (userInfo && userInfo.role === 'admin') {
      fetchOrders();
    }
  }, [userToken, userInfo, filterStatus]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Handle order status update (delivered status)
  const handleMarkAsDelivered = async (orderId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      };
      
      await axios.put(`/api/orders/${orderId}/deliver`, {}, config);
      
      // Update the local state
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, isDelivered: true, deliveredAt: new Date().toISOString() } 
          : order
      ));
      
      toast.success('Order marked as delivered');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order');
    }
  };
  
  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Format price
  const formatPrice = (price) => {
    return price ? `$${price.toFixed(2)}` : '$0.00';
  };
  
  if (userInfo && userInfo.role !== 'admin') {
    return (
      <div className="admin-container">
        <div className="admin-header">
          <h1>Access Denied</h1>
          <p>You don't have permission to view this page</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Orders Management ✨</h1>
        <p>Manage customer orders and delivery status</p>
      </div>
      
      <div className="admin-content">
        <div className="bento-card">
          <div className="card-header">
            <h2>Orders List</h2>
            
            <div className="filter-controls">
              <label htmlFor="filterStatus" className="filter-label">Filter by Status:</label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="">All Orders</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="delivered">Delivered</option>
                <option value="undelivered">Not Delivered</option>
              </select>
            </div>
          </div>
          
          <div className="card-content">
            {loading ? (
              <div className="loading-center">
                <LoadingSpinner size="large" color="purple" />
              </div>
            ) : error ? (
              <div className="error-container">
                <div className="error-icon">❌</div>
                <p className="error-message">{error}</p>
                <button 
                  onClick={() => fetchOrders()}
                  className="retry-button"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <div className="orders-table-container">
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Delivery</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentOrders.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="empty-message">No orders found</td>
                        </tr>
                      ) : (
                        currentOrders.map((order) => (
                          <tr key={order._id}>
                            <td className="order-id-cell">
                              {order._id.substring(0, 8)}...
                            </td>
                            <td>
                              {formatDate(order.createdAt)}
                            </td>
                            <td>
                              <div className="customer-info">
                                <span className="customer-name">{order.user?.name || 'N/A'}</span>
                                <span className="customer-email">{order.user?.email || 'N/A'}</span>
                              </div>
                            </td>
                            <td className="price-cell">
                              {formatPrice(order.totalPrice)}
                            </td>
                            <td>
                              {order.isPaid ? (
                                <span className="status-badge status-paid">
                                  Paid
                                </span>
                              ) : (
                                <span className="status-badge status-unpaid">
                                  Unpaid
                                </span>
                              )}
                            </td>
                            <td>
                              {order.isDelivered ? (
                                <span className="status-badge status-delivered">
                                  Delivered
                                </span>
                              ) : (
                                <span className="status-badge status-pending">
                                  Pending
                                </span>
                              )}
                            </td>
                            <td>
                              <div className="action-buttons">
                                <Link
                                  to={`/order/${order._id}`}
                                  className="view-button"
                                >
                                  Details
                                </Link>
                                
                                {!order.isDelivered && order.isPaid && (
                                  <button
                                    onClick={() => handleMarkAsDelivered(order._id)}
                                    className="deliver-button"
                                  >
                                    Mark Delivered
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {orders.length > ordersPerPage && (
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className="pagination-button"
                      disabled={currentPage === 1}
                    >
                      &larr;
                    </button>
                    
                    {[...Array(Math.ceil(orders.length / ordersPerPage)).keys()].map(number => (
                      <button
                        key={number + 1}
                        onClick={() => paginate(number + 1)}
                        className={`pagination-button ${
                          currentPage === number + 1 ? 'active' : ''
                        }`}
                      >
                        {number + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(orders.length / ordersPerPage)))}
                      className="pagination-button"
                      disabled={currentPage === Math.ceil(orders.length / ordersPerPage)}
                    >
                      &rarr;
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersListPage;