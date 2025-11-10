import { Box, Divider, Drawer, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleLeftSidebar } from "../store/store";

const drawerWidth = 260;

export function LeftSidebar() {
  const dispatch = useAppDispatch();
  const leftOpen = useAppSelector((s) => s.ui.leftSidebarOpen);

  const leftDrawer = (
    <Box role="navigation" sx={{ width: drawerWidth }} className="h-full">
      <Box className="p-4 flex items-center justify-between">
        <span className="font-semibold text-primary-700">Navigation</span>
        <IconButton
          aria-label="Hide left sidebar"
          size="small"
          onClick={() => dispatch(toggleLeftSidebar())}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Divider />
      <Box className="p-4 space-y-2">
        <Link
          className="block text-sm font-medium text-slate-700 hover:text-primary-600 hover:font-semibold transition-colors"
          to="/release-planner"
        >
          Release Planner
        </Link>
        <Link
          className="block text-sm font-medium text-slate-700 hover:text-primary-600 hover:font-semibold transition-colors"
          to="/product-maintenance"
        >
          Products
        </Link>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {/* Temporary on mobile */}
      <Drawer
        variant="temporary"
        open={leftOpen}
        onClose={() => dispatch(toggleLeftSidebar())}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        {leftDrawer}
      </Drawer>
      {/* Persistent on desktop */}
      <Drawer
        variant="persistent"
        open={leftOpen}
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {leftDrawer}
      </Drawer>
    </Box>
  );
}
