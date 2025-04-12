// src/components/common/ErrorDisplay.js
import React from 'react';
import { Link } from 'react-router-dom';

const ErrorDisplay = ({ 
  message = 'Something went wrong', 
  retry = null,
  goBack = true,
  goHome = true,
  error = null 
}) => {
  // For development, log the full error if available
  React.useEffect(() => {
    if (error && process.env.NODE_ENV === 'development') {
      console.error('Error details:', error);
    }
  }, [error]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-red-100 p-3 rounded-full">
          <svg 
            className="w-8 h-8 text-red-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold text-center mb-2">Error Encountered</h2>
      <p className="text-gray-600 text-center mb-6">{message}</p>
      
      <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-2">
        {retry && (
          <button 
            onClick={retry}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Try Again
          </button>
        )}
        
        {goBack && (
          <button 
            onClick={() => window.history.back()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
          >
            Go Back
          </button>
        )}
        
        {goHome && (
          <Link 
            to="/"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors text-center"
          >
            Return Home
          </Link>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;