import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/apiService";

interface QueryCache {
  [queryId: string]: any[];
}

interface QueryState {
  currentResult: any[] | null;
  currentQueryId: string | null;
  cachedResults: QueryCache;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: QueryState = {
  currentResult: null,
  currentQueryId: null,
  cachedResults: {},
  status: "idle",
  error: null,
};

export const runQuery = createAsyncThunk(
  "query/run",
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/queries/run", payload);
      return res.data.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Server Error: Please try again";
      return rejectWithValue(message);
    }
  }
);

export const fetchQueryResult = createAsyncThunk(
  "query/fetchResult",
  async (queryId: string, { getState, rejectWithValue }) => {
    const { query } = getState() as { query: QueryState };

    if (query.cachedResults[queryId]) {
      return { queryId, result: query.cachedResults[queryId], cached: true };
    }

    try {
      const res = await api.get(`/api/queries/${queryId}`);
      return { queryId, result: res.data.data.result, cached: false };
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to load query result";
      return rejectWithValue(message);
    }
  }
);

const querySlice = createSlice({
  name: "query",
  initialState,
  reducers: {
    clearQueryResult: (state) => {
      state.currentResult = null;
      state.currentQueryId = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(runQuery.pending, (state) => {
        state.status = "loading";
        state.error = null;
        // keep currentResult visible to prevent flicker
      })
      .addCase(runQuery.fulfilled, (state, action) => {
        const result = action.payload.result || [];
        const queryId = action.payload.queryId || "temp";
        state.status = "succeeded";
        state.error = null;
        state.currentResult = result;
        state.currentQueryId = queryId;
        state.cachedResults[queryId] = result;
      })
      .addCase(runQuery.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to run query";
      })
      .addCase(fetchQueryResult.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchQueryResult.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.currentResult = action.payload.result;
        state.currentQueryId = action.payload.queryId;
        if (!action.payload.cached)
          state.cachedResults[action.payload.queryId] = action.payload.result;
      })
      .addCase(fetchQueryResult.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Failed to load query result";
      });
  },
});

export const { clearQueryResult } = querySlice.actions;
export default querySlice.reducer;
