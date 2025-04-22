// frontend/src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';
import { resetShippingInfo, loadUserAddress } from './cartSlice';
import axios from 'axios';

// Get user token from localStorage
const userToken = localStorage.getItem('userToken') 
  ? localStorage.getItem('userToken') 
  : null;

const initialState = {
  loading: false,
  userInfo: null,
  userToken,
  error: null,
  success: false,
};

// Register user
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await authAPI.register(userData);

      localStorage.setItem('userToken', data.token);

      // If registration is successful, initialize their address space
      if (data.data && data.data.user && data.data.user._id) {
        dispatch(loadUserAddress(data.data.user._id));
      }

      console.log('Registration successful:', data);
      return data;
    } catch (error) {
      console.error('Registration error:', error);

      // Get error message from response
      const message = error.response && error.response.data.message
        ? error.response.data.message
        : error.response && error.response.data.status === 'fail'
          ? error.response.data.message
          : error.message || 'Registration failed';

      return rejectWithValue(message);
    }
  }
);

// Login user
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await authAPI.login(credentials);
      // Store token in localStorage
      localStorage.setItem('userToken', data.token);

      // Load this user's saved shipping address if they have one
      if (data.data && data.data.user && data.data.user._id) {
        dispatch(loadUserAddress(data.data.user._id));
      }

      console.log('Login successful:', data);
      return data;
    } catch (error) {
      console.error('Login error:', error);

      // Get error message from response
      const message = error.response && error.response.data.message
        ? error.response.data.message
        : error.response && error.response.data.status === 'fail'
          ? error.response.data.message
          : error.message || 'Login failed';

      return rejectWithValue(message);
    }
  }
);

// Get user profile
export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const { data } = await authAPI.getProfile();

      // Ensure we're loading the correct user's shipping address
      const currentUser = getState().auth.userInfo;
      const fetchedUser = data.data.user;

      // If user ID changed or we're getting a user profile for the first time
      if ((!currentUser && fetchedUser._id) || 
          (currentUser && fetchedUser && currentUser._id !== fetchedUser._id)) {
        dispatch(loadUserAddress(fetchedUser._id));
      }

      return data;
    } catch (error) {
      console.error('Profile error:', error);

      // Get error message from response
      const message = error.response && error.response.data.message
        ? error.response.data.message
        : error.response && error.response.data.status === 'fail'
          ? error.response.data.message
          : error.message || 'Failed to get profile';

      return rejectWithValue(message);
    }
  }
);

// Logout user - converted to thunk to handle multiple dispatches
export const logoutUser = createAsyncThunk(
  'auth/logout', 
  async (_, { dispatch }) => {
    localStorage.removeItem('userToken');

    // Reset shipping info when user logs out
    dispatch(resetShippingInfo());

    return null;
  }
);

// Initialize social login - redirects to provider auth page
export const initiateOAuthLogin = (provider) => {
  window.location.href = `/api/auth/${provider}`;
};

// Process OAuth token after successful authentication
export const processOAuthLogin = createAsyncThunk(
  'auth/processOAuth',
  async (token, { rejectWithValue, dispatch }) => {
    try {
      // Save the token
      localStorage.setItem('userToken', token);
      
      // Get user profile with the token
      const { data } = await authAPI.getProfile();
      
      // Load this user's saved shipping address if they have one
      if (data.data && data.data.user && data.data.user._id) {
        dispatch(loadUserAddress(data.data.user._id));
      }
      
      return {
        user: data.data.user,
        token
      };
    } catch (error) {
      console.error('OAuth process error:', error);
      
      // Remove the token on error
      localStorage.removeItem('userToken');
      
      // Get error message from response
      const message = error.response && error.response.data.message
        ? error.response.data.message
        : error.response && error.response.data.status === 'fail'
          ? error.response.data.message
          : error.message || 'Social login failed';
          
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userToken');
      state.loading = false;
      state.userInfo = null;
      state.userToken = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.userInfo = action.payload.data.user;
        state.userToken = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.data.user;
        state.userToken = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get User Profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.data.user;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.userInfo = null;
        state.userToken = null;
        state.error = null;
      })
      // OAuth Process
      .addCase(processOAuthLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processOAuthLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.user;
        state.userToken = action.payload.token;
      })
      .addCase(processOAuthLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
// Note: We're replacing the simple logout action with the thunk version
export default authSlice.reducer;