import { useMemo } from "react";
import { useTheme, alpha } from "@mui/material";

export type PhasesListStyles = {
  isDark: boolean;
  getAddButtonStyles: () => {
    color: string;
    "&:hover": {
      bgcolor: string;
    };
    "&:focus-visible": {
      bgcolor: string;
      outline: string;
      outlineOffset: number;
    };
  };
  getPaperStyles: (isLast: boolean) => {
    height: number;
    marginBottom: string | number;
    display: string;
    alignItems: string;
    borderRadius: number;
    overflow: string;
    bgcolor: string;
    border: string;
    transition: string;
    "&:hover": {
      bgcolor: string;
      borderColor: string;
      boxShadow: string;
    };
  };
  getAutoGenerateButtonStyles: () => {
    textTransform: string;
    fontSize: string;
    color: string;
    "&:hover": {
      bgcolor: string;
      color: string;
    };
    transition: string;
  };
};

export function usePhasesListStyles(): PhasesListStyles {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return useMemo(
    () => ({
      isDark,
      getAddButtonStyles: () => ({
        color: theme.palette.primary.main,
        "&:hover": {
          bgcolor: alpha(theme.palette.primary.main, isDark ? 0.08 : 0.04),
        },
        "&:focus-visible": {
          bgcolor: alpha(theme.palette.primary.main, isDark ? 0.12 : 0.08),
          outline: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
          outlineOffset: 2,
        },
      }),
      getPaperStyles: (isLast: boolean) => ({
        height: 0, // Will be set by TRACK_HEIGHT constant
        marginBottom: isLast ? 0 : 0, // Will be set by LANE_GAP constant
        display: "flex",
        alignItems: "stretch",
        borderRadius: 1.5,
        overflow: "visible",
        bgcolor: "transparent",
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          bgcolor: alpha(
            theme.palette.action.hover,
            isDark ? 0.06 : 0.04
          ),
          borderColor: alpha(theme.palette.divider, 0.2),
          boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, isDark ? 0.3 : 0.1)}`,
        },
      }),
      getAutoGenerateButtonStyles: () => ({
        textTransform: "none",
        fontSize: "0.75rem",
        color: isDark
          ? alpha(theme.palette.text.secondary, 0.8)
          : theme.palette.text.secondary,
        "&:hover": {
          bgcolor: isDark
            ? alpha(theme.palette.action.hover, 0.08)
            : alpha(theme.palette.action.hover, 0.05),
          color: theme.palette.primary.main,
        },
        transition: "all 0.2s ease",
      }),
    }),
    [isDark, theme]
  );
}

