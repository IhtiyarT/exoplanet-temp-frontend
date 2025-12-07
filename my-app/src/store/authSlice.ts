import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../api";

interface User {
  user_id: number;
  login: string;
  role: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

let parsedUser: User | null = null;
try {
  const rawUser = localStorage.getItem("user");
  if (rawUser && rawUser !== "undefined" && rawUser !== "null") {
    parsedUser = JSON.parse(rawUser);
  }
} catch {
  parsedUser = null;
}


const initialState: AuthState = {
  user: parsedUser,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

export const login = createAsyncThunk<
  { token: string; user: User },
  { login: string; password: string },
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.api.userLoginCreate(credentials);
    const token = response.data.token;
    const user = response.data.user;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    return { token, user };
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "Ошибка входа. Проверьте логин и пароль.";

    return rejectWithValue(errorMessage);
  }
});

export const logout = createAsyncThunk("auth/logout", async (_, { getState }) => {
  const state = getState() as { auth: AuthState };
  if (state.auth.token) {
    try {
      await api.api.userLogoutCreate();
    } catch { /* empty */ }
  }
  localStorage.removeItem("token");
  localStorage.removeItem("user");
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    restoreAuth: (state) => {
      if (state.token) {
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка входа";
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      });
  },
});

export const { restoreAuth } = authSlice.actions;
export default authSlice.reducer;