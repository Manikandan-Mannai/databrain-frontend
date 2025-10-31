import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/apiService";
import type { Query, QueryFilter, QueryMetric } from "../../redux/types/index";

interface QueryState {
  queries: Query[];
  currentResult: any[] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: QueryState = {
  queries: [],
  currentResult: null,
  status: "idle",
  error: null,
};

export const runQuery = createAsyncThunk(
  "query/run",
  async (
    payload: {
      dataSourceId: string;
      name: string;
      config: {
        filters: QueryFilter[];
        groupBy?: string;
        metrics: QueryMetric[];
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post("api/queries/run", payload);
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to run query"
      );
    }
  }
);

export const fetchQueries = createAsyncThunk(
  "query/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("api/queries");
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch queries"
      );
    }
  }
);

const querySlice = createSlice({
  name: "query",
  initialState,
  reducers: {
    clearResult: (state) => {
      state.currentResult = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(runQuery.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(runQuery.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentResult = action.payload.result;
        state.queries.unshift({
          _id: action.payload.queryId,
          name: "",
          dataSourceId: "",
          config: { filters: [], metrics: [] },
          createdBy: "",
          result: action.payload.result,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      })
      .addCase(runQuery.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchQueries.fulfilled, (state, action) => {
        state.queries = action.payload;
      });
  },
});

export const { clearResult, clearError } = querySlice.actions;
export default querySlice.reducer;
