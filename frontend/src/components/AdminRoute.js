// frontend/src/components/AdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const AdminRoute = ({ children }) => {
  const { userInfo, userToken } = useSelector((state) => state.auth);
  
  if (!userToken) {
    // Redirect to login if not authenticated
    toast.error('Please log in to access this page');
    return <Navigate to="/login" replace />;
  }
  
  if (userInfo && userInfo.role !== 'admin') {
    // Redirect to home if authenticated but not admin
    toast.error('You do not have permission to access this page');
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default AdminRoute;