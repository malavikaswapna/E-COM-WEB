// src/components/common/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'purple', fullPage = false, text = 'Loading...' }) => {
  // Size mapping
  const sizeMap = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16',
  };
  
  // Color mapping
  const colorMap = {
    purple: 'border-purple-500',
    green: 'border-green-500',
    blue: 'border-blue-500',
    pink: 'border-pink-500',
  };
  
  // Get the appropriate size and color classes
  const spinnerSize = sizeMap[size] || sizeMap.medium;
  const spinnerColor = colorMap[color] || colorMap.purple;
  
  // Full page spinner with overlay
  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
        <div className={`${spinnerSize} animate-spin rounded-full border-t-2 border-b-2 ${spinnerColor} mb-4`}></div>
        {text && (
          <p className="text-gray-600 font-medium">{text}</p>
        )}
      </div>
    );
  }
  
  // Regular inline spinner
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className={`${spinnerSize} animate-spin rounded-full border-t-2 border-b-2 ${spinnerColor}`}></div>
      {text && (
        <p className="mt-2 text-gray-600 text-sm">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;