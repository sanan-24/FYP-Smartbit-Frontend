import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authApi from '../api/auth';

const USER_STORAGE_KEY = 'smartbite_user';
const LEGACY_USER_STORAGE_KEY = 'mfc_user';

const getSavedUserFromStorage = () => {
  const currentUser = localStorage.getItem(USER_STORAGE_KEY);
  if (currentUser) return currentUser;

  const legacyUser = localStorage.getItem(LEGACY_USER_STORAGE_KEY);
  if (legacyUser) {
    localStorage.setItem(USER_STORAGE_KEY, legacyUser);
    localStorage.removeItem(LEGACY_USER_STORAGE_KEY);
  }
  return legacyUser;
};

const saveUserToStorage = (user) => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  localStorage.removeItem(LEGACY_USER_STORAGE_KEY);
};

const clearUserFromStorage = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(LEGACY_USER_STORAGE_KEY);
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authApi.login(credentials);
      // Extremely aggressive merge to catch fields from all possible levels
      const userData = {
        ...(data?.user || {}),
        ...(data?.data?.user || {}),
        ...(data?.data || {}),
        ...(data?.profile || {}),
        ...(data?.user?.profile || {}),
        ...data
      };
      
      // Cleanup non-user fields
      ['success', 'message', 'token', 'data', 'user', 'profile'].forEach(k => delete userData[k]);
      
      // Map common image field names
      if (!userData.profilePhoto) {
        userData.profilePhoto = userData.profilePic || userData.avatar || userData.image || userData.photo;
      }
      
      console.log('Processed User Data:', userData);
      return userData;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authApi.signup(userData);
      let user = { ...data };
      if (data?.user) user = { ...user, ...data.user };
      if (data?.data?.user) user = { ...user, ...data.data.user };
      if (data?.data && !data.data.user) user = { ...user, ...data.data };
      
      return user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authApi.getProfile();
      const userData = {
        ...(data?.user || {}),
        ...(data?.data?.user || {}),
        ...(data?.data || {}),
        ...(data?.profile || {}),
        ...(data?.user?.profile || {}),
        ...data
      };
      
      ['success', 'message', 'token', 'data', 'user', 'profile'].forEach(k => delete userData[k]);
      
      if (!userData.profilePhoto) {
        userData.profilePhoto = userData.profilePic || userData.avatar || userData.image || userData.photo;
      }
      
      return userData;
    } catch (error) {
      return rejectWithValue(null);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token, { rejectWithValue }) => {
    try {
      const data = await authApi.verifyEmail(token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Verification failed');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const data = await authApi.forgotPassword(email);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send reset email');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (resetData, { rejectWithValue }) => {
    try {
      const data = await authApi.resetPassword(resetData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const data = await authApi.updateProfile(profileData);
      const userData = data?.user || data?.data?.user || data?.data || data;
      
      // Fallback for profile image field names
      if (userData && !userData.profilePhoto && userData.profilePic) {
        userData.profilePhoto = userData.profilePic;
      }
      
      return userData;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

const savedUser = getSavedUserFromStorage();
const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  isAuthenticated: !!savedUser,
  loading: true, // Still true to allow checkAuthStatus to run
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      clearUserFromStorage();
    }
  },
  extraReducers: (builder) => {
    builder
      // Check Auth Status
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        saveUserToStorage(action.payload);
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        clearUserFromStorage();
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        saveUserToStorage(action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        clearUserFromStorage();
      })
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        saveUserToStorage(action.payload);
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        clearUserFromStorage();
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        clearUserFromStorage();
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        clearUserFromStorage();
      })
      // Profile update
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        // Merge with existing user data to preserve fields not returned by backend
        state.user = { ...state.user, ...action.payload };
        saveUserToStorage(state.user);
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
