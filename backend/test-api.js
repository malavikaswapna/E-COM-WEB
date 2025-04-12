// test-api.js
const axios = require('axios');

const testBackendConnection = async () => {
  try {
    console.log('Testing products endpoint...');
    const response = await axios.get('http://localhost:5001/api/products');
    console.log('Response status:', response.status);
    console.log('Products returned:', response.data.data.length);
    console.log('First product:', response.data.data[0]);
  } catch (error) {
    console.error('Error connecting to backend:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
};

testBackendConnection();