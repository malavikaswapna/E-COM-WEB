// src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser, clearError, initiateOAuthLogin } from '../redux/slices/authSlice';
import './LoginPage.css';
import { EyeIcon, EyeOffIcon } from 'lucide-react'


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { loading, error, userInfo } = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
    
    // Check if there's an error from OAuth redirect
    const params = new URLSearchParams(location.search);
    const errorMsg = params.get('error');
    
    if (errorMsg) {
      console.error('OAuth Error:', errorMsg);
      // You could dispatch an action here to show the error
    }
    
    dispatch(clearError());
  }, [userInfo, navigate, dispatch, location]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };
  
  const handleSocialLogin = (provider) => {
    window.location.href = `/api/auth/${provider}`;
  };
  
  return (
    <div className="login-container">
      <div className="login-card">
        {/* Bento Grid */}
        <div className="bento-grid">
          <div className="bento-item">
            <img 
              src="https://img.freepik.com/free-photo/christmas-home-scene-illustration_23-2151894297.jpg?ga=GA1.1.345133788.1743087846&semt=ais_hybrid&w=740" 
              alt="Food" 
            />
          </div>

          <div className="bento-item">
            <img 
              src="https://media.istockphoto.com/id/1336503106/photo/ground-moringa-and-moringa-tea-on-rustic-table.jpg?s=612x612&w=0&k=20&c=W_WNUkZOTpUhe0d4QNv_fU24kppgy-IxLdci-y3n-R4=" 
              alt="Tea" 
            />
          </div>

          <div className="bento-item">
            <img 
              src="https://i.pinimg.com/736x/ab/3e/b0/ab3eb016e4694959cbc1d1aa6ea20bf2.jpg" 
              alt="Cookies" 
            />
          </div>
          
          <div className="bento-item">
            <img 
              src="https://i.pinimg.com/736x/8b/b9/55/8bb955a7a1029d50459c3a553b08b29e.jpg" 
              alt="People" 
            />
          </div>
        </div>
        
        {/* Login Form */}
        <div className="login-form">
          
          <h2 className="title">Welcome back! ☕️</h2>
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
                {showPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
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
          
          <div className="divider"><span>Or continue with ✨</span></div>
          
          <div className="social-buttons">
            <button 
              className="social-button google-button"
              onClick={() => handleSocialLogin('google')}
              type="button"
              disabled={loading}
            >
              <span className="social-icon">🔍</span>
              Google 🎀
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