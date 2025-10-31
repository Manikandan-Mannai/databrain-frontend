import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import api from "../../services/apiService";

interface Chart {
  _id: string;
  title: string;
  type: "bar" | "line" | "pie";
  queryId: string;
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string[];
    }>;
  };
  userId: string;
}

interface ChartState {
  charts: Chart[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ChartState = {
  charts: [],
  status: "idle",
  error: null,
};

export const fetchChart = createAsyncThunk<
  Chart,
  string,
  { rejectValue: string }
>("chart/fetch", async (id, { rejectWithValue }) => {
  try {
    const res = await api.get<{ data: Chart }>(`/charts/${id}`);
    return res.data.data;
  } catch {
    return rejectWithValue("Failed to load chart");
  }
});

const chartSlice = createSlice({
  name: "chart",
  initialState,
  reducers: {
    updateChartOrder: (
      state,
      action: PayloadAction<{ dashboardId: string; chartIds: string[] }>
    ) => {
      // Handled in dashboard
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchChart.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.charts.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index >= 0) state.charts[index] = action.payload;
        else state.charts.push(action.payload);
      });
  },
});

export default chartSlice.reducer;
