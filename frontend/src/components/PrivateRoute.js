// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const { userInfo, loading } = useSelector((state) => state.auth);
  
  // If still loading, show a loading spinner
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  // If not logged in, redirect to login page
  if (!userInfo) {
    return <Navigate to="/login" />;
  }
  
  // If logged in, show the protected component
  return children;
};

export default PrivateRoute;