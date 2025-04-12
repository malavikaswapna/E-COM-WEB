// src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../redux/slices/authSlice';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, userInfo } = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
    dispatch(clearError());
  }, [userInfo, navigate, dispatch]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };
  
  return (
    <div className="login-container">
      <div className="login-card">
        {/* Bento Grid */}
        <div className="bento-grid">
          <div className="bento-item">
            <img 
              src="https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
              alt="Food" 
            />
          </div>
          <div className="bento-item">
            <img 
              src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
              alt="Tea" 
            />
          </div>
          <div className="bento-item">
            <img 
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
              alt="Cookies" 
            />
          </div>
          <div className="bento-item">
            <img 
              src="https://images.unsplash.com/photo-1542327897-d73f4005b533?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
              alt="People" 
            />
          </div>
        </div>
        
        {/* Login Form */}
        <div className="login-form">
          <div className="logo-container">
            <div className="logo-circle">T&S</div>
            <h1 className="title">International ✨</h1>
            <p className="subtitle">Spice & Tea Exchange 🫖</p>
          </div>
          
          <h2 className="title">Welcome back! ✨</h2>
          <p className="subtitle">Let's explore magical flavors together~</p>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                className="input-field"
                placeholder="Your magical email 📧"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group password-container">
              <input
                type={showPassword ? "text" : "password"}
                className="input-field"
                placeholder="Secret password 🔮"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            
            <div className="remember-forgot">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me 💝</span>
              </label>
              
              <a href="#" className="forgot-password">
                Forgot password? 🌸
              </a>
            </div>
            
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Signing In..." : "✨ Login to Your Magical Account ✨"}
            </button>
          </form>
          
          <div className="divider">Or continue with ✨</div>
          
          <div className="social-buttons">
            <button className="social-button">
              Google 🎀
            </button>
            <button className="social-button">
              Facebook ❤️
            </button>
          </div>
          
          <div className="register-link">
            <p>
              Don't have an account?{' '}
              <Link to="/register">
                Register here ✨
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;