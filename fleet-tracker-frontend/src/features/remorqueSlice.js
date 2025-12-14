import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import remorqueService from "../services/remorqueService";

// Async Thunks
export const fetchRemorques = createAsyncThunk(
  'remorques/fetchAll',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await remorqueService.getAllRemorque(page,limit);
      console.log("fetchRemorques response:", response);
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
      console.log("Creating remorque with data:", remorqueData);
      const response = await remorqueService.createRemorque(remorqueData);
      console.log("createRemorque response:", response);
      return response;
    } catch (error) {
      console.error("Error in createRemorque:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateRemorque = createAsyncThunk(
  'remorques/update',
  async ({ id, data }, { rejectWithValue }) => {  
    try {
      console.log("Update remorque - ID:", id, "Data:", data);
      const response = await remorqueService.updateRemorque(id, data);
      console.log("updateRemorque response:", response);
      return response;
    } catch (error) {
      console.error("Error in updateRemorque thunk:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteRemorque = createAsyncThunk(
  'remorques/delete',
  async (remorqueId, { rejectWithValue }) => {
    try {
      await remorqueService.deleteRemorque(remorqueId);
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
        console.log("fetchRemorques fulfilled payload:", action.payload);
        // L'API retourne response.data qui contient { data: [...], pagination: {...} }
        state.remorques = action.payload.data || [];
        state.pagination = action.payload.pagination || initialState.pagination;
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
        state.selectedRemorque = action.payload.data || action.payload;
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
        console.log("createRemorque fulfilled payload:", action.payload);
        // Le service retourne response.data.data (la nouvelle remorque)
        const newRemorque = action.payload;
        if (newRemorque && newRemorque._id) {
          state.remorques.push(newRemorque);
          state.pagination.totalItems += 1;
        } else {
          console.error("Invalid remorque data received:", newRemorque);
        }
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
        console.log("updateRemorque fulfilled payload:", action.payload);
        // Le service retourne response.data.data (la remorque mise à jour)
        const updatedRemorque = action.payload;
        if (updatedRemorque && updatedRemorque._id) {
          const index = state.remorques.findIndex(r => r._id === updatedRemorque._id);
          if (index !== -1) {
            state.remorques[index] = updatedRemorque;
          }
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
        state.pagination.totalItems = Math.max(0, state.pagination.totalItems - 1);
      })
      .addCase(deleteRemorque.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSelectedRemorque } = remorqueSlice.actions;
export default remorqueSlice.reducer;