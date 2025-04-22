// src/pages/RegisterPage.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, clearError } from '../redux/slices/authSlice';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import './RegisterPage.css'; // We'll create a matching CSS file

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, userToken } = useSelector((state) => state.auth);
  
  useEffect(() => {
    // If user is already logged in, redirect to home page
    if (userToken) {
      navigate('/');
    }
    
    // Clear any previous errors when component mounts
    dispatch(clearError());
  }, [userToken, navigate, dispatch]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    dispatch(registerUser({ name, email, password }));
  };

  const [passwordStrength, setPasswordStrength] = useState(0);

  // Check password strength when password changes
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Complexity check
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    
    if ((hasNumber && hasSpecial) || (hasNumber && hasUppercase) || (hasSpecial && hasUppercase)) {
      strength += 1;
    }
    
    // Final strength level
    if (password.length >= 12 && hasNumber && hasSpecial && hasUppercase) {
      strength += 1;
    }
    
    setPasswordStrength(strength);
  }, [password]);
  
  // Get CSS class based on password strength
  const getStrengthClass = () => {
    switch(passwordStrength) {
      case 1: return 'strength-weak';
      case 2: return 'strength-medium';
      case 3: return 'strength-strong';
      default: return '';
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `/api/auth/${provider}`;
  };
  
  return (
    <div className="register-container">
      <div className="register-card">
        {/* Form section */}
        <div className="register-form">
          <h2 className="register-title">Join our magical journey! ✨</h2>
          <p className="register-subtitle">Create your enchanted account today~</p>
          
          {message && (
            <div className="register-error">
              {message}
            </div>
          )}
          
          {error && (
            <div className="register-error">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="register-form-group">
              <input
                type="text"
                className="register-input"
                placeholder="Your magical name ✨"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="register-form-group">
              <input
                type="email"
                className="register-input"
                placeholder="Your magical email 📧"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="register-form-group">
              <div className="register-password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  className="register-input"
                  placeholder="Create a secret password 🔮"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  className="register-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {password && (
                <div className="password-strength">
                  <div className={`password-strength-bar ${getStrengthClass()}`}></div>
                </div>
              )}
            </div>
            
            <div className="register-form-group">
              <div className="register-password-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="register-input"
                  placeholder="Confirm your secret password 🔮"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  className="register-toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? "Creating Your Account..." : "✨ Create Magical Account ✨"}
            </button>
          </form>
          
          <div className="register-divider"><span>Or continue with </span></div>
          
          <div className="register-social">
            <button className="register-social-button google button"
             onClick={() => handleSocialLogin('google')}
             type="button"
             disabled={loading}
            >
              <span className="social-icon">🔍</span>
              Google 🎀
            </button>
          </div>
          
          <div className="register-login-link">
            <p>
              Already have an account?{' '}
              <Link to="/login">
                Sign in here ✨
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;