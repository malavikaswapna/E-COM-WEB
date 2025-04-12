// src/components/layout/BentoFooter.js
import React from 'react';
import { Link } from 'react-router-dom';
import './BentoFooter.css';

const BentoFooter = () => {
  const currentYear = new Date().getFullYear();
  
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
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Your magical email 📧" 
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-button">
                ✨ Join
              </button>
            </form>
            
            <div className="contact-info">
              <p>📧 info@spiceteaexchange.com</p>
              <p>📞 (555) 123-4567</p>
            </div>
          </div>
        </div>
        
        <div className="bento-copyright">
          <p>✨ {currentYear} Spice & Tea Exchange. All rights reserved. ✨</p>
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