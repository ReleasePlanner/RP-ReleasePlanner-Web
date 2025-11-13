import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { store } from "./store/store.ts";
import { queryClient } from "./api/queryClient.ts";
import { RootProvider } from "./RootProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RootProvider />
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
