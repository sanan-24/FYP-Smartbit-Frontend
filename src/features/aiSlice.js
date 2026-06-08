import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import aiApi from '../api/ai';

export const fetchAISuggestions = createAsyncThunk(
  'ai/fetchSuggestions',
  async (query, { rejectWithValue }) => {
    try {
      const response = await aiApi.getSuggestions(query);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get AI suggestions');
    }
  }
);

const initialState = {
  chatHistory: [], // [{ role: 'user', content: '...' }, { role: 'ai', content: '...' }]
  loading: false,
  error: null,
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.chatHistory.push(action.payload);
    },
    clearSuggestions: (state) => {
      state.chatHistory = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAISuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAISuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.chatHistory.push({
          role: 'ai',
          content: action.payload.suggestion || action.payload.data || action.payload
        });
      })
      .addCase(fetchAISuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSuggestions, addMessage } = aiSlice.actions;
export default aiSlice.reducer;
