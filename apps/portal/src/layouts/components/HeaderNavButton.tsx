/**
 * Header Navigation Menu Button
 *
 * Elegant hamburger menu button for opening/closing the left sidebar.
 * Features:
 * - Minimalist design
 * - Smooth transitions
 * - Accessibility compliant
 * - Micro-interactions (hover, focus, active states)
 */

import { IconButton, Tooltip, useTheme, alpha } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useAppDispatch } from "../../store/hooks";
import { toggleLeftSidebar } from "../../store/store";

/**
 * HeaderNavButton Component
 *
 * Renders the hamburger menu button to toggle the left sidebar with:
 * - Minimalist design with smooth transitions
 * - Tooltip on hover for better UX
 * - Proper theme colors and Material UI patterns
 * - Redux dispatch integration
 * - Accessibility: ARIA labels, keyboard navigation
 *
 * @example
 * ```tsx
 * <HeaderNavButton />
 * ```
 */
export function HeaderNavButton() {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const handleClick = () => dispatch(toggleLeftSidebar());

  return (
    <Tooltip title="Open navigation menu" placement="bottom" arrow>
      <IconButton
        color="inherit"
        edge="start"
        aria-label="Open navigation menu"
        aria-expanded="false"
        onClick={handleClick}
        sx={{
          transition: theme.transitions.create(
            ["background-color", "transform"],
            {
              duration: theme.transitions.duration.shorter,
            }
          ),
          // Base state
          background: alpha(theme.palette.common.white, 0),

          // Hover state
          "&:hover": {
            backgroundColor: alpha(theme.palette.common.white, 0.1),
            transform: "scale(1.05)",
          },

          // Focus visible state (keyboard navigation)
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
        <MenuIcon />
      </IconButton>
    </Tooltip>
  );
}
