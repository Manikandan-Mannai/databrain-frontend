// src/redux/slices/dashboardSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/apiService";

interface Dashboard {
  _id: string;
  name: string;
  accessLevel: "public" | "private" | "shared";
  sharedWith?: string[];
  charts: Array<{
    chartId: {
      _id: string;
      title: string;
      type: string;
      config: any;
      layout: any;
    };
    layout: any;
  }>;
  createdAt: string;
}

interface DashboardState {
  list: Dashboard[];
  current: Dashboard | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: DashboardState = {
  list: [],
  current: null,
  status: "idle",
  error: null,
};

export const saveDashboard = createAsyncThunk(
  "dashboard/save",
  async (
    payload: {
      name: string;
      charts: Array<{ chartId: string; layout?: any }>;
      accessLevel?: "public" | "private" | "shared";
      sharedWith?: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post("/api/dashboard/save", payload);
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to save dashboard"
      );
    }
  }
);

export const fetchDashboards = createAsyncThunk(
  "dashboard/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/dashboard/list");
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboards"
      );
    }
  }
);

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchOne",
  async (id: string | undefined, { rejectWithValue }) => {
    try {
      if (!id || id === "undefined" || id === "null") {
        return rejectWithValue("Invalid dashboard ID provided");
      }
      const res = await api.get(`/api/dashboard/${id}`);
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard"
      );
    }
  }
);

export const updateDashboard = createAsyncThunk(
  "dashboard/update",
  async (
    payload: {
      id: string;
      name?: string;
      charts?: Array<{ chartId: string; layout?: any }>;
      accessLevel?: "public" | "private" | "shared";
      sharedWith?: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(`/api/dashboard/${payload.id}`, payload);
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update dashboard"
      );
    }
  }
);

export const deleteDashboard = createAsyncThunk(
  "dashboard/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/dashboard/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete dashboard"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrent: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveDashboard.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(saveDashboard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list.unshift(action.payload);
      })
      .addCase(saveDashboard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchDashboards.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDashboards.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchDashboards.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchDashboard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.current = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(updateDashboard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateDashboard.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.list.findIndex((d) => d._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
        if (state.current?._id === action.payload._id)
          state.current = action.payload;
      })
      .addCase(updateDashboard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(deleteDashboard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteDashboard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = state.list.filter((d) => d._id !== action.payload);
        if (state.current?._id === action.payload) state.current = null;
      })
      .addCase(deleteDashboard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrent } = dashboardSlice.actions;
export default dashboardSlice.reducer;
