import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import remorqueService from "../services/remorqueService";

// Async Thunks
export const fetchRemorques = createAsyncThunk(
  'remorques/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await remorqueService.getAllRemorque();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchRemorqueById = createAsyncThunk(
  'remorques/fetchById',
  async (remorqueId, { rejectWithValue }) => {
    try {
      const response = await remorqueService.getRemorqueById(remorqueId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createRemorque = createAsyncThunk(
  'remorques/create',
  async (remorqueData, { rejectWithValue }) => {
    try {
      const response = await remorqueService.createRemorque(remorqueData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateRemorque = createAsyncThunk(
  'remorques/update',
  async ({ remorqueId, remorqueData }, { rejectWithValue }) => {
    try {
      const response = await remorqueService.updateRemorque(remorqueId, remorqueData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteRemorque = createAsyncThunk(
  'remorques/delete',
  async (remorqueId, { rejectWithValue }) => {
    try {
      const response = await remorqueService.deleteRemorque(remorqueId);
      return remorqueId; // Retourner l'ID pour le filtrage
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial State
const initialState = {
  remorques: [],
  selectedRemorque: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

// Slice
const remorqueSlice = createSlice({
  name: 'remorques',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedRemorque: (state) => {
      state.selectedRemorque = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all remorques
      .addCase(fetchRemorques.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRemorques.fulfilled, (state, action) => {
        state.loading = false;
        state.remorques = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchRemorques.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch remorque by ID
      .addCase(fetchRemorqueById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRemorqueById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRemorque = action.payload;
      })
      .addCase(fetchRemorqueById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create remorque
      .addCase(createRemorque.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRemorque.fulfilled, (state, action) => {
        state.loading = false;
        state.remorques.push(action.payload);
      })
      .addCase(createRemorque.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update remorque
      .addCase(updateRemorque.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRemorque.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.remorques.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.remorques[index] = action.payload;
        }
      })
      .addCase(updateRemorque.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete remorque
      .addCase(deleteRemorque.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRemorque.fulfilled, (state, action) => {
        state.loading = false;
        state.remorques = state.remorques.filter(r => r._id !== action.payload);
      })
      .addCase(deleteRemorque.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSelectedRemorque } = remorqueSlice.actions;
export default remorqueSlice.reducer;