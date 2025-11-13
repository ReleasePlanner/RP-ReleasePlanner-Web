/**
 * Status configuration utilities for Material Design UI
 * Provides consistent status display configuration across components
 */

import { alpha } from "@mui/material";
import type { Theme } from "@mui/material";
import {
  CheckCircleOutline,
  PlayCircleOutline,
  PauseCircleOutline,
} from "@mui/icons-material";
import { LOCAL_PLAN_STATUS_LABELS } from "@/constants";
import type { LocalPlanStatusType } from "@/constants";

export interface StatusConfigUI {
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

/**
 * Get Material Design status configuration for a given status
 * Includes label, icon, color, and background color
 */
export function getStatusConfig(
  status: LocalPlanStatusType,
  theme: Theme
): StatusConfigUI {
  const configs: Record<LocalPlanStatusType, StatusConfigUI> = {
    planned: {
      label: LOCAL_PLAN_STATUS_LABELS.planned,
      icon: <PauseCircleOutline sx={{ fontSize: 14 }} />,
      color: "default",
      bgColor: alpha(theme.palette.grey[500], 0.08),
    },
    in_progress: {
      label: LOCAL_PLAN_STATUS_LABELS.in_progress,
      icon: <PlayCircleOutline sx={{ fontSize: 14 }} />,
      color: "primary",
      bgColor: alpha(theme.palette.primary.main, 0.08),
    },
    done: {
      label: LOCAL_PLAN_STATUS_LABELS.done,
      icon: <CheckCircleOutline sx={{ fontSize: 14 }} />,
      color: "success",
      bgColor: alpha(theme.palette.success.main, 0.08),
    },
    paused: {
      label: LOCAL_PLAN_STATUS_LABELS.paused,
      icon: <PauseCircleOutline sx={{ fontSize: 14 }} />,
      color: "warning",
      bgColor: alpha(theme.palette.warning.main, 0.08),
    },
  };

  return configs[status];
}
