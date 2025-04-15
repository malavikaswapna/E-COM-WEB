// frontend/src/services/api.js
import axios from 'axios';

// Update this to match your backend server URL and port
const API_URL = '/api';

// Create an instance of axios with a base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Important: Enable credentials for cross-origin requests
  withCredentials: true
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      // Check if the error is due to an invalid token
      if (error.response.data.message?.includes('token')) {
        // Clear stored token
        localStorage.removeItem('userToken');
        // Redirect to login page
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const recipesAPI = {
  searchByIngredient: (ingredient) => api.get('/recipes/search', { params: { ingredient } })
};

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/users/profile')
};

// Products API
export const productsAPI = {
  getProducts: (filters) => api.get('/products', { params: filters }),
  getProductById: (id) => api.get(`/products/${id}`),
  getRelatedProducts: (id) => api.get(`/product-suggestions/${id}`),
  // Admin methods
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`)
};

// Cart API
export const cartAPI = {
  addShippingAddress: (addressData) => api.post('/users/addresses', addressData)
};

// Orders API
export const ordersAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrderDetails: (id) => api.get(`/orders/${id}`),
  getMyOrders: () => api.get('/orders/myorders'),
  // Payment-related
  createPaymentIntent: (orderId) => api.post('/payments/create-payment-intent', { orderId }),
  updatePaymentStatus: (data) => api.post('/payments/update-payment-status', data)
};

export default api;