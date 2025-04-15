// src/pages/admin/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AdminDashboard.css'; // We'll create this next

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    lowStockProducts: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { userInfo, userToken } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is admin
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/login');
      toast.error('You do not have access to this page');
      return;
    }
    
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // In a real application, you would have an API endpoint to get dashboard stats
        // For now, we'll simulate it with separate requests
        
        const config = {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        };
        
        // Get orders
        const ordersResponse = await axios.get('/api/orders', config);
        const orders = ordersResponse.data.data.orders;
        
        // Get products
        const productsResponse = await axios.get('/api/products', config);
        const products = productsResponse.data.data;
        
        // Calculate stats
        const pendingOrders = orders.filter(order => !order.isDelivered).length;
        const totalRevenue = orders
          .filter(order => order.isPaid)
          .reduce((sum, order) => sum + order.totalPrice, 0);
        const lowStockProducts = products.filter(product => product.stock < 10).length;
        
        // Set stats
        setStats({
          totalOrders: orders.length,
          pendingOrders,
          totalProducts: products.length,
          totalUsers: 0, // This would come from a users API endpoint
          totalRevenue,
          lowStockProducts
        });
        
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Could not fetch dashboard data');
        setLoading(false);
        toast.error('Failed to load dashboard data');
      }
    };
    
    fetchDashboardData();
  }, [userInfo, navigate, userToken]);
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="admin-error-container">
        <div className="error-icon">❌</div>
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-header">
        <h1>Admin Dashboard ✨</h1>
        <p>Manage your magical products and orders</p>
      </div>
      
      <div className="admin-dashboard-content">
        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="bento-card stat-card orders-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h2>Total Orders</h2>
              <p className="stat-value">{stats.totalOrders}</p>
              <Link to="/admin/orders" className="stat-link">
                View all orders →
              </Link>
            </div>
          </div>
          
          <div className="bento-card stat-card pending-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h2>Pending Orders</h2>
              <p className="stat-value">{stats.pendingOrders}</p>
              <Link to="/admin/orders" className="stat-link">
                View pending orders →
              </Link>
            </div>
          </div>
          
          <div className="bento-card stat-card revenue-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h2>Total Revenue</h2>
              <p className="stat-value">{formatCurrency(stats.totalRevenue)}</p>
              <span className="stat-note">
                From all completed orders
              </span>
            </div>
          </div>
          
          <div className="bento-card stat-card products-card">
            <div className="stat-icon">🧂</div>
            <div className="stat-content">
              <h2>Products</h2>
              <p className="stat-value">{stats.totalProducts}</p>
              <Link to="/admin/products" className="stat-link">
                Manage products →
              </Link>
            </div>
          </div>
          
          <div className="bento-card stat-card inventory-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <h2>Low Stock Products</h2>
              <p className="stat-value">{stats.lowStockProducts}</p>
              <Link to="/admin/products" className="stat-link">
                View inventory →
              </Link>
            </div>
          </div>
          
          <div className="bento-card stat-card users-card">
            <div className="stat-icon">👤</div>
            <div className="stat-content">
              <h2>Customers</h2>
              <p className="stat-value">{stats.totalUsers}</p>
              <Link to="/admin/users" className="stat-link">
                Manage users →
              </Link>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bento-card actions-card">
          <div className="card-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="card-content">
            <div className="quick-actions-grid">
              <Link
                to="/admin/products/create"
                className="action-button action-create"
              >
                <span className="action-icon">✨</span>
                Add New Product
              </Link>
              
              <Link
                to="/admin/orders"
                className="action-button action-orders"
              >
                <span className="action-icon">📋</span>
                Manage Orders
              </Link>
              
              <Link
                to="/admin/products"
                className="action-button action-inventory"
              >
                <span className="action-icon">🔄</span>
                Update Inventory
              </Link>
              
              <Link
                to="/admin/subscriptions"
                className="action-button action-subscription"
              >
                <span className="action-icon">📦</span>
                Manage Subscriptions
              </Link>
            </div>
          </div>
        </div>
        
        {/* Recent Activities */}
        <div className="bento-card activities-card">
          <div className="card-header">
            <h2>Recent Activity</h2>
          </div>
          <div className="card-content">
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon activity-icon-green">
                  <span>✓</span>
                </div>
                <div className="activity-content">
                  <p className="activity-title">New order placed</p>
                  <p className="activity-subtitle">Order #12345 - $78.99</p>
                  <p className="activity-time">Just now</p>
                </div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon activity-icon-blue">
                  <span>🔄</span>
                </div>
                <div className="activity-content">
                  <p className="activity-title">Product inventory updated</p>
                  <p className="activity-subtitle">Ceylon Cinnamon - 32 units added</p>
                  <p className="activity-time">2 hours ago</p>
                </div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon activity-icon-yellow">
                  <span>👤</span>
                </div>
                <div className="activity-content">
                  <p className="activity-title">New user registered</p>
                  <p className="activity-subtitle">john.doe@example.com</p>
                  <p className="activity-time">5 hours ago</p>
                </div>
              </div>
            </div>
            
            <button className="view-all-button">
              View all activity →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;