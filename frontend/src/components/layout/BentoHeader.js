// src/components/layout/BentoHeader.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/slices/authSlice';
import './BentoHeader.css';

const BentoHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  
  const { userInfo, userToken } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  
  const bannerMessages = [
    "Get 15% off your first purchase with code MAGIC15 ✨",
    "Free shipping on orders over $75 🚚",
    "Join our tea subscription and save 10% monthly 🍵"
  ];

  // Rotate banner messages
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prevIndex) => (prevIndex + 1) % bannerMessages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };
  
  return (
    <>
      {/* Animated banner */}
      <div className="live-banner">
        <div className="banner-content">{bannerMessages[bannerIndex]}</div>
      </div>
      
      {/* Header */}
      <header className="bento-header-container">
        <div className="bento-header">
          <div className="bento-logo">
            <Link to="/">
              <div className="logo-square">
                <span>T&S</span>
              </div>
              <div className="logo-text">
                <h1>International ✨</h1>
                <p>Spice & Tea Exchange 🍵</p>
              </div>
            </Link>
          </div>
          
          <nav className="bento-nav">
            <Link to="/products" className="nav-item">Products</Link>
            <Link to="/subscriptions" className="nav-item">Subscriptions</Link>
            <Link to="/about" className="nav-item">About Us</Link>
          </nav>
          
          <div className="bento-actions">
            {userToken ? (
              <div className="user-menu">
                <button 
                  className="user-button" 
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {userInfo ? userInfo.name : 'User'} ✨
                </button>
                {menuOpen && (
                <div 
                  className="dropdown-menu"
                  onMouseEnter={() => setMenuOpen(true)}
                  onMouseLeave={() => setMenuOpen(false)}
                  >
                    <Link to="/profile">My Profile 🌸</Link>
                    <Link to="/myorders">My Orders 📦</Link>
                    {userInfo && userInfo.role === 'admin' && (
                    <Link to="/admin/dashboard">Admin Dashboard 🔮</Link>
                    )}
                    <button onClick={handleLogout}>Sign Out 👋</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="login-button">Sign In ✨</Link>
            )}
            
            <Link to="/cart" className="cart-link">
              <div className="cart-icon">🛒</div>
              {cartItems && cartItems.length > 0 && (
                <span className="cart-badge">{cartItems.length}</span>
              )}
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};

export default BentoHeader;