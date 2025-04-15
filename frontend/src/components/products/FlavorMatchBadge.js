// frontend/src/components/products/FlavorMatchBadge.js
import React from 'react';
import './FlavorMatchBadge.css';

const FlavorMatchBadge = ({ score }) => {
  if (!score && score !== 0) return null;
  
  let badgeClass = 'no-match';
  let label = 'No Match';
  
  if (score >= 80) {
    badgeClass = 'perfect-match';
    label = 'Perfect Match';
  } else if (score >= 60) {
    badgeClass = 'great-match';
    label = 'Great Match';
  } else if (score >= 40) {
    badgeClass = 'good-match';
    label = 'Good Match';
  } else if (score >= 20) {
    badgeClass = 'fair-match';
    label = 'Fair Match';
  }
  
  return (
    <div className={`flavor-match-badge ${badgeClass}`}>
      <svg className="match-icon" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <span className="match-label">{label} ({score}%)</span>
    </div>
  );
};

export default FlavorMatchBadge;