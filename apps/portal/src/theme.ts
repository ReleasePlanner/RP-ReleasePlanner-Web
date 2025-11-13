import {
  createTheme,
  type Theme,
  type ThemeOptions,
} from "@mui/material/styles";

const baseThemeOptions: ThemeOptions = {
  shape: { borderRadius: 8 },
  palette: {
    primary: {
      main: "#217346", // Excel green
      light: "#4fa676",
      dark: "#1b5c39",
    },
    secondary: {
      main: "#185ABD", // Office blue accent
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    ...baseThemeOptions.palette,
    mode: "light",
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
  },
});

export const darkTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    ...baseThemeOptions.palette,
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
});

export const theme = lightTheme;

export function getTheme(darkMode: boolean): Theme {
  return darkMode ? darkTheme : lightTheme;
}
