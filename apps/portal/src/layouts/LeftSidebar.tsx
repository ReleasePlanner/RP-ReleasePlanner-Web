import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Link as RouterLink } from "react-router-dom";
import { Link as MuiLink } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { toggleLeftSidebar } from "../store/store";

const DRAWER_WIDTH = 260;

/**
 * LeftSidebar Component
 *
 * Responsive left sidebar with navigation links.
 * Temporary modal drawer on mobile, persistent on desktop.
 *
 * Features:
 * - Navigation to Release Planner and Products
 * - State-managed open/close
 * - Theme-aware styling
 * - Responsive layout
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

  const handleClose = () => dispatch(toggleLeftSidebar());

  const navLinks = [
    { to: "/release-planner", label: "Release Planner" },
    { to: "/product-maintenance", label: "Products" },
    { to: "/features", label: "Features" },
    { to: "/calendars", label: "Calendars" },
    { to: "/it-owners", label: "IT Owners" },
  ];

  console.log("LeftSidebar navLinks:", navLinks);

  const leftDrawerContent = (
    <Box
      role="navigation"
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
          Navigation
        </Typography>
        <IconButton
          aria-label="Close navigation"
          size="small"
          onClick={handleClose}
          title="Close sidebar"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Divider />

      {/* Navigation Links */}
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
        {navLinks.map((link) => (
          <MuiLink
            key={link.to}
            component={RouterLink}
            to={link.to}
            sx={{
              textDecoration: "none",
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
            {link.label}
          </MuiLink>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
    >
      {/* Temporary drawer on mobile */}
      <Drawer
        variant="temporary"
        open={leftOpen}
        onClose={handleClose}
        ModalProps={{
          keepMounted: true,
          disableAutoFocus: true,
          disableEnforceFocus: true,
          disableRestoreFocus: true,
        }}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        {leftDrawerContent}
      </Drawer>

      {/* Persistent drawer on desktop */}
      <Drawer
        variant="persistent"
        open={leftOpen}
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        {leftDrawerContent}
      </Drawer>
    </Box>
  );
}
