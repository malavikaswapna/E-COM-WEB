import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [flavorPreferences, setFlavorPreferences] = useState({
    likedFlavors: [],
    dislikedFlavors: [],
    preferredIntensity: 3
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { userInfo, userToken, loading } = useSelector((state) => state.auth);
  
  useEffect(() => {
    // Redirect if not logged in
    if (!userToken) {
      navigate('/login');
      return;
    }
    
    // Fetch user profile if not already loaded
    if (!userInfo) {
      dispatch(getUserProfile());
    } else {
      // Fill form fields with user data
      setName(userInfo.name || '');
      if (userInfo.flavorPreferences) {
        setFlavorPreferences({
          likedFlavors: userInfo.flavorPreferences.likedFlavors || [],
          dislikedFlavors: userInfo.flavorPreferences.dislikedFlavors || [],
          preferredIntensity: userInfo.flavorPreferences.preferredIntensity || 3
        });
      }
    }
  }, [dispatch, navigate, userToken, userInfo]);
  
  const handleFlavorChange = (e, type) => {
    const value = e.target.value;
    
    if (e.target.checked) {
      // Add to array if checked
      setFlavorPreferences({
        ...flavorPreferences,
        [type]: [...flavorPreferences[type], value]
      });
    } else {
      // Remove from array if unchecked
      setFlavorPreferences({
        ...flavorPreferences,
        [type]: flavorPreferences[type].filter(item => item !== value)
      });
    }
  };
  
  const handleIntensityChange = (e) => {
    setFlavorPreferences({
      ...flavorPreferences,
      preferredIntensity: Number(e.target.value)
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        }
      };
      
      // Make sure we're using the correct endpoint with proper API base URL
      await axios.patch(
        '/api/users/profile',  // Use relative URL for proxy to work
        { 
          name,
          flavorPreferences
        },
        config
      );
      
      setMessage('Profile updated successfully');
      // Refresh user profile
      dispatch(getUserProfile());
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error.response?.data?.message || 'Error updating profile. Please try again.');
    }
  };
  
  const flavorOptions = [
    'Sweet', 'Spicy', 'Bitter', 'Sour', 'Umami',
    'Floral', 'Earthy', 'Fruity', 'Smoky', 'Herbal'
  ];
  
  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Your Profile</h2>
      
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Flavor Preferences</h3>
            
            <div className="mb-4">
              <h4 className="text-md font-medium mb-2">Flavors You Enjoy</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {flavorOptions.map(flavor => (
                  <div key={`like-${flavor}`} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`like-${flavor}`}
                      value={flavor}
                      checked={flavorPreferences.likedFlavors.includes(flavor)}
                      onChange={(e) => handleFlavorChange(e, 'likedFlavors')}
                      className="mr-2"
                    />
                    <label htmlFor={`like-${flavor}`}>{flavor}</label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-md font-medium mb-2">Flavors You Dislike</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {flavorOptions.map(flavor => (
                  <div key={`dislike-${flavor}`} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`dislike-${flavor}`}
                      value={flavor}
                      checked={flavorPreferences.dislikedFlavors.includes(flavor)}
                      onChange={(e) => handleFlavorChange(e, 'dislikedFlavors')}
                      className="mr-2"
                    />
                    <label htmlFor={`dislike-${flavor}`}>{flavor}</label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-md font-medium mb-2">Preferred Intensity (1-5)</h4>
              <div className="flex items-center">
                <span className="mr-2">Mild</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={flavorPreferences.preferredIntensity}
                  onChange={handleIntensityChange}
                  className="w-full max-w-xs mx-2"
                />
                <span className="ml-2">Strong</span>
              </div>
              <div className="text-center mt-1">
                Current: {flavorPreferences.preferredIntensity}
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50"
          >
            Update Profile
          </button>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;