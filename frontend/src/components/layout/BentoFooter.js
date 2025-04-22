// src/components/layout/BentoFooter.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './BentoFooter.css';

const BentoFooter = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    try {
      setLoading(true);
      await axios.post('/api/marketing/subscribe', { email });
      
      toast.success('✨ You\'ve been subscribed to our magical updates! ✨');
      setEmail('');
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Oops! Something went wrong with your subscription');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <footer className="bento-footer">
      <div className="bento-footer-container">
        <div className="bento-grid">
          {/* Company Info Box */}
          <div className="bento-box company-box">
            <div className="logo-container">
              <div className="logo-circle">
                <span>T&S</span>
              </div>
              <div className="logo-text">
                <h3>Spice & Tea</h3>
                <p>Exchange ✨</p>
              </div>
            </div>
            <p className="tagline">Bringing the world's finest flavors to your doorstep</p>
            <div className="social-icons">
              <a href="#" aria-label="Instagram" className="social-icon">💕</a>
              <a href="#" aria-label="Facebook" className="social-icon">💙</a>
              <a href="#" aria-label="Twitter" className="social-icon">💭</a>
              <a href="#" aria-label="Pinterest" className="social-icon">💫</a>
            </div>
          </div>
          
          {/* Quick Links Box */}
          <div className="bento-box links-box">
            <h3>Magical Categories 🧚‍♀️</h3>
            <ul className="footer-links">
              <li><Link to="/products?type=spice">✨ Spices</Link></li>
              <li><Link to="/products?type=tea">🍵 Teas</Link></li>
              <li><Link to="/products?type=blend">🌈 Blends</Link></li>
              <li><Link to="/subscriptions">📦 Subscription Boxes</Link></li>
              <li><Link to="/products?featured=true">⭐ Featured Products</Link></li>
            </ul>
          </div>
          
          {/* Company Links Box */}
          <div className="bento-box about-box">
            <h3>About Our Magic ✨</h3>
            <ul className="footer-links">
              <li><Link to="/about">💫 Our Story</Link></li>
              <li><Link to="/about#sourcing">🌱 Sourcing & Ethics</Link></li>
              <li><Link to="/shipping">🚚 Shipping Policy</Link></li>
              <li><Link to="/returns">↩️ Returns & Refunds</Link></li>
              <li><Link to="/terms">📜 Terms of Service</Link></li>
            </ul>
          </div>
          
          {/* Newsletter Box */}
          <div className="bento-box newsletter-box">
            <h3>Join Our Magical Journey ✨</h3>
            <p>Sign up for enchanted updates and special offers!</p>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder="Your magical email 📧" 
                className="newsletter-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button 
                type="submit" 
                className="newsletter-button"
                disabled={loading}
              >
                {loading ? "Brewing..." : "✨ Join"}
              </button>
            </form>
            
            <div className="contact-info">
              <p>📧 info@spiceteaexchange.com</p>
              <p>📞 (555) 123-4567</p>
            </div>
          </div>
        </div>
        
        <div className="copyright-section">
          <p className="copyright-text">✨ {currentYear} Spice & Tea Exchange. All rights reserved. ✨</p>
          <div className="bottom-links">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default BentoFooter;