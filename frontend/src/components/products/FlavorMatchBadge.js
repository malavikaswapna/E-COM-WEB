// frontend/src/components/products/FlavorMatchBadge.js
import React from 'react';

const FlavorMatchBadge = ({ score }) => {
  if (!score && score !== 0) return null;
  
  let badgeColor = 'gray';
  let label = 'No Match';
  
  if (score >= 80) {
    badgeColor = 'green';
    label = 'Perfect Match';
  } else if (score >= 60) {
    badgeColor = 'blue';
    label = 'Great Match';
  } else if (score >= 40) {
    badgeColor = 'yellow';
    label = 'Good Match';
  } else if (score >= 20) {
    badgeColor = 'orange';
    label = 'Fair Match';
  }
  
  return (
    <div className={`bg-${badgeColor}-100 text-${badgeColor}-800 text-xs px-2 py-1 rounded-full flex items-center`}>
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      <span>{label} ({score}%)</span>
    </div>
  );
};

export default FlavorMatchBadge;