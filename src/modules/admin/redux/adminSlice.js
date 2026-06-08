import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import categoryApi from '../../../api/category';
import * as orderApi from '../../../api/order';
import riderApi from '../../../api/rider';
import userApi from '../../../api/user';
import adminApi from '../../../api/admin';

// Rider Thunks
export const createRider = createAsyncThunk(
  'admin/createRider',
  async (riderData, { rejectWithValue }) => {
    try {
      const response = await riderApi.create(riderData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create rider');
    }
  }
);

// User Thunks
export const fetchAllUsers = createAsyncThunk(
  'admin/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.getAll();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const response = await userApi.updateRole(id, role);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user role');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await userApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

export const fetchAllRiders = createAsyncThunk(
  'admin/fetchAllRiders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await riderApi.getAll();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch riders');
    }
  }
);

export const fetchAvailableRiders = createAsyncThunk(
  'admin/fetchAvailableRiders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await riderApi.getAvailable();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch available riders');
    }
  }
);

export const deleteRider = createAsyncThunk(
  'admin/deleteRider',
  async (id, { rejectWithValue }) => {
    try {
      await riderApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete rider');
    }
  }
);

// Admin Stats Thunk
export const fetchAdminStats = createAsyncThunk(
  'admin/fetchStats',
  async (timeframe = 'weekly', { rejectWithValue }) => {
    try {
      const response = await adminApi.getStats({ timeframe });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin stats');
    }
  }
);

// Order Thunks
export const fetchAllOrders = createAsyncThunk(
  'admin/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderApi.getAllOrders();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const updateOrderAdminStatus = createAsyncThunk(
  'admin/updateOrderStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await orderApi.updateOrderStatus(id, status);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
  }
);

export const assignRiderToOrder = createAsyncThunk(
  'admin/assignRider',
  async ({ orderId, riderId }, { rejectWithValue }) => {
    try {
      const response = await orderApi.assignRider(orderId, riderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign rider');
    }
  }
);

// Category Thunks
export const fetchCategories = createAsyncThunk(
  'admin/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryApi.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

export const addCategory = createAsyncThunk(
  'admin/addCategory',
  async (name, { rejectWithValue }) => {
    try {
      const response = await categoryApi.create({ name });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add category');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'admin/updateCategory',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await categoryApi.update(id, { name });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update category');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'admin/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await categoryApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete category');
    }
  }
);

const initialState = {
  stats: {
    totalOrders: 1250,
    totalRevenue: 15400,
    totalUsers: 450,
    totalRiders: 25,
  },
  menuItems: [],
  categories: [],
  orders: [
    { id: 'ORD-1001', customerName: 'Alice Smith', status: 'Pending', total: 45.50, date: new Date().toISOString() },
    { id: 'ORD-1002', customerName: 'Bob Jones', status: 'Preparing', total: 32.00, date: new Date().toISOString() },
    { id: 'ORD-1003', customerName: 'Charlie Brown', status: 'Delivered', total: 15.75, date: new Date().toISOString() },
  ],
  users: [],
  riders: [],
  availableRiders: [],
  charts: {
    orderVolume: [],
    revenueStream: [],
  },
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setMenuItems: (state, action) => {
      state.menuItems = action.payload;
    },
    addMenuItem: (state, action) => {
      state.menuItems.push(action.payload);
    },
    updateMenuItem: (state, action) => {
      const index = state.menuItems.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.menuItems[index] = action.payload;
      }
    },
    deleteMenuItem: (state, action) => {
      state.menuItems = state.menuItems.filter(item => item.id !== action.payload);
    },
    setAllOrders: (state, action) => {
      state.orders = action.payload;
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(o => o.id === orderId);
      if (order) {
        order.status = status;
      }
    },
    setAllUsers: (state, action) => {
      state.users = action.payload;
    },
    setAllRiders: (state, action) => {
      state.riders = action.payload;
    },
    addRider: (state, action) => {
      state.riders.push(action.payload);
    },
    clearAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Category
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (payload.data && Array.isArray(payload.data)) {
          state.users = payload.data;
        } else if (payload.users && Array.isArray(payload.users)) {
          state.users = payload.users;
        } else if (Array.isArray(payload)) {
          state.users = payload;
        }
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update User Role
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const updatedUser = action.payload.user || action.payload;
        const index = state.users.findIndex(u => u._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u._id !== action.payload);
      })
      // Admin Stats
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        // Map backend response to state.stats
        const data = action.payload.data;
        if (data && data.stats) {
          state.stats = {
            totalOrders: data.stats.totalOrders ?? state.stats.totalOrders,
            totalRevenue: data.stats.totalRevenue ?? state.stats.totalRevenue,
            totalUsers: data.stats.totalUsers ?? state.stats.totalUsers,
            totalRiders: data.stats.activeRiders ?? state.stats.totalRiders, // API says activeRiders
          };
        }
        // Store chart data if needed
        if (data && data.charts) {
          state.charts = data.charts;
        }
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch All Orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (payload.data && Array.isArray(payload.data)) {
          state.orders = payload.data;
        } else if (payload.orders && Array.isArray(payload.orders)) {
          state.orders = payload.orders;
        } else if (Array.isArray(payload)) {
          state.orders = payload;
        }
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Order Status
      .addCase(updateOrderAdminStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload.order || action.payload;
        const index = state.orders.findIndex(o => o._id === updatedOrder._id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      })
      // Assign Rider
      .addCase(assignRiderToOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(assignRiderToOrder.fulfilled, (state, action) => {
        state.loading = false;
        // The backend returns the updated order in action.payload.data
        const updatedOrder = action.payload.data || action.payload.order || action.payload;
        
        // 1. Update order in list
        const index = state.orders.findIndex(o => o._id === updatedOrder._id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }

        // 2. Remove rider from available list real-time
        // Check if updatedOrder.rider exists and get its ID
        if (updatedOrder.rider) {
          const riderId = typeof updatedOrder.rider === 'string' 
            ? updatedOrder.rider 
            : updatedOrder.rider._id;
            
          console.log("Removing rider from available list:", riderId);
          // Filter out the assigned rider from the 'riders' state
          state.riders = state.riders.filter(r => r._id !== riderId);
        }
      })
      .addCase(assignRiderToOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch All Riders
      .addCase(fetchAllRiders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllRiders.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (payload.data && Array.isArray(payload.data)) {
          state.riders = payload.data;
        } else if (payload.riders && Array.isArray(payload.riders)) {
          state.riders = payload.riders;
        } else if (Array.isArray(payload)) {
          state.riders = payload;
        }
      })
      .addCase(fetchAllRiders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Available Riders
      .addCase(fetchAvailableRiders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAvailableRiders.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (payload.data && Array.isArray(payload.data)) {
          state.availableRiders = payload.data;
        } else if (payload.riders && Array.isArray(payload.riders)) {
          state.availableRiders = payload.riders;
        } else if (Array.isArray(payload)) {
          state.availableRiders = payload;
        }
      })
      .addCase(fetchAvailableRiders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Rider
      .addCase(createRider.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRider.fulfilled, (state, action) => {
        state.loading = false;
        const newRider = action.payload.rider || action.payload.data || action.payload;
        state.riders.unshift(newRider);
      })
      .addCase(createRider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Rider
      .addCase(deleteRider.fulfilled, (state, action) => {
        state.riders = state.riders.filter(rider => rider._id !== action.payload);
      });
  },
});

export const {
  setMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  setAllOrders,
  updateOrderStatus,
  setAllUsers,
  setAllRiders,
  addRider,
  clearAdminError,
} = adminSlice.actions;

export default adminSlice.reducer;
