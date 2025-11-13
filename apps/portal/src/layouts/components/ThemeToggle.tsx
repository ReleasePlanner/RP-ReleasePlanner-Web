/**
 * Theme Toggle Component
 *
 * Switch to toggle between light and dark mode.
 * Features:
 * - Smooth transitions
 * - Material UI compliant
 * - Redux state integration
 * - Accessibility support
 */

import { IconButton, Tooltip, useTheme, alpha } from "@mui/material";
import {
  Brightness7 as LightModeIcon,
  Brightness4 as DarkModeIcon,
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleDarkMode } from "../../store/store";

/**
 * ThemeToggle Component
 *
 * Renders a button to toggle between light and dark modes.
 * - Shows sun icon in light mode, moon icon in dark mode
 * - Smooth animations and transitions
 * - Tooltip for better UX
 * - Accessibility: ARIA labels, keyboard navigation
 *
 * @example
 * ```tsx
 * <ThemeToggle />
 * ```
 */
export function ThemeToggle() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const darkMode = useAppSelector((s) => s.ui.darkMode);

  const handleToggle = () => dispatch(toggleDarkMode());

  return (
    <Tooltip
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      placement="bottom"
      arrow
    >
      <IconButton
        color="inherit"
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        aria-pressed={darkMode}
        onClick={handleToggle}
        sx={{
          transition: theme.transitions.create(
            ["background-color", "transform"],
            {
              duration: theme.transitions.duration.shorter,
            }
          ),

          // Hover state
          "&:hover": {
            backgroundColor: alpha(theme.palette.common.white, 0.1),
            transform: "scale(1.05)",
          },

          // Focus visible state
          "&:focus-visible": {
            backgroundColor: alpha(theme.palette.common.white, 0.15),
            outline: `2px solid ${theme.palette.common.white}`,
            outlineOffset: "-2px",
          },

          // Active state
          "&:active": {
            transform: "scale(0.98)",
          },
        }}
      >
        {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
}
