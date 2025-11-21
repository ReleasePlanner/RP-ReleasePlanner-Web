import { useMemo } from "react";
import { useTheme, alpha } from "@mui/material";

export type PhaseListItemStyles = {
  iconButtonBase: {
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
    padding: number;
    borderRadius: number;
    transition: string;
  };
  iconBase: {
    fontSize: number;
  };
  getEditButtonStyles: (isDark: boolean) => {
    color: string;
    "&:hover": {
      bgcolor: string;
      color: string;
    };
    "&:focus-visible": {
      bgcolor: string;
      color: string;
      outline: string;
    };
    "&:active": {
      transform: string;
      bgcolor: string;
    };
  };
  getViewButtonStyles: (isDark: boolean) => {
    color: string;
    "&:hover": {
      bgcolor: string;
      color: string;
    };
    "&:focus-visible": {
      bgcolor: string;
      color: string;
      outline: string;
    };
    "&:active": {
      transform: string;
      bgcolor: string;
    };
  };
  getDeleteButtonStyles: (isDark: boolean) => {
    color: string;
    "&:hover": {
      bgcolor: string;
      color: string;
    };
    "&:focus-visible": {
      bgcolor: string;
      color: string;
      outline: string;
    };
    "&:active": {
      transform: string;
      bgcolor: string;
    };
  };
};

export function usePhaseListItemStyles(): PhaseListItemStyles {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return useMemo(
    () => ({
      iconButtonBase: {
        width: 24,
        height: 24,
        minWidth: 24,
        minHeight: 24,
        padding: 0.25,
        borderRadius: 0,
        transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
      },
      iconBase: {
        fontSize: 14.5,
      },
      getEditButtonStyles: (dark: boolean) => ({
        color: alpha(theme.palette.text.secondary, 0.65),
        "&:hover": {
          bgcolor: alpha(theme.palette.primary.main, dark ? 0.12 : 0.08),
          color: theme.palette.primary.main,
        },
        "&:focus-visible": {
          bgcolor: alpha(theme.palette.primary.main, dark ? 0.16 : 0.12),
          color: theme.palette.primary.main,
          outline: "none",
        },
        "&:active": {
          transform: "scale(0.95)",
          bgcolor: alpha(theme.palette.primary.main, dark ? 0.2 : 0.15),
        },
      }),
      getViewButtonStyles: (dark: boolean) => ({
        color: alpha(theme.palette.text.secondary, 0.65),
        "&:hover": {
          bgcolor: alpha(theme.palette.info.main, dark ? 0.12 : 0.08),
          color: theme.palette.info.main,
        },
        "&:focus-visible": {
          bgcolor: alpha(theme.palette.info.main, dark ? 0.16 : 0.12),
          color: theme.palette.info.main,
          outline: "none",
        },
        "&:active": {
          transform: "scale(0.95)",
          bgcolor: alpha(theme.palette.info.main, dark ? 0.2 : 0.15),
        },
      }),
      getDeleteButtonStyles: (dark: boolean) => ({
        color: alpha(theme.palette.text.secondary, 0.65),
        "&:hover": {
          bgcolor: alpha(theme.palette.error.main, dark ? 0.12 : 0.08),
          color: theme.palette.error.main,
        },
        "&:focus-visible": {
          bgcolor: alpha(theme.palette.error.main, dark ? 0.16 : 0.12),
          color: theme.palette.error.main,
          outline: "none",
        },
        "&:active": {
          transform: "scale(0.95)",
          bgcolor: alpha(theme.palette.error.main, dark ? 0.2 : 0.15),
        },
      }),
    }),
    [theme]
  );
}

