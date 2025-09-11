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

      // Store userToken
      if (res.data?.userToken) {
        Cookies.set("userToken", res.data.userToken, {
          expires: 7,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        });
      }

      // Store companyToken if available
      if (res.data?.companyToken) {
        Cookies.set("companyToken", res.data.companyToken, {
          expires: 7,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        });
      }

      // Store user data
      if (res.data?.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      // Store company data if available
      if (res.data?.company) {
        localStorage.setItem("company", JSON.stringify(res.data.company));
      }

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Login failed" });
    }
  }
);

// Company Registration
export const registerCompany = createAsyncThunk(
  "auth/registerCompany",
  async (registrationData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        "/api/v1/company/register",
        registrationData
      );

      // Store both tokens after successful registration
      if (res.data?.userToken) {
        Cookies.set("userToken", res.data.userToken, {
          expires: 7,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        });
      }

      if (res.data?.companyToken) {
        Cookies.set("companyToken", res.data.companyToken, {
          expires: 7,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        });
      }

      // Store user data (owner)
      if (res.data?.owner) {
        localStorage.setItem("user", JSON.stringify(res.data.owner));
      }

      // Store company data
      if (res.data?.company) {
        localStorage.setItem("company", JSON.stringify(res.data.company));
      }

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Registration failed" }
      );
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
      state.company = null;
      // Remove both tokens
      Cookies.remove("userToken");
      Cookies.remove("companyToken");
      // Remove stored data
      localStorage.removeItem("user");
      localStorage.removeItem("company");
    },
    restoreUser: (state) => {
      const storedUser = localStorage.getItem("user");
      const storedCompany = localStorage.getItem("company");

      if (storedUser) {
        state.user = JSON.parse(storedUser);
      }

      if (storedCompany) {
        state.company = JSON.parse(storedCompany);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        if (action.payload.company) {
          state.company = action.payload.company;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })
      // Registration cases
      .addCase(registerCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.loading = false;
        // Set user from owner data in registration response
        state.user = action.payload.owner;
        state.company = action.payload.company;
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
      })
      // Logout cases
      .addCase(logoutUserAPI.rejected, (state, action) => {
        state.error = action.payload?.message || "Logout failed";
      });
  },
});

export const { logoutUser, restoreUser } = authSlice.actions;
export default authSlice.reducer;
