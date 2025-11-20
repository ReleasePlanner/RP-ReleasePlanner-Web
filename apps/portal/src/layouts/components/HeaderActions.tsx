/**
 * Header Actions Component
 *
 * Manages header action buttons including theme toggle and settings.
 * Features:
 * - Minimalist, elegant design
 * - Theme toggle (light/dark mode)
 * - Opens right sidebar for settings
 * - Smooth transitions and micro-interactions
 * - Material UI 7 compliant
 * - Actions positioned at far right
 */

import { Box, Menu, MenuItem, Avatar, Typography, Divider } from "@mui/material";
import { Settings as SettingsIcon, Logout as LogoutIcon, Person as PersonIcon } from "@mui/icons-material";
import { IconButton, Tooltip, useTheme, alpha } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { toggleRightSidebar } from "../../store/store";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "../../api/hooks/useAuth";

/**
 * HeaderActions Component
 *
 * Renders header action buttons in order:
 * - Theme toggle button (light/dark mode)
 * - Settings button (right sidebar)
 * - Positioned at far right of header
 * - Responsive design with smooth transitions
 * - Accessibility: ARIA labels, keyboard navigation, tooltips
 *
 * Features:
 * - Elegant hover and focus states
 * - Theme toggle for light/dark mode
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
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleUserMenuClose();
    await logout();
    navigate('/auth/login');
  };

  const getUserInitials = () => {
    if (!user) return '?';
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user.username[0].toUpperCase();
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.username;
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
      }}
    >
      {/* Theme Toggle Button */}
      <ThemeToggle />

      {/* Settings Button */}
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

      {/* User Menu */}
      {user && (
        <>
          <Tooltip title="User menu" placement="bottom" arrow>
            <IconButton
              onClick={handleUserMenuClick}
              sx={{
                transition: theme.transitions.create(
                  ["background-color", "transform"],
                  {
                    duration: theme.transitions.duration.shorter,
                  }
                ),
                "&:hover": {
                  backgroundColor: alpha(theme.palette.common.white, 0.1),
                  transform: "scale(1.05)",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: alpha(theme.palette.common.white, 0.2),
                  color: theme.palette.common.white,
                  fontSize: '0.875rem',
                }}
              >
                {getUserInitials()}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleUserMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Box sx={{ px: 2, py: 1.5, minWidth: 200 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {getUserDisplayName()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.email}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                Rol: {user.role}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleUserMenuClose}>
              <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
              Perfil
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
              Sign Out
            </MenuItem>
          </Menu>
        </>
      )}
    </Box>
  );
}
