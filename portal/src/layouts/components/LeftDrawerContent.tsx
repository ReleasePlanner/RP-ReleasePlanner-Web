/**
 * Left Drawer Navigation Content
 *
 * Displays the navigation menu with links to main sections.
 * Used in responsive left sidebar drawer.
 */

import {
  Box,
  Divider,
  Link,
  Tooltip,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch } from "../../store/hooks";
import { toggleLeftSidebar } from "../../store/store";

export const DRAWER_WIDTH = 260;

/**
 * Props for LeftDrawerContent component
 */
interface LeftDrawerContentProps {
  /**
   * Optional callback when close button is clicked.
   * If not provided, uses default dispatch action.
   */
  onClose?: () => void;
}

/**
 * LeftDrawerContent Component
 *
 * Renders the navigation drawer content including:
 * - Header with title and close button
 * - Navigation links (Release Planner, Products)
 * - Proper MUI styling and responsiveness
 *
 * @example
 * ```tsx
 * <LeftDrawerContent onClose={handleClose} />
 * ```
 */
export function LeftDrawerContent({ onClose }: LeftDrawerContentProps) {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const handleClose = onClose || (() => dispatch(toggleLeftSidebar()));

  return (
    <Box role="navigation" sx={{ width: DRAWER_WIDTH, height: "100%" }}>
      {/* Header Section */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Navigation
        </Typography>
        <Tooltip title="Hide sidebar" placement="right">
          <IconButton
            aria-label="Hide left sidebar"
            size="small"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider />

      {/* Navigation Links */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Link
          component={RouterLink}
          to="/release-planner"
          underline="none"
          sx={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: theme.palette.text.primary,
            transition: theme.transitions.create(["color", "fontWeight"]),
            "&:hover": {
              color: theme.palette.primary.main,
              fontWeight: 600,
            },
          }}
        >
          Release Planner
        </Link>
        <Link
          component={RouterLink}
          to="/product-maintenance"
          underline="none"
          sx={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: theme.palette.text.primary,
            transition: theme.transitions.create(["color", "fontWeight"]),
            "&:hover": {
              color: theme.palette.primary.main,
              fontWeight: 600,
            },
          }}
        >
          Products
        </Link>
        <Link
          component={RouterLink}
          to="/features"
          underline="none"
          sx={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: theme.palette.text.primary,
            transition: theme.transitions.create(["color", "fontWeight"]),
            "&:hover": {
              color: theme.palette.primary.main,
              fontWeight: 600,
            },
          }}
        >
          Features
        </Link>
      </Box>
    </Box>
  );
}
