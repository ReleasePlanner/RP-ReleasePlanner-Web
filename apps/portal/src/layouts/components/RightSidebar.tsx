/**
 * Right Sidebar Component
 *
 * Manages the responsive right sidebar drawer.
 * Temporary on mobile/tablet, persistent on large screens.
 */

import { Box, Drawer } from "@mui/material";
import { RightDrawerContent, DRAWER_WIDTH } from "./RightDrawerContent";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleRightSidebar } from "../../store/store";

/**
 * RightSidebar Component
 *
 * Renders a responsive right sidebar with:
 * - Temporary modal drawer on xs/sm/md (mobile/tablet)
 * - Persistent drawer on lg+ (large screens)
 * - Context content from RightDrawerContent
 * - Proper state management and animations
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

  return (
    <Box
      component="aside"
      sx={{
        width: { lg: DRAWER_WIDTH },
        flexShrink: { lg: 0 },
      }}
    >
      {/* Temporary drawer on all but large */}
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
        <RightDrawerContent onClose={handleClose} />
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
        <RightDrawerContent onClose={handleClose} />
      </Drawer>
    </Box>
  );
}
