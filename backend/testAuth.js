// testAuth.js
const axios = require('axios');

const API_URL = 'http://localhost:5001/api';

// Test user details
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'Password123!'
};

// Register user
async function testRegister() {
  try {
    console.log('Testing user registration...');
    console.log('Sending data:', testUser);
    const response = await axios.post(`${API_URL}/auth/register`, testUser);
    console.log('Registration successful:', response.data);
    return response.data;
  } catch (error) {
    console.log('Full error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Server responded with error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request error:', error.message);
    }
  }
}

// Login user
async function testLogin() {
  try {
    console.log('Testing user login...');
    console.log('Sending credentials:', { email: testUser.email, password: testUser.password });
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('Login successful:', response.data);
    return response.data;
  } catch (error) {
    console.log('Full error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Server responded with error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request error:', error.message);
    }
  }
}

// Run tests
async function runTests() {
  // First try login (in case user already exists)
  const loginResult = await testLogin();
  
  // If login fails, try registering
  if (!loginResult) {
    await testRegister();
    // Try login again after registration
    await testLogin();
  }
}

runTests().catch(console.error);