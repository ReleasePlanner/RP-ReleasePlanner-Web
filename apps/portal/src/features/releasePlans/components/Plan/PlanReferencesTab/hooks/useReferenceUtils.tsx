import React from "react";
import { useTheme } from "@mui/material";
import {
  Link as LinkIcon,
  Description as DocumentIcon,
  Note as NoteIcon,
  Flag as MilestoneIcon,
} from "@mui/icons-material";
import type { PlanReferenceType } from "../../../../types";

export function useReferenceUtils() {
  const theme = useTheme();

  const getTypeIcon = (type: PlanReferenceType) => {
    switch (type) {
      case "link":
        return <LinkIcon sx={{ fontSize: 14 }} />;
      case "document":
        return <DocumentIcon sx={{ fontSize: 14 }} />;
      case "note":
        return <NoteIcon sx={{ fontSize: 14 }} />;
      case "milestone":
        return <MilestoneIcon sx={{ fontSize: 14 }} />;
    }
  };

  const getTypeColor = (type: PlanReferenceType) => {
    switch (type) {
      case "link":
        return theme.palette.info.main;
      case "document":
        return theme.palette.primary.main;
      case "note":
        return theme.palette.warning.main;
      case "comment":
        return theme.palette.info.main;
      case "file":
        return theme.palette.success.main;
      case "milestone":
        return theme.palette.error.main;
    }
  };

  const getTypeLabel = (type: PlanReferenceType) => {
    switch (type) {
      case "link":
        return "Link";
      case "document":
        return "Document";
      case "note":
        return "Note";
      case "milestone":
        return "Milestone";
    }
  };

  return {
    getTypeIcon,
    getTypeColor,
    getTypeLabel,
  };
}

