// src/components/layout/BentoHeader.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import './BentoHeader.css';

const BentoHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { userInfo, userToken } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  return (
    <div className="bento-header-container">
      <div className="bento-header">
        <div className="bento-logo">
          <Link to="/">
            <div className="logo-circle">
              <span>T&S</span>
            </div>
            <div className="logo-text">
              <h1>Spice & Tea</h1>
              <p>Exchange ✨</p>
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
              <button className="user-button" onClick={() => setMenuOpen(!menuOpen)}>
                {userInfo.name} ✨
              </button>
              {menuOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile">My Profile 🌸</Link>
                  <Link to="/myorders">My Orders 📦</Link>
                  {userInfo.role === 'admin' && (
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
            {cartItems.length > 0 && (
              <span className="cart-badge">{cartItems.length}</span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BentoHeader;