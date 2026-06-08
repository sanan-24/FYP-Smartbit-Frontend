import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import favoriteApi from '../api/favorite';

export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await favoriteApi.getMyFavorites();
      // Backend returns ApiResponse with data field containing favorites
      // favorites are populated with product, so we might need to map them
      return response.data.map(fav => fav.product);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch favorites');
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  'favorites/toggleFavorite',
  async (product, { rejectWithValue }) => {
    try {
      const productId = product._id || product.id;
      await favoriteApi.toggleFavorite(productId);
      return product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle favorite');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

// Use the string name to avoid circular dependencies
const logoutAction = 'auth/logout/fulfilled';
const logoutReducerAction = 'auth/logout';

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavorites(state) {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const product = action.payload;
        const productId = product._id || product.id;
        const exists = state.items.find(i => (i._id || i.id) === productId);
        if (exists) {
          state.items = state.items.filter(i => (i._id || i.id) !== productId);
        } else {
          state.items.push(product);
        }
      })
      // Clear favorites on logout
      .addMatcher(
        (action) => action.type === logoutAction || action.type === logoutReducerAction,
        (state) => {
          state.items = [];
        }
      );
  },
});

export const { clearFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;

