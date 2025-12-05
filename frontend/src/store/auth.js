import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    role: "user",
    token: null,
    user: null,
  },

  reducers: {
    login(state) {
      state.isLoggedIn = true;
    },

    logout(state) {
      state.isLoggedIn = false;
      state.token = null;
      state.user = null;
      localStorage.removeItem("auth");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
    },

    changeRole(state, action) {
      state.role = action.payload;
    },

    setCredentials(state, action) {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.role = action.payload.role || "user";
    },
  },
});

// named exports you already have
export const { login, logout, changeRole, setCredentials } = authSlice.actions;

// <-- ADD THIS (so import { authActions } works)
export const authActions = authSlice.actions;

export default authSlice.reducer;
