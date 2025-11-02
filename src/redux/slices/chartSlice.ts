import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/apiService";

interface ChartState {
  charts: any[];
  currentChart: any | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ChartState = {
  charts: [],
  currentChart: null,
  status: "idle",
  error: null,
};

export const saveChart = createAsyncThunk(
  "charts/save",
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/charts/create", payload);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to save chart"
      );
    }
  }
);

export const fetchCharts = createAsyncThunk(
  "charts/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/charts/list");
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch charts"
      );
    }
  }
);

const chartSlice = createSlice({
  name: "charts",
  initialState,
  reducers: {
    clearCurrentChart: (state) => {
      state.currentChart = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveChart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveChart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentChart = action.payload;
        state.charts.push(action.payload);
      })
      .addCase(saveChart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchCharts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCharts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.charts = action.payload || [];
      })
      .addCase(fetchCharts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentChart } = chartSlice.actions;
export default chartSlice.reducer;
