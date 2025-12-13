// src/store/slices/camionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import camionService from '../services/camionService';

// Actions asynchrones
export const fetchCamions = createAsyncThunk(
  'camions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
         const response=await camionService.getAllCamions();
 
      return response;

    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCamionById = createAsyncThunk(
  'camions/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await camionService.getCamionById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createCamion = createAsyncThunk(
  'camions/create',
  async (camionData, { rejectWithValue }) => {
    try {
      return await camionService.createCamion(camionData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCamion = createAsyncThunk(
  'camions/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await camionService.updateCamion(id, data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCamion = createAsyncThunk(
  'camions/delete',
  async (id, { rejectWithValue }) => {
    try {
      await camionService.deleteCamion(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// initalise  
const initialState = {
  camions: [],
   pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
  selectedCamion: null,
  loading: false,
  error: null
};

// Slice
const camionSlice = createSlice({
  name: 'camions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedCamion: (state) => {
      state.selectedCamion = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all camions
      .addCase(fetchCamions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCamions.fulfilled, (state, action) => {
        state.loading = false;
        state.camions = action.payload.data;
        
  state.pagination = action.payload.pagination
      })
      .addCase(fetchCamions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch camion by   ID
      .addCase(fetchCamionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCamionById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCamion = action.payload;
      })
      .addCase(fetchCamionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create camion
      .addCase(createCamion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCamion.fulfilled, (state, action) => {
        state.loading = false;
        state.camions.push(action.payload);
      })
      .addCase(createCamion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update camion
      .addCase(updateCamion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCamion.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.camions.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.camions[index] = action.payload;
        }
      })
      .addCase(updateCamion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete camion
      .addCase(deleteCamion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCamion.fulfilled, (state, action) => {
        state.loading = false;
        state.camions = state.camions.filter(c => c._id !== action.payload);
      })
      .addCase(deleteCamion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSelectedCamion } = camionSlice.actions;
export default camionSlice.reducer;