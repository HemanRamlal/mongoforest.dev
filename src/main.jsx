import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import axios from "axios";
import api from "./api/axios";
import { axiosErrToToast } from "./hooks/toastObjects.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { pushToast } from "./components/Toasts/Toasts.js";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: err => {
        if (axios.isAxiosError(err)) pushToast(axiosErrToToast(err));
      },
    },
    query: {
      onError: err => {
        if (axios.isAxiosError(err)) pushToast(axiosErrToToast(err));
      },
    },
  },
});
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
