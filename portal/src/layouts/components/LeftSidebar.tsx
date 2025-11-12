/**
 * Left Sidebar Component
 *
 * Manages the responsive left sidebar drawer with auto-close functionality.
 * Features:
 * - Temporary modal drawer on mobile (closes on backdrop click or ESC)
 * - Persistent drawer on desktop
 * - Auto-close when clicking on navigation items
 * - Smooth transitions and animations
 * - Proper state management and accessibility
 */

import { Box, Drawer, useTheme } from "@mui/material";
import { LeftDrawerContent, DRAWER_WIDTH } from "./LeftDrawerContent";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleLeftSidebar } from "../../store/store";

/**
 * LeftSidebar Component
 *
 * Renders a responsive sidebar with:
 * - Temporary modal drawer on xs/sm (mobile) with auto-close on click/backdrop
 * - Persistent drawer on md+ (desktop)
 * - Navigation content from LeftDrawerContent
 * - Auto-close handling through onClose callbacks
 * - Proper state management and animations
 *
 * Behavior:
 * - Mobile: Opens/closes with backdrop click, ESC key, or link click
 * - Desktop: Always visible, no auto-close
 *
 * @example
 * ```tsx
 * <LeftSidebar />
 * ```
 */
export function LeftSidebar() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const leftOpen = useAppSelector((s) => s.ui.leftSidebarOpen);

  /**
   * Handle closing the sidebar
   * Dispatches toggle action to close
   */
  const handleClose = () => dispatch(toggleLeftSidebar());

  return (
    <Box
      component="nav"
      sx={{
        width: { md: DRAWER_WIDTH },
        flexShrink: { md: 0 },
      }}
    >
      {/* Temporary drawer on mobile - Auto-closes */}
      <Drawer
        variant="temporary"
        open={leftOpen}
        onClose={handleClose}
        ModalProps={{
          keepMounted: true,
          disableAutoFocus: true,
          disableEnforceFocus: true,
          disableRestoreFocus: true,
          sx: {
            backdropFilter: "blur(4px)",
          },
        }}
        SlideProps={{
          direction: "left",
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <LeftDrawerContent onClose={handleClose} />
      </Drawer>

      {/* Persistent drawer on desktop - No auto-close */}
      <Drawer
        variant="persistent"
        open={leftOpen}
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            borderRight: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <LeftDrawerContent onClose={handleClose} />
      </Drawer>
    </Box>
  );
}
