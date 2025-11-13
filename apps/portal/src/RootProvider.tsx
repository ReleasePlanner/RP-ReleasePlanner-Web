/**
 * Root Provider Component
 *
 * Wraps the app with dynamic theme based on Redux state.
 * Listens to darkMode state and applies appropriate theme.
 */

import { useSelector } from "react-redux";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import type { RootState } from "./store/store";
import { getTheme } from "./theme";
import App from "./App";

export function RootProvider() {
  const darkMode = useSelector((state: RootState) => state.ui.darkMode);
  const currentTheme = getTheme(darkMode);

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
}
