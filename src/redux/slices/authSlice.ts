// src/features/auth/authSlice.ts
import {
  createAsyncThunk,
  createSlice
} from "@reduxjs/toolkit";
import api from "../../services/apiService";

export type Role = "admin" | "editor" | "viewer";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
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

interface AllUsersResponse {
  success: boolean;
  data: User[];
}

interface AuthState {
  currentUser: User | null;
  allUsers: User[];
  token: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  authenticated: boolean;
}

const initialState: AuthState = {
  currentUser: null,
  allUsers: [],
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
    const res = await api.post<AuthResponse>("/api/users/login", credentials);
    const data = res.data;
    if (data.success && data.data) {
      const user = {
        _id: data.data._id,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role as Role,
      };
      const token = data.data.token;
      const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
      localStorage.setItem("access_token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token_expiry", expiry.toString());
      return { user, token };
    }
    return rejectWithValue(data.message || "Login failed");
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message ?? "Network error");
  }
});

export const register = createAsyncThunk<
  AuthResponse,
  { name: string; email: string; password: string; role?: string },
  { rejectValue: string }
>("auth/register", async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post<AuthResponse>("/api/users/register", formData);
    return res.data.success
      ? res.data
      : rejectWithValue(res.data.message || "Registration failed");
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.message ?? "Network error");
  }
});

export const fetchProfile = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("auth/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<{ data: User }>("/api/users/profile");
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to fetch profile"
    );
  }
});

export const fetchAllUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>("auth/fetchAllUsers", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get<AllUsersResponse>("/api/users/all");
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to fetch users"
    );
  }
});

export const updateUserRole = createAsyncThunk<
  void,
  { userId: string; role: Role },
  { rejectValue: string }
>("auth/updateUserRole", async ({ userId, role }, { rejectWithValue }) => {
  try {
    await api.put("/api/users/role", { userId, role });
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to update role"
    );
  }
});

export const deleteUser = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("auth/deleteUser", async (userId, { rejectWithValue }) => {
  try {
    await api.delete(`/api/users/${userId}`);
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message ?? "Failed to delete user"
    );
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
        state.currentUser = JSON.parse(user);
        state.authenticated = true;
        state.status = "succeeded";
      } else {
        state.authenticated = false;
        state.status = "idle";
      }
    },
    logout: (state) => {
      state.currentUser = null;
      state.allUsers = [];
      state.token = null;
      state.authenticated = false;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = action.payload.user;
        state.token = action.payload.token;
        state.authenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.authenticated = false;
        state.error = action.payload || null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.authenticated = true;
        state.status = "succeeded";
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const { userId, role } = action.meta.arg;
        const u = state.allUsers.find((user) => user._id === userId);
        if (u) u.role = role;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const id = action.meta.arg;
        state.allUsers = state.allUsers.filter((u) => u._id !== id);
      });
  },
});

export const { logout, hydrate } = authSlice.actions;
export default authSlice.reducer;
