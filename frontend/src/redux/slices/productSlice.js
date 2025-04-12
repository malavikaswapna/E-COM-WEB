// frontend/src/redux/slices/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsAPI } from '../../services/api';
import axios from 'axios';

const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  filters: {
    type: '',
    origin: '',
    flavor: '',
    minPrice: '',
    maxPrice: ''
  }
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters = {}, { rejectWithValue }) => {
    try {
      console.log('Fetching products with filters:', filters);
      const response = await productsAPI.getProducts(filters);
      console.log('API Response:', response);
      
      // Check what's in the response
      if (response.data) {
        console.log('Products data structure:', response.data);
        // The structure might be response.data.data or just response.data
        return response.data.data || response.data;
      } else {
        console.log('No data in response:', response);
        return [];
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await productsAPI.getProductById(id);
      return data;
    } catch (error) {
      console.error('Error fetching product details:', error);
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        type: '',
        origin: '',
        flavor: '',
        minPrice: '',
        maxPrice: ''
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products';
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.data;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch product details';
      });
  }
});
export const { setFilters, clearFilters } = productSlice.actions;
export default productSlice.reducer;