/**
 * Header Actions Component
 *
 * Manages header action buttons including theme toggle and settings.
 * Features:
 * - Minimalist, elegant design
 * - Theme toggle (light/dark mode)
 * - Opens right sidebar for settings
 * - Smooth transitions and micro-interactions
 * - Material UI 7 compliant
 * - Actions positioned at far right
 */

import { Box } from "@mui/material";
import { Settings as SettingsIcon } from "@mui/icons-material";
import { IconButton, Tooltip, useTheme, alpha } from "@mui/material";
import { useAppDispatch } from "../../store/hooks";
import { toggleRightSidebar } from "../../store/store";
import { ThemeToggle } from "./ThemeToggle";

/**
 * HeaderActions Component
 *
 * Renders header action buttons in order:
 * - Theme toggle button (light/dark mode)
 * - Settings button (right sidebar)
 * - Positioned at far right of header
 * - Responsive design with smooth transitions
 * - Accessibility: ARIA labels, keyboard navigation, tooltips
 *
 * Features:
 * - Elegant hover and focus states
 * - Theme toggle for light/dark mode
 * - Settings icon for secondary panel access
 * - Proper spacing and alignment
 *
 * @example
 * ```tsx
 * <HeaderActions />
 * ```
 */
export function HeaderActions() {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
      }}
    >
      {/* Theme Toggle Button */}
      <ThemeToggle />

      {/* Settings Button */}
      <Tooltip title="Open settings panel" placement="bottom" arrow>
        <IconButton
          color="inherit"
          edge="end"
          aria-label="Open settings panel"
          aria-expanded="false"
          onClick={() => dispatch(toggleRightSidebar())}
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
          <SettingsIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
