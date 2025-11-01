import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/apiService";

interface QueryState {
  currentResult: any[] | null;
  currentQueryId: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: QueryState = {
  currentResult: null,
  currentQueryId: null,
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
      return rejectWithValue(
        error.response?.data?.message || "Failed to run query"
      );
    }
  }
);

export const fetchQueryResult = createAsyncThunk(
  "query/fetchResult",
  async (queryId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/queries/${queryId}`);
      return { queryId, result: res.data.data.result };
    } catch {
      return rejectWithValue("Failed to load query result");
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(runQuery.pending, (state) => {
        state.status = "loading";
      })
      .addCase(runQuery.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentResult = action.payload.result || [];
        state.currentQueryId = action.payload.queryId || null;
      })
      .addCase(runQuery.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchQueryResult.fulfilled, (state, action) => {
        state.currentResult = action.payload.result;
        state.currentQueryId = action.payload.queryId;
      });
  },
});

export const { clearQueryResult } = querySlice.actions;
export default querySlice.reducer;
