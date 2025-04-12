// src/pages/admin/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
        {error}
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h2 className="text-gray-500 text-sm uppercase mb-1">Total Orders</h2>
          <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
          <Link to="/admin/orders" className="text-blue-500 text-sm mt-3 inline-block hover:underline">
            View all orders →
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h2 className="text-gray-500 text-sm uppercase mb-1">Pending Orders</h2>
          <p className="text-3xl font-bold text-gray-800">{stats.pendingOrders}</p>
          <Link to="/admin/orders" className="text-blue-500 text-sm mt-3 inline-block hover:underline">
            View pending orders →
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h2 className="text-gray-500 text-sm uppercase mb-1">Total Revenue</h2>
          <p className="text-3xl font-bold text-gray-800">{formatCurrency(stats.totalRevenue)}</p>
          <span className="text-gray-500 text-sm mt-3 inline-block">
            From all completed orders
          </span>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h2 className="text-gray-500 text-sm uppercase mb-1">Products</h2>
          <p className="text-3xl font-bold text-gray-800">{stats.totalProducts}</p>
          <Link to="/admin/products" className="text-blue-500 text-sm mt-3 inline-block hover:underline">
            Manage products →
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <h2 className="text-gray-500 text-sm uppercase mb-1">Low Stock Products</h2>
          <p className="text-3xl font-bold text-gray-800">{stats.lowStockProducts}</p>
          <Link to="/admin/products" className="text-blue-500 text-sm mt-3 inline-block hover:underline">
            View inventory →
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
          <h2 className="text-gray-500 text-sm uppercase mb-1">Customers</h2>
          <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
          <Link to="/admin/users" className="text-blue-500 text-sm mt-3 inline-block hover:underline">
            Manage users →
          </Link>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/products/create"
            className="bg-green-100 hover:bg-green-200 p-4 rounded-lg flex items-center justify-center text-green-800 font-medium"
          >
            Add New Product
          </Link>
          
          <Link
            to="/admin/orders"
            className="bg-blue-100 hover:bg-blue-200 p-4 rounded-lg flex items-center justify-center text-blue-800 font-medium"
          >
            Manage Orders
          </Link>
          
          <Link
            to="/admin/products"
            className="bg-yellow-100 hover:bg-yellow-200 p-4 rounded-lg flex items-center justify-center text-yellow-800 font-medium"
          >
            Update Inventory
          </Link>
        </div>
      </div>
      
      {/* Recent Activities - This would be populated from recent activities in a real app */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-gray-800">New order placed</p>
              <p className="text-sm text-gray-500">Order #12345 - $78.99</p>
              <p className="text-xs text-gray-400">Just now</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-800">Product inventory updated</p>
              <p className="text-sm text-gray-500">Ceylon Cinnamon - 32 units added</p>
              <p className="text-xs text-gray-400">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-yellow-100 p-2 rounded-full mr-3">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-800">New user registered</p>
              <p className="text-sm text-gray-500">john.doe@example.com</p>
              <p className="text-xs text-gray-400">5 hours ago</p>
            </div>
          </div>
        </div>
        
        <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm">
          View all activity →
        </button>
      </div>
    </div>
  );
};

export default Dashboard;