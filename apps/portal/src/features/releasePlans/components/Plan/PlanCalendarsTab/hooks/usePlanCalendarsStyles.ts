import { useMemo } from "react";
import { useTheme, alpha } from "@mui/material";

export type PlanCalendarsStyles = {
  isDark: boolean;
  getAddButtonStyles: () => {
    textTransform: string;
    fontSize: { xs: string; sm: string };
    fontWeight: number;
    px: { xs: number; sm: number };
    py: number;
    borderRadius: number;
    minHeight: number;
    borderColor: string;
    color: string;
    flexShrink: number;
    "&:hover": {
      borderColor: string;
      bgcolor: string;
    };
  };
  getDeleteButtonStyles: () => {
    fontSize: { xs: number; sm: number };
    p: { xs: number; sm: number };
    color: string;
    transition: string;
    "&:hover": {
      color: string;
      bgcolor: string;
    };
  };
  getCountryChipStyles: () => {
    height: { xs: number; sm: number };
    fontSize: { xs: string; sm: string };
    fontWeight: number;
    bgcolor: string;
    color: string;
    "& .MuiChip-label": {
      px: { xs: number; sm: number };
    };
  };
  getDaysChipStyles: () => {
    height: { xs: number; sm: number };
    fontSize: { xs: string; sm: string };
    fontWeight: number;
    bgcolor: string;
    color: string;
    "& .MuiChip-label": {
      px: { xs: number; sm: number };
    };
  };
};

export function usePlanCalendarsStyles(): PlanCalendarsStyles {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return useMemo(
    () => ({
      isDark,
      getAddButtonStyles: () => ({
        textTransform: "none",
        fontSize: { xs: "0.625rem", sm: "0.6875rem" },
        fontWeight: 500,
        px: { xs: 1, sm: 1.25 },
        py: 0.5,
        borderRadius: 1,
        minHeight: 26,
        borderColor: alpha(theme.palette.primary.main, 0.5),
        color: theme.palette.primary.main,
        flexShrink: 0,
        "&:hover": {
          borderColor: theme.palette.primary.main,
          bgcolor: alpha(theme.palette.primary.main, 0.08),
        },
      }),
      getDeleteButtonStyles: () => ({
        fontSize: { xs: 14, sm: 16 },
        p: { xs: 0.375, sm: 0.5 },
        color: theme.palette.text.secondary,
        transition: theme.transitions.create(["color", "background-color"], {
          duration: theme.transitions.duration.shorter,
        }),
        "&:hover": {
          color: theme.palette.error.main,
          bgcolor: alpha(theme.palette.error.main, 0.08),
        },
      }),
      getCountryChipStyles: () => ({
        height: { xs: 16, sm: 18 },
        fontSize: { xs: "0.5625rem", sm: "0.625rem" },
        fontWeight: 500,
        bgcolor: alpha(theme.palette.primary.main, 0.1),
        color: theme.palette.primary.main,
        "& .MuiChip-label": {
          px: { xs: 0.5, sm: 0.625 },
        },
      }),
      getDaysChipStyles: () => ({
        height: { xs: 16, sm: 18 },
        fontSize: { xs: "0.5625rem", sm: "0.625rem" },
        fontWeight: 500,
        bgcolor: alpha(theme.palette.info.main, 0.1),
        color: theme.palette.info.main,
        "& .MuiChip-label": {
          px: { xs: 0.5, sm: 0.625 },
        },
      }),
    }),
    [isDark, theme]
  );
}

