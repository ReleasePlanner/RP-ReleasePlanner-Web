import { useMemo } from "react";
import { useTheme, alpha, SxProps, Theme } from "@mui/material";

export function usePlanHeaderStyles() {
  const theme = useTheme();

  const headerStyles = useMemo<SxProps<Theme>>(
    () => ({
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
    }),
    [theme]
  );

  const idChipStyles = useMemo<SxProps<Theme>>(
    () => ({
      height: 24,
      fontSize: "0.6875rem",
      fontWeight: 600,
      letterSpacing: "0.02em",
      borderColor: alpha(theme.palette.divider, 0.4),
      color: theme.palette.text.secondary,
      backgroundColor: alpha(theme.palette.grey[500], 0.04),
      cursor: "help",
      flexShrink: 0,
    }),
    [theme]
  );

  const nameDisplayStyles = useMemo<SxProps<Theme>>(
    () => ({
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: 1.4,
      color: theme.palette.text.primary,
      minWidth: 0,
      maxWidth: "400px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      cursor: "pointer",
      px: 0.5,
      py: 0.25,
      borderRadius: 0.5,
      transition: theme.transitions.create("background-color", {
        duration: theme.transitions.duration.short,
      }),
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
      },
    }),
    [theme]
  );

  const nameInputStyles = useMemo<SxProps<Theme>>(
    () => ({
      minWidth: 120,
      maxWidth: "400px",
      "& .MuiInputBase-root": {
        fontSize: "1rem",
        fontWeight: 600,
        "&:before": {
          borderBottom: `2px solid ${theme.palette.primary.main}`,
        },
        "&:hover:not(.Mui-disabled):before": {
          borderBottom: `2px solid ${theme.palette.primary.main}`,
        },
      },
    }),
    [theme]
  );

  const expandButtonStyles = useMemo<SxProps<Theme>>(
    () => ({
      color: theme.palette.action.active,
      transition: theme.transitions.create(
        ["transform", "color", "background-color"],
        {
          duration: theme.transitions.duration.short,
        }
      ),
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        color: theme.palette.primary.main,
      },
      "&:focus-visible": {
        outline: `2px solid ${theme.palette.primary.main}`,
        outlineOffset: 2,
      },
    }),
    [theme]
  );

  return {
    headerStyles,
    idChipStyles,
    nameDisplayStyles,
    nameInputStyles,
    expandButtonStyles,
  };
}

