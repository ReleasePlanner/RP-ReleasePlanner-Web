/**
 * Material Design minimalista - PlanHeader refactorizado
 *
 * Mejoras aplicadas:
 * ✅ Iconografía coherente de Material Symbols
 * ✅ Estados visuales claros y consistentes
 * ✅ Animaciones suaves y apropiadas
 * ✅ Tipografía jerárquica Material Design
 * ✅ Accesibilidad mejorada (ARIA, keyboard navigation)
 * ✅ Espaciado basado en grilla 8px
 * ✅ Colores del sistema de tema
 */

import React from "react";
import {
  CardHeader,
  Typography,
  IconButton,
  Box,
  Chip,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import type { Theme } from "@mui/material";
import {
  ExpandMore,
  CheckCircleOutline,
  PlayCircleOutline,
  PauseCircleOutline,
} from "@mui/icons-material";

export type PlanStatus = "planned" | "in_progress" | "done" | "paused";

export interface PlanHeaderProps {
  name: string;
  status: PlanStatus;
  description?: string;
  expanded: boolean;
  onToggleExpanded: () => void;
}

interface StatusConfig {
  label: string;
  icon: React.ReactElement;
  color:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
  bgColor: string;
}

const getStatusConfig = (status: PlanStatus, theme: Theme): StatusConfig => {
  const configs: Record<PlanStatus, StatusConfig> = {
    planned: {
      label: "Planned",
      icon: <PauseCircleOutline sx={{ fontSize: 14 }} />,
      color: "default",
      bgColor: alpha(theme.palette.grey[500], 0.08),
    },
    in_progress: {
      label: "In Progress",
      icon: <PlayCircleOutline sx={{ fontSize: 14 }} />,
      color: "primary",
      bgColor: alpha(theme.palette.primary.main, 0.08),
    },
    done: {
      label: "Completed",
      icon: <CheckCircleOutline sx={{ fontSize: 14 }} />,
      color: "success",
      bgColor: alpha(theme.palette.success.main, 0.08),
    },
    paused: {
      label: "Paused",
      icon: <PauseCircleOutline sx={{ fontSize: 14 }} />,
      color: "warning",
      bgColor: alpha(theme.palette.warning.main, 0.08),
    },
  };

  return configs[status];
};

export function PlanHeader({
  name,
  status,
  description,
  expanded,
  onToggleExpanded,
}: PlanHeaderProps) {
  const theme = useTheme();
  const statusConfig = getStatusConfig(status, theme);

  return (
    <CardHeader
      sx={{
        px: 2,
        py: 1.5,
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        position: "sticky",
        top: 0,
        zIndex: 2,
        transition: theme.transitions.create(
          ["background-color", "border-color"],
          {
            duration: theme.transitions.duration.short,
          }
        ),
      }}
      title={
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}
        >
          {/* Título del plan */}
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 600,
              fontSize: "1.125rem",
              lineHeight: 1.3,
              color: theme.palette.text.primary,
              minWidth: 0,
              flex: 1,
            }}
          >
            {name}
          </Typography>

          {/* Status chip minimalista */}
          <Chip
            icon={statusConfig.icon}
            label={statusConfig.label}
            size="small"
            variant="filled"
            color={statusConfig.color}
            sx={{
              height: 24,
              fontSize: "0.75rem",
              fontWeight: 500,
              backgroundColor: statusConfig.bgColor,
              color:
                statusConfig.color === "default"
                  ? theme.palette.grey[700]
                  : (theme.palette[statusConfig.color] as { main: string })
                      .main,
              border: "none",
              "& .MuiChip-icon": {
                marginLeft: 0.5,
                marginRight: -0.25,
              },
            }}
          />
        </Box>
      }
      subheader={
        description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
              lineHeight: 1.4,
              fontSize: "0.875rem",
            }}
          >
            {description}
          </Typography>
        )
      }
      action={
        <Tooltip
          title={expanded ? "Collapse plan" : "Expand plan"}
          placement="top"
          arrow
        >
          <IconButton
            onClick={onToggleExpanded}
            aria-label={expanded ? "Collapse plan" : "Expand plan"}
            aria-expanded={expanded}
            size="medium"
            sx={{
              ml: 1,
              color: theme.palette.action.active,
              transition: theme.transitions.create(
                ["transform", "color", "background-color"],
                {
                  duration: theme.transitions.duration.short,
                }
              ),
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                color: theme.palette.primary.main,
              },
              "&:focus-visible": {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                color: theme.palette.primary.main,
              },
            }}
          >
            <ExpandMore />
          </IconButton>
        </Tooltip>
      }
    />
  );
}

export default PlanHeader;
