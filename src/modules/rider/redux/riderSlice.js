import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as orderApi from '../../../api/order';
import riderApi from '../../../api/rider';

export const updateOrderStatusRider = createAsyncThunk(
  'rider/updateOrderStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await orderApi.updateOrderStatus(id, status);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

export const fetchAssignedOrders = createAsyncThunk(
  'rider/fetchAssignedOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderApi.getAssignedOrders();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch assigned orders');
    }
  }
);

export const fetchRiderStats = createAsyncThunk(
  'rider/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderApi.getRiderStats();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rider stats');
    }
  }
);

export const toggleRiderAvailability = createAsyncThunk(
  'rider/toggleAvailability',
  async (isAvailable, { rejectWithValue }) => {
    try {
      const response = await riderApi.toggleAvailability({ isAvailable });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update availability');
    }
  }
);

export const updateRiderLocation = createAsyncThunk(
  'rider/updateLocation',
  async (location, { rejectWithValue }) => {
    try {
      const response = await riderApi.updateLocation(location);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update location');
    }
  }
);

const initialState = {
  assignedOrders: [],
  riderStats: {
    todayEarnings: 0,
    completedOrders: 0,
    activeDeliveries: 0,
    successRate: '0%'
  },
  isAvailable: false, // Default to false, will sync with user profile
  currentLocation: null,
  loading: false,
  error: null,
};

const riderSlice = createSlice({
  name: 'rider',
  initialState,
  reducers: {
    setAssignedOrders: (state, action) => {
      state.assignedOrders = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateOrderStatusRider.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatusRider.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload.order || action.payload;
        const index = state.assignedOrders.findIndex(o => o._id === updatedOrder._id);
        if (index !== -1) {
          state.assignedOrders[index] = updatedOrder;
        }
      })
      .addCase(updateOrderStatusRider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAssignedOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAssignedOrders.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (payload.data && Array.isArray(payload.data)) {
          state.assignedOrders = payload.data;
        } else if (payload.orders && Array.isArray(payload.orders)) {
          state.assignedOrders = payload.orders;
        } else if (Array.isArray(payload)) {
          state.assignedOrders = payload;
        } else {
          state.assignedOrders = [];
        }
      })
      .addCase(fetchAssignedOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRiderStats.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.riderStats = action.payload.data;
        } else {
          state.riderStats = action.payload;
        }
      })
      .addCase(toggleRiderAvailability.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleRiderAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.isAvailable = action.payload.isAvailable ?? !state.isAvailable;
      })
      .addCase(toggleRiderAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateRiderLocation.fulfilled, (state, action) => {
        // action.meta.arg is the location object {latitude, longitude}
        state.currentLocation = {
          lat: action.meta.arg.latitude,
          lng: action.meta.arg.longitude
        };
      })
      // Sync with auth state
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled') && (action.type.includes('auth/login') || action.type.includes('auth/checkStatus')),
        (state, action) => {
          if (action.payload && action.payload.role === 'rider') {
            state.isAvailable = action.payload.isAvailable ?? state.isAvailable;
          }
        }
      );
  },
});

export const { setAssignedOrders } = riderSlice.actions;
export default riderSlice.reducer;
