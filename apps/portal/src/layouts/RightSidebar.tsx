import { Box, Divider, Drawer, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleRightSidebar } from "../store/store";

const DRAWER_WIDTH = 260;

/**
 * RightSidebar Component
 *
 * Responsive right sidebar with context panel.
 * Temporary modal drawer on mobile/tablet, persistent on large screens.
 *
 * Features:
 * - Context information and details display
 * - State-managed open/close
 * - Theme-aware styling
 * - Responsive layout (temporary on xs-md, persistent on lg+)
 *
 * @example
 * ```tsx
 * <RightSidebar />
 * ```
 */
export function RightSidebar() {
  const dispatch = useAppDispatch();
  const rightOpen = useAppSelector((s) => s.ui.rightSidebarOpen);

  const handleClose = () => dispatch(toggleRightSidebar());

  const rightDrawerContent = (
    <Box
      role="complementary"
      sx={{
        width: DRAWER_WIDTH,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
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
        <IconButton
          aria-label="Close context panel"
          size="small"
          onClick={handleClose}
          title="Close sidebar"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Divider />

      {/* Content */}
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Useful links, activity, filters, or details.
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      component="aside"
      sx={{ width: { lg: DRAWER_WIDTH }, flexShrink: { lg: 0 } }}
    >
      {/* Temporary drawer on mobile/tablet */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={rightOpen}
        onClose={handleClose}
        ModalProps={{
          keepMounted: true,
          disableAutoFocus: true,
          disableEnforceFocus: true,
          disableRestoreFocus: true,
        }}
        sx={{ display: { xs: "block", lg: "none" } }}
      >
        {rightDrawerContent}
      </Drawer>

      {/* Persistent drawer on large screens */}
      <Drawer
        variant="persistent"
        anchor="right"
        open={rightOpen}
        sx={{
          display: { xs: "none", lg: "block" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        {rightDrawerContent}
      </Drawer>
    </Box>
  );
}
