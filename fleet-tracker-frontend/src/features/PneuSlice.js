// src/store/slices/pneuSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import pneuService from '../services/PneuService';

// Actions asynchrones
export const fetchPneus = createAsyncThunk(
  'pneus/fetchAll',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await pneuService.getAllPneus(page, limit);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPneuById = createAsyncThunk(
  'pneus/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await pneuService.getPneuById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createPneu = createAsyncThunk(
  'pneus/create',
  async (pneuData, { rejectWithValue }) => {
    try {
      return await pneuService.createPneu(pneuData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updatePneu = createAsyncThunk(
  'pneus/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await pneuService.updatePneu(id, data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deletePneu = createAsyncThunk(
  'pneus/delete',
  async (id, { rejectWithValue }) => {
    try {
      await pneuService.deletePneu(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  pneus: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  selectedPneu: null,
  loading: false,
  error: null,
};

// Slice
const pneuSlice = createSlice({
  name: 'pneus',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedPneu: (state) => {
      state.selectedPneu = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all pneus
      .addCase(fetchPneus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPneus.fulfilled, (state, action) => {
        state.loading = false;
        state.pneus = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPneus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch pneu by ID
      .addCase(fetchPneuById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPneuById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPneu = action.payload;
      })
      .addCase(fetchPneuById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create pneu
      .addCase(createPneu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPneu.fulfilled, (state, action) => {
        state.loading = false;
        state.pneus.push(action.payload);
      })
      .addCase(createPneu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update pneu
      .addCase(updatePneu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePneu.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.pneus.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.pneus[index] = action.payload;
        }
      })
      .addCase(updatePneu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete pneu
      .addCase(deletePneu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePneu.fulfilled, (state, action) => {
        state.loading = false;
        state.pneus = state.pneus.filter(p => p._id !== action.payload);
      })
      .addCase(deletePneu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSelectedPneu } = pneuSlice.actions;
export default pneuSlice.reducer;
