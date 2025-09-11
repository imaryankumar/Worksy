import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice/getAuthSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
