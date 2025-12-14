import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import chauffeurService from "../services/chauffeurService";

// Async Thunks
export const fetchChauffeurs = createAsyncThunk(
  'chauffeurs/fetchAll',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await chauffeurService.getAllChauffeurs(page,limit);
      console.log("fetchChauffeurs response:", response);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const createChauffeur = createAsyncThunk(
  'chauffeurs/create',
  async (chauffeurData, { rejectWithValue }) => {
    try {
      console.log("Creating chauffeur with data:", chauffeurData);
      const response = await chauffeurService.createChauffeur(chauffeurData);
      console.log("createChauffeur response:", response);
      return response;
    } catch (error) {
      console.error("Error in createChauffeur:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const deleteChauffeur = createAsyncThunk(
  'chauffeurs/delete',
  async (chauffeurId, { rejectWithValue }) => {
    try {
      await chauffeurService.deleteChauffeur(chauffeurId);
      return chauffeurId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial State
const initialState = {
  chauffeurs: [],
  selectedChauffeur: null,
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
const chauffeurSlice = createSlice({
  name: 'chauffeurs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedChauffeur: (state) => {
      state.selectedChauffeur = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all chauffeurs
      .addCase(fetchChauffeurs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChauffeurs.fulfilled, (state, action) => {
        state.loading = false;
        console.log("fetchChauffeurs fulfilled payload:", action.payload);
        // L'API retourne response.data qui contient { data: [...], pagination: {...} }
        state.chauffeurs = action.payload.data || [];
        state.pagination = action.payload.pagination || initialState.pagination;
      })
      .addCase(fetchChauffeurs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    
      // Create chauffeur
      .addCase(createChauffeur.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChauffeur.fulfilled, (state, action) => {
        state.loading = false;
        console.log("createChauffeur fulfilled payload:", action.payload);
       
        const newChauffeur = action.payload;

          state.chauffeurs.push(newChauffeur);
          
      
      })
      .addCase(createChauffeur.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
    
      
      // Delete chauffeur
      .addCase(deleteChauffeur.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChauffeur.fulfilled, (state, action) => {
        state.loading = false;
        state.chauffeurs = state.chauffeurs.filter(c => c._id !== action.payload);
        state.pagination.totalItems = Math.max(0, state.pagination.totalItems - 1);
      })
      .addCase(deleteChauffeur.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSelectedChauffeur } = chauffeurSlice.actions;
export default chauffeurSlice.reducer;