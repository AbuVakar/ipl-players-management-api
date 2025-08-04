import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// ✅ Step 1: Import React Query setup
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ✅ Step 2: Create QueryClient instance
const queryClient = new QueryClient();

// ✅ Step 3: Wrap App with QueryClientProvider
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
