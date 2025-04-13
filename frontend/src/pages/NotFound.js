import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="notfound-wrapper">
      <div className="notfound-hero">
        <img
          src="https://i.pinimg.com/736x/16/c6/fe/16c6fe3b4f9401fcd091d4b992864314.jpg"
          alt="Spilled tea"
          className="notfound-image"
        />
        <div className="notfound-text">
          <h1>404</h1>
          <h2>You're Off the Flavor Map 🍵</h2>
          <p>
            This page is as elusive as the rarest spice in our collection. But don't worry — the journey is still delicious.
          </p>
          <Link to="/" className="notfound-button">
            Return to Home
          </Link>
        </div>
      </div>

      <div className="notfound-tips">
        <h3>While You're Here, Try One of These:</h3>
        <ul>
          <li><Link to="/products?type=tea">🌿 Browse our Tea Selection</Link></li>
          <li><Link to="/products?type=spice">🧂 Explore Rare Spices</Link></li>
          <li><Link to="/subscriptions">📦 Check Subscription Boxes</Link></li>
          <li><Link to="/about">🌍 Learn Our Story</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default NotFound;
