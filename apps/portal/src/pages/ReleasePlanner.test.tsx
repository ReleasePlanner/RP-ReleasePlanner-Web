import { it, expect } from "vitest";
import { render, screen, fireEvent } from "../test/test-utils";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { ThemeProvider } from "@mui/material/styles";
import { releasePlansReducer } from "../features/releasePlans/slice";
import type { ReleasePlansState } from "../features/releasePlans/types";
import ReleasePlanner from "./ReleasePlanner";
import { theme } from "../theme";

function createStoreWithPlans(plansState: ReleasePlansState) {
  return configureStore({
    reducer: {
      releasePlans: releasePlansReducer,
      ui: (state = { leftSidebarOpen: false, rightSidebarOpen: false }) =>
        state,
    },
    preloadedState: {
      releasePlans: plansState,
      ui: { leftSidebarOpen: false, rightSidebarOpen: false },
    },
  });
}

function createDefaultStore() {
  return configureStore({
    reducer: {
      releasePlans: releasePlansReducer,
      ui: (state = { leftSidebarOpen: false, rightSidebarOpen: false }) =>
        state,
    },
  });
}

it("renders controls when plans exist and triggers expand/collapse actions", () => {
  const store = createDefaultStore();
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ReleasePlanner />
      </ThemeProvider>
    </Provider>
  );
  const expandAll = screen.getByRole("button", { name: /expand all/i });
  const collapseAll = screen.getByRole("button", { name: /collapse all/i });

  fireEvent.click(expandAll);
  fireEvent.click(collapseAll);
});

// Add release button removed per design

it("renders null when no plans exist", () => {
  const store = createStoreWithPlans({ plans: [] });
  const { container } = render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ReleasePlanner />
      </ThemeProvider>
    </Provider>
  );
  expect(container.firstChild).toBeNull();
});
