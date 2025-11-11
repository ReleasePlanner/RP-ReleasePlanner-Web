/**
 * Left Drawer Navigation Content
 *
 * Displays the navigation menu with links to main sections.
 * Features:
 * - Minimalist, elegant design with icons
 * - Active route indicator
 * - Smooth transitions and micro-interactions
 * - Material UI 7 compliant
 * - Full accessibility support
 */

import {
  Box,
  Button,
  Tooltip,
  IconButton,
  Typography,
  useTheme,
  alpha,
  useMediaQuery,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  Extension as FeaturesIcon,
  CalendarMonth as CalendarsIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useAppDispatch } from "../../store/hooks";
import { toggleLeftSidebar } from "../../store/store";

export const DRAWER_WIDTH = 260;

/**
 * Navigation item definition
 */
interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  description?: string;
}

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
 * Navigation items with icons and paths
 */
const NAV_ITEMS: NavItem[] = [
  {
    label: "Release Planner",
    path: "/release-planner",
    icon: <DashboardIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />,
    description: "Manage releases and timelines",
  },
  {
    label: "Products",
    path: "/product-maintenance",
    icon: <ProductsIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />,
    description: "Manage your products",
  },
  {
    label: "Features",
    path: "/features",
    icon: <FeaturesIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />,
    description: "Track features by product",
  },
  {
    label: "Calendars",
    path: "/calendars",
    icon: <CalendarsIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />,
    description: "Manage holidays and special days",
  },
  {
    label: "IT Owners",
    path: "/it-owners",
    icon: <PersonIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />,
    description: "Manage IT Owners",
  },
];

export function LeftDrawerContent({ onClose }: LeftDrawerContentProps) {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleClose = onClose || (() => dispatch(toggleLeftSidebar()));

  /**
   * Check if current route is active
   */
  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  /**
   * Handle navigation item click
   * On mobile, closes the drawer after navigation
   */
  const handleNavItemClick = (path: string) => {
    // Navigate first
    navigate(path);
    // Then close on mobile after a brief delay
    if (isMobile) {
      setTimeout(() => {
        handleClose();
      }, 50);
    }
  };

  return (
    <Box
      role="navigation"
      aria-label="Main navigation"
      sx={{
        width: DRAWER_WIDTH,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {/* Header Section - Minimalist */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography
          variant="caption"
          component="span"
          sx={{
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: theme.palette.text.secondary,
            fontSize: "0.7rem",
          }}
        >
          Menu
        </Typography>

        {/* Close button - Only on mobile */}
        {isMobile && (
          <Tooltip title="Close navigation" placement="left">
            <IconButton
              aria-label="Close navigation menu"
              size="small"
              onClick={handleClose}
              sx={{
                color: theme.palette.text.secondary,
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  color: theme.palette.primary.main,
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Navigation Links - Elegant Design */}
      <Box
        component="nav"
        sx={{
          flex: 1,
          p: 1.5,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
          overflow: "auto",
        }}
      >
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <Tooltip
              key={item.path}
              title={item.description}
              placement="right"
              arrow
            >
              <Button
                fullWidth
                startIcon={item.icon}
                onClick={() => handleNavItemClick(item.path)}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  fontSize: "0.938rem",
                  fontWeight: active ? 600 : 500,
                  padding: "10px 12px",
                  borderRadius: "8px",
                  transition: theme.transitions.create(
                    ["background-color", "color", "box-shadow"],
                    { duration: theme.transitions.duration.shorter }
                  ),
                  color: active
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
                  backgroundColor: active
                    ? alpha(theme.palette.primary.main, 0.08)
                    : "transparent",
                  border: active
                    ? `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                    : `1px solid transparent`,
                  position: "relative",
                  overflow: "hidden",

                  // Active indicator - left border
                  "&::before": active
                    ? {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: "3px",
                        backgroundColor: theme.palette.primary.main,
                      }
                    : undefined,

                  // Hover state
                  "&:hover": {
                    backgroundColor: active
                      ? alpha(theme.palette.primary.main, 0.12)
                      : alpha(theme.palette.primary.main, 0.05),
                    color: active
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                  },

                  // Focus visible state
                  "&:focus-visible": {
                    outline: `2px solid ${theme.palette.primary.main}`,
                    outlineOffset: "-2px",
                  },

                  // Icon color consistency
                  "& .MuiButton-startIcon": {
                    color: "inherit",
                    marginRight: "12px",
                  },
                }}
              >
                {item.label}
              </Button>
            </Tooltip>
          );
        })}
      </Box>

      {/* Footer - Optional branding or info */}
      <Box
        sx={{
          p: 1.5,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: alpha(theme.palette.primary.main, 0.02),
        }}
      >
        <Typography
          variant="caption"
          display="block"
          sx={{
            color: theme.palette.text.secondary,
            textAlign: "center",
            fontSize: "0.75rem",
            fontWeight: 500,
          }}
        >
          Release Planner v1.0
        </Typography>
      </Box>
    </Box>
  );
}
