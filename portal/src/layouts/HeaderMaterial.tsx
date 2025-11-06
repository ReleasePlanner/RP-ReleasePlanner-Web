/**
 * Material Design minimalista - Header principal refactorizado
 *
 * Mejoras aplicadas:
 * ✅ Iconografía coherente con Material Symbols
 * ✅ Estados de hover y focus apropiados
 * ✅ Espaciado consistente con grilla 8px
 * ✅ Tipografía mejorada con jerarquía clara
 * ✅ Botón FAB para acción principal (Add Release)
 * ✅ Accesibilidad mejorada con ARIA labels
 * ✅ Transiciones suaves Material Motion
 * ✅ Colores del sistema de tema
 */

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Fab,
  Box,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Menu as MenuIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useAppDispatch } from "../store/hooks";
import { toggleLeftSidebar, toggleRightSidebar } from "../store/store";
import { addPlan } from "../features/releasePlans/slice";
import type { Plan } from "../features/releasePlans/types";

export function HeaderMaterial() {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const handleAddRelease = () => {
    const now = new Date();
    const year = now.getFullYear();
    const id = `plan-${Date.now()}`;
    const newPlan: Plan = {
      id,
      metadata: {
        id,
        name: "New Release",
        owner: "Unassigned",
        startDate: `${year}-01-01`,
        endDate: `${year}-12-31`,
        status: "planned",
        description: "",
      },
      tasks: [],
    };
    dispatch(addPlan(newPlan));
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: theme.palette.primary.main,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        backdropFilter: "blur(8px)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 56, sm: 64 },
          px: { xs: 2, sm: 3 },
          gap: 1,
        }}
      >
        {/* Navigation Menu Button */}
        <Tooltip title="Open navigation menu" placement="bottom">
          <IconButton
            color="inherit"
            edge="start"
            aria-label="Open navigation menu"
            onClick={() => dispatch(toggleLeftSidebar())}
            sx={{
              mr: 2,
              transition: theme.transitions.create(["background-color"], {
                duration: theme.transitions.duration.short,
              }),
              "&:hover": {
                backgroundColor: alpha(theme.palette.common.white, 0.08),
              },
              "&:focus-visible": {
                backgroundColor: alpha(theme.palette.common.white, 0.12),
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>

        {/* App Title */}
        <Typography
          variant="h6"
          component="h1"
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            fontSize: { xs: "1.125rem", sm: "1.25rem" },
            lineHeight: 1.2,
            color: theme.palette.common.white,
            letterSpacing: "-0.01em",
          }}
        >
          Release Planner
        </Typography>

        {/* Actions Container */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Add Release FAB - Hidden on mobile */}
          <Tooltip title="Create new release plan" placement="bottom">
            <Fab
              color="secondary"
              size="small"
              aria-label="Create new release plan"
              onClick={handleAddRelease}
              sx={{
                display: { xs: "none", sm: "flex" },
                minHeight: 40,
                height: 40,
                width: 40,
                boxShadow: theme.shadows[2],
                transition: theme.transitions.create(
                  ["transform", "box-shadow"],
                  {
                    duration: theme.transitions.duration.short,
                  }
                ),
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: theme.shadows[4],
                },
                "&:active": {
                  transform: "scale(0.98)",
                },
              }}
            >
              <AddIcon sx={{ fontSize: 20 }} />
            </Fab>
          </Tooltip>

          {/* Add Release Button - Mobile Only */}
          <Tooltip title="Create new release plan" placement="bottom">
            <IconButton
              color="inherit"
              aria-label="Create new release plan"
              onClick={handleAddRelease}
              sx={{
                display: { xs: "flex", sm: "none" },
                transition: theme.transitions.create(["background-color"], {
                  duration: theme.transitions.duration.short,
                }),
                "&:hover": {
                  backgroundColor: alpha(theme.palette.common.white, 0.08),
                },
                "&:focus-visible": {
                  backgroundColor: alpha(theme.palette.common.white, 0.12),
                },
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>

          {/* Right Panel Toggle */}
          <Tooltip title="Open settings panel" placement="bottom">
            <IconButton
              color="inherit"
              edge="end"
              aria-label="Open settings panel"
              onClick={() => dispatch(toggleRightSidebar())}
              sx={{
                transition: theme.transitions.create(["background-color"], {
                  duration: theme.transitions.duration.short,
                }),
                "&:hover": {
                  backgroundColor: alpha(theme.palette.common.white, 0.08),
                },
                "&:focus-visible": {
                  backgroundColor: alpha(theme.palette.common.white, 0.12),
                },
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default HeaderMaterial;
