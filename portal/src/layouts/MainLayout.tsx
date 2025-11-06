import type { PropsWithChildren } from "react";
import { useMemo } from "react";
import { Outlet, Link } from "react-router-dom";
import {
  Box,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleLeftSidebar, toggleRightSidebar } from "../store/store";
import HeaderMaterial from "./HeaderMaterial";

const drawerWidth = 260;

export function MainLayout({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch();
  const leftOpen = useAppSelector((s) => s.ui.leftSidebarOpen);
  const rightOpen = useAppSelector((s) => s.ui.rightSidebarOpen);

  const year = useMemo(() => new Date().getFullYear(), []);

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
          className="block text-sm hover:text-primary-600"
          to="/release-planner"
        >
          Release Planner
        </Link>
      </Box>
    </Box>
  );

  const rightDrawer = (
    <Box role="complementary" sx={{ width: drawerWidth }} className="h-full">
      <Box className="p-4 flex items-center justify-between">
        <span className="font-semibold text-primary-700">Context</span>
        <IconButton
          aria-label="Hide right sidebar"
          size="small"
          onClick={() => dispatch(toggleRightSidebar())}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Divider />
      <Box className="p-4 text-sm text-gray-600">
        Useful links, activity, filters, or details.
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        height: "100vh",
      }}
    >
      <CssBaseline />
      <HeaderMaterial />

      {/* Left Sidebar */
      /* Temporary on mobile, persistent on md+ */}
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

      {/* Main Content with Right Sidebar */}
      <Box
        component="main"
        sx={{
          ml: { md: leftOpen ? `${drawerWidth}px` : 0 },
          mr: { lg: rightOpen ? `${drawerWidth}px` : 0 },
          minHeight: 0,
        }}
      >
        <Container maxWidth="xl" className="py-6">
          {children ?? <Outlet />}
        </Container>
      </Box>

      {/* Right Sidebar */
      /* Temporary below lg, persistent on lg+ */}
      <Box
        component="aside"
        sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
      >
        {/* Temporary on all but large */}
        <Drawer
          variant="temporary"
          anchor="right"
          open={rightOpen}
          onClose={() => dispatch(toggleRightSidebar())}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block", lg: "none" } }}
        >
          {rightDrawer}
        </Drawer>
        {/* Persistent on large screens */}
        <Drawer
          variant="persistent"
          anchor="right"
          open={rightOpen}
          sx={{
            display: { xs: "none", lg: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {rightDrawer}
        </Drawer>
      </Box>

      {/* Footer */}
      <Box component="footer" className="border-t border-gray-200 bg-white">
        <Container
          maxWidth="xl"
          className="py-3 text-sm text-gray-600 flex items-center justify-between"
        >
          <span>© {year} Release Planner</span>
          <a className="hover:text-primary-600" href="#top">
            Back to top
          </a>
        </Container>
      </Box>
    </Box>
  );
}
