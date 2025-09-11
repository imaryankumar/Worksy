"use client";

import QueryProvider from "@/app/providers/QueryProvider";
import { store } from "@/store/store";
import { Provider } from "react-redux";
import { Toaster } from "sonner";

export default function AppProviders({ children }) {
  return (
    <Provider store={store}>
      <QueryProvider>
        {children}
        <Toaster richColors position="top-center" />
      </QueryProvider>
    </Provider>
  );
}
