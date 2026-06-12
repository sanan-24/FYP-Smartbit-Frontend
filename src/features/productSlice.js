import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import categoryApi from '../api/category';
import productApi from '../api/product';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await productApi.getAll(params);
      return response.data; // Expected to be an array of products
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productApi.create(productData);
      return response.data; // Expected to be the new product object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await productApi.update(id, productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await productApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryApi.getAll();
      return response.data; // Expected to be an array of category objects
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

const initialState = {
  items: [],
  filteredItems: [],
  categories: [],
  selectedCategory: 'All',
  searchQuery: '',
  loading: false,
  error: null,
};

const applyFilters = (items, category, query) => {
  return items.filter(item => {
    const itemCategoryName = typeof item.categoryId === 'object' 
      ? item.categoryId?.name 
      : item.categoryId;
    
    const matchesCategory = category === 'All' || 
      (itemCategoryName && itemCategoryName.toLowerCase() === category.toLowerCase());
    
    const matchesSearch = item.name.toLowerCase().includes(query.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCategory(state, action) {
      state.selectedCategory = action.payload;
      state.filteredItems = applyFilters(state.items, action.payload, state.searchQuery);
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
      state.filteredItems = applyFilters(state.items, state.selectedCategory, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.filteredItems = applyFilters(action.payload, state.selectedCategory, state.searchQuery);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        // Refresh filtering if needed, or let the UI handle it
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        // Also update filteredItems
        const filteredIndex = state.filteredItems.findIndex(item => item._id === action.payload._id);
        if (filteredIndex !== -1) {
          state.filteredItems[filteredIndex] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload);
        state.filteredItems = state.filteredItems.filter(item => item._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Categories
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
      });
  },
});

export const { setCategory, setSearchQuery } = productSlice.actions;
export default productSlice.reducer;
