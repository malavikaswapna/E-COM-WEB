// src/pages/OAuthSuccessPage.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { processOAuthLogin } from '../redux/slices/authSlice';
import './LoginPage.css'; // Reuse login page styles

const OAuthSuccessPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { loading, error, userInfo } = useSelector((state) => state.auth);
  
  useEffect(() => {
    const handleOAuthRedirect = async () => {
      try {
        // Get token from URL parameters
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (!token) {
          throw new Error('No authentication token received');
        }
        
        // Process OAuth login
        await dispatch(processOAuthLogin(token)).unwrap();
        
        // Redirect to home on success
        navigate('/');
      } catch (err) {
        console.error('OAuth processing error:', err);
        navigate('/login?error=Authentication failed');
      }
    };
    
    // If user is already logged in or in the process of logging in, don't try again
    if (!userInfo && !loading) {
      handleOAuthRedirect();
    } else if (userInfo) {
      // Already logged in
      navigate('/');
    }
  }, [dispatch, navigate, location, userInfo, loading]);
  
  return (
    <div className="oauth-loading-container">
      <div className="loading-spinner"></div>
      <h2>✨ Preparing Your Magical Tea Journey ✨</h2>
      {loading ? (
        <p>We're brewing your experience... Just a moment please! 🍵</p>
      ) : error ? (
        <p>Oh no! A magical mishap occurred. Redirecting you back... 🔮</p>
      ) : (
        <p>Welcome to the magical world of flavors! Redirecting you now... 🌈</p>
      )}
    </div>
  );
};

export default OAuthSuccessPage;