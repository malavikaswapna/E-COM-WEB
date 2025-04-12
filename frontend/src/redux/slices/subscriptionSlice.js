// frontend/src/redux/slices/subscriptionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create subscription
export const createSubscription = createAsyncThunk(
  'subscriptions/createSubscription',
  async (subscriptionData, { getState, rejectWithValue }) => {
    try {
      const { userToken } = getState().auth;
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        }
      };
      
      const { data } = await axios.post(`/api/subscriptions`, subscriptionData, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Get user subscriptions
export const getUserSubscriptions = createAsyncThunk(
  'subscriptions/getUserSubscriptions',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { userToken } = getState().auth;
      
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      };
      
      const { data } = await axios.get(`/api/subscriptions`, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Get subscription details
export const getSubscriptionDetails = createAsyncThunk(
  'subscriptions/getSubscriptionDetails',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { userToken } = getState().auth;
      
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      };
      
      const { data } = await axios.get(`/api/subscriptions/${id}`, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Update subscription
export const updateSubscription = createAsyncThunk(
  'subscriptions/updateSubscription',
  async ({ id, subscriptionData }, { getState, rejectWithValue }) => {
    try {
      const { userToken } = getState().auth;
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        }
      };
      
      const { data } = await axios.put(`/api/subscriptions/${id}`, subscriptionData, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Cancel subscription
export const cancelSubscription = createAsyncThunk(
  'subscriptions/cancelSubscription',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { userToken } = getState().auth;
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`
        }
      };
      
      const { data } = await axios.post(`/api/subscriptions/${id}/cancel`, {}, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Get subscription recommendations
export const getSubscriptionRecommendations = createAsyncThunk(
  'subscriptions/getRecommendations',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { userToken } = getState().auth;
      
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      };
      
      const { data } = await axios.get(`/api/subscriptions/recommendations`, config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState: {
    loading: false,
    success: false,
    subscription: null,
    subscriptions: [],
    recommendations: [],
    error: null
  },
  reducers: {
    resetSubscriptionState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create subscription
      .addCase(createSubscription.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.subscription = action.payload.data.subscription;
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get user subscriptions
      .addCase(getUserSubscriptions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload.data.subscriptions;
      })
      .addCase(getUserSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get subscription details
      .addCase(getSubscriptionDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSubscriptionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.subscription = action.payload.data.subscription;
      })
      .addCase(getSubscriptionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update subscription
      .addCase(updateSubscription.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.subscription = action.payload.data.subscription;
      })
      .addCase(updateSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel subscription
      .addCase(cancelSubscription.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (state.subscription) {
          state.subscription.status = 'cancelled';
        }
        // Update subscription in subscriptions array
        state.subscriptions = state.subscriptions.map(sub => 
          sub._id === state.subscription?._id 
            ? { ...sub, status: 'cancelled' } 
            : sub
        );
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get recommendations
      .addCase(getSubscriptionRecommendations.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSubscriptionRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload.data.recommendations;
      })
      .addCase(getSubscriptionRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetSubscriptionState } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;