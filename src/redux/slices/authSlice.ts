import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    name: string;
    email: string;
    role: string;
    token: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  authenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: "idle",
  error: null,
  authenticated: false,
};

const isTokenValid = (): boolean => {
  const token = localStorage.getItem("access_token");
  const expiry = localStorage.getItem("token_expiry");
  return token && expiry ? Date.now() < Number(expiry) : false;
};

export const login = createAsyncThunk<
  { user: User; token: string },
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const res = await axios.post<AuthResponse>(
      `${BASE_URL}/api/users/login`,
      credentials,
      { headers: { "Content-Type": "application/json" } }
    );
    const data = res.data;
    if (data.success && data.data) {
      const user = {
        _id: data.data._id,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role as "admin" | "editor" | "viewer",
      };
      const token = data.data.token;
      const expiry = Date.now() + 60 * 60 * 1000;
      localStorage.setItem("access_token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token_expiry", expiry.toString());
      return { user, token };
    } else {
      return rejectWithValue(data.message || "Login failed");
    }
  } catch (error: any) {
    const msg = error?.response?.data?.message ?? "Network error";
    return rejectWithValue(msg);
  }
});

export const register = createAsyncThunk<
  AuthResponse,
  { name: string; email: string; password: string; role?: string },
  { rejectValue: string }
>("auth/register", async (formData, { rejectWithValue }) => {
  try {
    const res = await axios.post<AuthResponse>(
      `${BASE_URL}/api/users/register`,
      formData,
      { headers: { "Content-Type": "application/json" } }
    );
    const data = res.data;
    if (data.success) {
      return data;
    } else {
      return rejectWithValue(data.message || "Registration failed");
    }
  } catch (error: any) {
    const msg = error?.response?.data?.message ?? "Network error";
    return rejectWithValue(msg);
  }
});

export const fetchProfile = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("auth/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("No token found");
    const res = await axios.get(`${BASE_URL}/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.user;
  } catch (error: any) {
    const msg = error?.response?.data?.message ?? "Failed to fetch profile";
    return rejectWithValue(msg);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrate: (state) => {
      const token = localStorage.getItem("access_token");
      const user = localStorage.getItem("user");
      if (token && user && isTokenValid()) {
        state.token = token;
        state.user = JSON.parse(user);
        state.authenticated = true;
        state.status = "succeeded";
      } else {
        state.authenticated = false;
        state.status = "idle";
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.authenticated = false;
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("token_expiry");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.authenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.authenticated = false;
        state.error = action.payload || null;
      })
      .addCase(register.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.authenticated = true;
        state.status = "succeeded";
      });
  },
});

export const { logout, hydrate } = authSlice.actions;
export default authSlice.reducer;
