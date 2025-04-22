// frontend/src/redux/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Get cart items from localStorage
const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const initialState = {
  cartItems: cartItemsFromStorage,
  shippingAddress: localStorage.getItem('shippingAddress')
    ? JSON.parse(localStorage.getItem('shippingAddress'))
    : {},
  paymentMethod: localStorage.getItem('paymentMethod')
    ? localStorage.getItem('paymentMethod')
    : '',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    shippingAddress: {},
    paymentMethod: '',
    userAddresses: {},
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      
      const existItem = state.cartItems.find(
        (x) => x.product === item.product
      );
      
      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
         x.product === existItem.product ? 
         { ...x, qty: Math.min(x.qty + item.qty, item.stock) } : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      
      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (x) => x.product !== action.payload
      );
      
      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      
      state.cartItems = state.cartItems.map((item) =>
        item.product === id ? { ...item, qty: quantity } : item
      );
      
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      // If we have a user ID in the payload, store this address for that user
      if (action.payload.userId) {
        state.userAddresses[action.payload.userId] = action.payload;
      }
    },

    // Add a new reducer to load a user's saved address
    loadUserAddress: (state, action) => {
      const userId = action.payload;
      if (userId && state.userAddresses[userId]) {
        state.shippingAddress = state.userAddresses[userId];
      } else {
        // Reset to empty if no saved address for this user
        state.shippingAddress = {};
      }
    },

    // Add a reset shipping info method to use on logout
    resetShippingInfo: (state) => {
      state.shippingAddress = {};
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload.type;
      state.paymentDetails = action.payload;
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    },
    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      
      state.cartItems = state.cartItems.map((item) =>
        item.product === id ? { ...item, qty: quantity } : item
      );
      
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },

    // Add this new reducer for calculating cart totals
    getCartTotals: (state) => {
      // Calculate items price
      state.itemsPrice = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      );
      
      // Calculate shipping price (free for orders over $100)
      state.shippingPrice = state.itemsPrice > 100 ? 0 : 10;
      
      // Calculate tax price (15%)
      state.taxPrice = 0.15 * state.itemsPrice;
      
      // Calculate total price
      state.totalPrice = (
        state.itemsPrice + 
        state.shippingPrice + 
        state.taxPrice
      ).toFixed(2);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  loadUserAddress, 
  resetShippingInfo,
  savePaymentMethod,
  clearCart,
  updateCartItemQuantity,
  getCartTotals,
} = cartSlice.actions;

export default cartSlice.reducer;