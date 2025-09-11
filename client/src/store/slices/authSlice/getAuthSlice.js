import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";
import Cookies from "js-cookie";
import { initialState } from "./common";

// Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/api/v1/user/login", credentials);

      if (res.data?.userToken) {
        Cookies.set("userToken", res.data.userToken, {
          expires: 7,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        });
      }

      if (res.data?.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Login failed" });
    }
  }
);

// Logout
export const logoutUserAPI = createAsyncThunk(
  "auth/logoutUserAPI",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await axiosInstance.post("/api/v1/user/logout");
      dispatch(logoutUser());
      return true;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Logout failed" }
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      Cookies.remove("userToken");
      localStorage.removeItem("user");
    },
    restoreUser: (state) => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) state.user = JSON.parse(storedUser);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })
      .addCase(logoutUserAPI.rejected, (state, action) => {
        state.error = action.payload?.message || "Logout failed";
      });
  },
});

export const { logoutUser, restoreUser } = authSlice.actions;
export default authSlice.reducer;
