import { useTheme } from "@mui/material";
import type { PlanReferenceType } from "../../../../../types";

export function useReferenceTypeColor(milestoneColor?: string) {
  const theme = useTheme();

  const getTypeColor = (refType: PlanReferenceType): string => {
    switch (refType) {
      case "link":
        return theme.palette.info.main;
      case "document":
        return theme.palette.primary.main;
      case "note":
        return theme.palette.warning.main;
      case "milestone":
        return milestoneColor || theme.palette.error.main;
    }
  };

  return { getTypeColor };
}

