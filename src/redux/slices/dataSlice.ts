import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/apiService";
import type { DataSource } from "../../redux/types/index";

interface PreviewData {
  columns: string[];
  rows: any[];
  totalRows: number;
  page?: number;
  totalPages?: number;
}

interface DataState {
  sources: DataSource[];
  preview: PreviewData | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: DataState = {
  sources: [],
  preview: null,
  status: "idle",
  error: null,
};

export const fetchDataSources = createAsyncThunk(
  "data/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/data");
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch data sources"
      );
    }
  }
);

export const uploadCSV = createAsyncThunk(
  "data/upload",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/data/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Upload failed");
    }
  }
);

export const deleteDataSource = createAsyncThunk(
  "data/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/data/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  }
);

export const fetchPreviewData = createAsyncThunk<
  PreviewData,
  { id: string; page?: number; limit?: number },
  { rejectValue: string }
>("data/preview", async ({ id, page = 1, limit = 15 }, { rejectWithValue }) => {
  try {
    const res = await api.get(
      `/api/data/preview/${id}?page=${page}&limit=${limit}`
    );
    return res.data as PreviewData;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch preview data"
    );
  }
});

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPreview: (state) => {
      state.preview = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataSources.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDataSources.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sources = action.payload;
      })
      .addCase(fetchDataSources.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(uploadCSV.pending, (state) => {
        state.status = "loading";
      })
      .addCase(uploadCSV.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sources.unshift(action.payload);
      })
      .addCase(uploadCSV.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(deleteDataSource.fulfilled, (state, action) => {
        state.sources = state.sources.filter((s) => s._id !== action.payload);
      })
      .addCase(deleteDataSource.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchPreviewData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPreviewData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.preview = action.payload;
      })
      .addCase(fetchPreviewData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearPreview } = dataSlice.actions;
export default dataSlice.reducer;
