// frontend/src/services/tokenService.js
import axios from 'axios';

// Token refresh interval (e.g., every 25 minutes)
const REFRESH_INTERVAL = 25 * 60 * 1000;

// Refresh token function
const refreshToken = async () => {
  try {
    const token = localStorage.getItem('userToken');
    
    if (!token) return;
    
    // Check token expiration (if you store expiry time)
    const tokenExp = localStorage.getItem('tokenExpiry');
    if (tokenExp && new Date(tokenExp) > new Date()) {
      // Token still valid, no need to refresh
      return;
    }
    
    // Call refresh token endpoint
    const { data } = await axios.post('/api/auth/refresh-token', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    // Update token in storage
    localStorage.setItem('userToken', data.token);
    // You could also store expiry time
    localStorage.setItem('tokenExpiry', new Date(Date.now() + REFRESH_INTERVAL));
    
  } catch (error) {
    console.error('Token refresh failed', error);
    // If refresh fails, log user out
    localStorage.removeItem('userToken');
    localStorage.removeItem('tokenExpiry');
    window.location.href = '/login';
  }
};

// Start token refresh cycle
export const initTokenRefresh = () => {
  // Refresh immediately if needed
  refreshToken();
  
  // Set up interval for future refreshes
  setInterval(refreshToken, REFRESH_INTERVAL);
};

export default { initTokenRefresh };