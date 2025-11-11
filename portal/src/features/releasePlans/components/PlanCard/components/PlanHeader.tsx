import { useState } from "react";
import {
  IconButton,
  Box,
  Chip,
  Tooltip,
  TextField,
  useTheme,
  alpha,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

export type PlanHeaderProps = {
  id: string;
  name: string;
  expanded: boolean;
  onToggleExpanded: () => void;
  onNameChange?: (name: string) => void;
};

/**
 * Header component for PlanCard
 * Displays Plan ID, editable Plan Name, and expand/collapse button
 * All other controls are in the Common Data tab
 */
export function PlanHeader({
  id,
  name,
  expanded,
  onToggleExpanded,
  onNameChange,
}: PlanHeaderProps) {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(name);

  const handleSave = () => {
    if (editValue.trim() && editValue !== name && onNameChange) {
      onNameChange(editValue.trim());
    }
    setIsEditing(false);
    setEditValue(name);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(name);
  };

  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        bgcolor: theme.palette.background.paper,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
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
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          flexWrap: "wrap",
          flex: 1,
          minWidth: 0,
        }}
      >
        <Tooltip title="Plan ID" arrow placement="top">
          <Chip
            label={id}
            size="small"
            variant="outlined"
            id={`plan-header-id-${id}`}
            data-testid={`plan-header-id-${id}`}
            aria-label={`Plan ID: ${id}`}
            sx={{
              height: 24,
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.02em",
              borderColor: alpha(theme.palette.divider, 0.4),
              color: theme.palette.text.secondary,
              backgroundColor: alpha(theme.palette.grey[500], 0.04),
              cursor: "help",
              flexShrink: 0,
            }}
          />
        </Tooltip>
        {isEditing ? (
          <TextField
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSave();
              }
              if (e.key === "Escape") {
                handleCancel();
              }
            }}
            variant="standard"
            size="small"
            autoFocus
            sx={{
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
            }}
          />
        ) : (
          <Tooltip title="Click to edit" arrow placement="top">
            <Box
              component="h2"
              id={`plan-header-name-${id}`}
              data-testid={`plan-header-name-${id}`}
              aria-label={`Plan Name: ${name}`}
              onClick={() => setIsEditing(true)}
              sx={{
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
              }}
            >
              {name}
            </Box>
          </Tooltip>
        )}
      </Box>

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
            color: theme.palette.action.active,
            transition: theme.transitions.create(
              ["transform", "color", "background-color"],
              {
                duration: theme.transitions.duration.short,
              }
            ),
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
              color: theme.palette.primary.main,
            },
            "&:focus-visible": {
              outline: `2px solid ${theme.palette.primary.main}`,
              outlineOffset: 2,
            },
          }}
        >
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}
