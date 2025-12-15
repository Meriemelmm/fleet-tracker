// src/store/slices/trajetSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import trajetService from '../services/trajetService';

// --- Actions asynchrones ---

export const fetchAllTrajets = createAsyncThunk(
  'trajets/fetchAll',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await trajetService.getAllTrajets(page, limit);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMesTrajets = createAsyncThunk(
  'trajets/fetchMes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await trajetService.getMesTrajets();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTrajetById = createAsyncThunk(
  'trajets/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await trajetService.getTrajetById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createTrajet = createAsyncThunk(
  'trajets/create',
  async (trajetData, { rejectWithValue }) => {
    try {
      return await trajetService.createTrajet(trajetData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateTrajet = createAsyncThunk(
  'trajets/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await trajetService.updateTrajet(id, data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateMonTrajet = createAsyncThunk(
  'trajets/updateMon',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await trajetService.updateMonTrajet(id, data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteTrajet = createAsyncThunk(
  'trajets/delete',
  async (id, { rejectWithValue }) => {
    try {
      await trajetService.deleteTrajet(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// --- Initial state ---
const initialState = {
  trajets: [],
  mesTrajets: [],
  selectedTrajet: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalTrajets: 0,
    hasNext: false,
    hasPrev: false,
  },
  loading: false,
  error: null,
};

// --- Slice ---
const trajetSlice = createSlice({
  name: 'trajets',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedTrajet: (state) => {
      state.selectedTrajet = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all trajets (admin)
      .addCase(fetchAllTrajets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTrajets.fulfilled, (state, action) => {
        state.loading = false;
        state.trajets = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllTrajets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch mes trajets (chauffeur)
      .addCase(fetchMesTrajets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMesTrajets.fulfilled, (state, action) => {
        state.loading = false;
        state.mesTrajets = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMesTrajets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch trajet by ID
      .addCase(fetchTrajetById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrajetById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTrajet = action.payload;
      })
      .addCase(fetchTrajetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create trajet
      .addCase(createTrajet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTrajet.fulfilled, (state, action) => {
        state.loading = false;
        state.trajets.push(action.payload);
      })
      .addCase(createTrajet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update trajet (admin)
      .addCase(updateTrajet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTrajet.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.trajets.findIndex(t => t._id === action.payload._id);
        if (index !== -1) state.trajets[index] = action.payload;
      })
      .addCase(updateTrajet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update trajet (chauffeur)
      .addCase(updateMonTrajet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMonTrajet.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.mesTrajets.findIndex(t => t._id === action.payload._id);
        if (index !== -1) state.mesTrajets[index] = action.payload;
      })
      .addCase(updateMonTrajet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete trajet
      .addCase(deleteTrajet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTrajet.fulfilled, (state, action) => {
        state.loading = false;
        state.trajets = state.trajets.filter(t => t._id !== action.payload);
      })
      .addCase(deleteTrajet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
}); 
export const { clearError, clearSelectedTrajet } = trajetSlice.actions;
export default trajetSlice.reducer;