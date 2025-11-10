/**
 * Header Actions Component
 *
 * Manages the action buttons in the header (Add Release button, Settings).
 * Features:
 * - Minimalist, elegant design
 * - Responsive layout (FAB on desktop, icon button on mobile)
 * - Smooth transitions and micro-interactions
 * - Material UI 7 compliant
 */

import {
  Box,
  Fab,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Add as AddIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useAppDispatch } from "../../store/hooks";
import { toggleRightSidebar } from "../../store/store";
import { addPlan } from "../../features/releasePlans/slice";
import type { Plan } from "../../features/releasePlans/types";

/**
 * HeaderActions Component
 *
 * Renders header action buttons including:
 * - Add Release FAB (sm+) / IconButton (mobile)
 * - Settings/right sidebar toggle button
 * - Responsive design with smooth transitions
 * - Accessibility: ARIA labels, keyboard navigation, tooltips
 *
 * Features:
 * - Elegant hover and focus states
 * - Color-coded secondary action (Add Release)
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

  /**
   * Handle adding a new release plan
   */
  const handleAddRelease = () => {
    const now = new Date();
    const year = now.getFullYear();
    const id = `plan-${Date.now()}`;
    const newPlan: Plan = {
      id,
      metadata: {
        id,
        name: "New Release",
        owner: "Unassigned",
        startDate: `${year}-01-01`,
        endDate: `${year}-12-31`,
        status: "planned",
        description: "",
      },
      tasks: [],
    };
    dispatch(addPlan(newPlan));
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 0.5, sm: 1 },
      }}
    >
      {/* Add Release FAB - Hidden on mobile */}
      <Tooltip title="Create new release plan" placement="bottom" arrow>
        <Fab
          color="secondary"
          size="small"
          aria-label="Create new release plan"
          onClick={handleAddRelease}
          sx={{
            display: { xs: "none", sm: "flex" },
            minHeight: 40,
            height: 40,
            width: 40,
            boxShadow: theme.shadows[2],
            transition: theme.transitions.create(
              ["transform", "box-shadow", "background-color"],
              {
                duration: theme.transitions.duration.shorter,
              }
            ),

            // Hover state
            "&:hover": {
              transform: "scale(1.08)",
              boxShadow: theme.shadows[4],
              backgroundColor: theme.palette.secondary.dark,
            },

            // Active state
            "&:active": {
              transform: "scale(0.95)",
            },

            // Focus visible state
            "&:focus-visible": {
              outline: `2px solid ${theme.palette.secondary.main}`,
              outlineOffset: "2px",
            },
          }}
        >
          <AddIcon sx={{ fontSize: 20 }} />
        </Fab>
      </Tooltip>

      {/* Add Release Button - Mobile Only */}
      <Tooltip title="Create new release plan" placement="bottom" arrow>
        <IconButton
          color="inherit"
          aria-label="Create new release plan"
          onClick={handleAddRelease}
          sx={{
            display: { xs: "flex", sm: "none" },
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
          <AddIcon />
        </IconButton>
      </Tooltip>

      {/* Settings/Right Panel Toggle */}
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
