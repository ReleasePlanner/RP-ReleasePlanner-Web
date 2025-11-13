/**
 * Right Drawer Context/Settings Content
 *
 * Displays contextual information, settings, or filters
 * in the right sidebar drawer.
 */

import {
  Box,
  Divider,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch } from "../../store/hooks";
import { toggleRightSidebar } from "../../store/store";

export const DRAWER_WIDTH = 260;

/**
 * Props for RightDrawerContent component
 */
interface RightDrawerContentProps {
  /**
   * Optional callback when close button is clicked.
   * If not provided, uses default dispatch action.
   */
  onClose?: () => void;
}

/**
 * RightDrawerContent Component
 *
 * Renders the right sidebar drawer content including:
 * - Header with title and close button
 * - Contextual information or settings
 * - Proper MUI styling and theme integration
 *
 * @example
 * ```tsx
 * <RightDrawerContent onClose={handleClose} />
 * ```
 */
export function RightDrawerContent({ onClose }: RightDrawerContentProps) {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const handleClose = onClose || (() => dispatch(toggleRightSidebar()));

  return (
    <Box role="complementary" sx={{ width: DRAWER_WIDTH, height: "100%" }}>
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
          Context
        </Typography>
        <Tooltip title="Hide sidebar" placement="right">
          <IconButton
            aria-label="Hide right sidebar"
            size="small"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider />

      {/* Content Section */}
      <Box
        sx={{
          p: 2,
          fontSize: "0.875rem",
          color: theme.palette.text.secondary,
        }}
      >
        Useful links, activity, filters, or details.
      </Box>
    </Box>
  );
}
