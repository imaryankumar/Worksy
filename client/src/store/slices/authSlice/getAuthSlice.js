import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";
import Cookies from "js-cookie";
import { initialState } from "./common";

// ✅ Login
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

      if (res.data?.companyToken) {
        Cookies.set("companyToken", res.data.companyToken, {
          expires: 7,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        });
      }

      if (res.data?.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      if (res.data?.company) {
        localStorage.setItem("company", JSON.stringify(res.data.company));
      }

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Login failed" });
    }
  }
);

// ✅ Company Registration
export const registerCompany = createAsyncThunk(
  "auth/registerCompany",
  async (registrationData, { rejectWithValue }) => {
    try {
      const { role, ...payload } = registrationData;
      const res = await axiosInstance.post(
        "/api/v1/companies/register",
        payload
      );

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

      if (res.data?.owner) {
        localStorage.setItem("user", JSON.stringify(res.data.owner));
      }

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

// ✅ Logout
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
      Cookies.remove("userToken");
      Cookies.remove("companyToken");
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
      // Login
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
      // Registration
      .addCase(registerCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.owner;
        state.company = action.payload.company;
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
      })
      // Logout
      .addCase(logoutUserAPI.rejected, (state, action) => {
        state.error = action.payload?.message || "Logout failed";
      });
  },
});

export const { logoutUser, restoreUser } = authSlice.actions;
export default authSlice.reducer;
