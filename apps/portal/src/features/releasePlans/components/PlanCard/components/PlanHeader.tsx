import {
  IconButton,
  Box,
  Tooltip,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

export type PlanHeaderProps = {
  id: string;
  name: string;
  expanded: boolean;
  onToggleExpanded: () => void;
};

/**
 * Header component for PlanCard
 * Displays Plan Name (read-only) and expand/collapse button
 * Name editing is now in the "Datos Comunes" tab
 */
export function PlanHeader({
  id,
  name,
  expanded,
  onToggleExpanded,
}: PlanHeaderProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        px: { xs: 1, sm: 1.25 },
        py: { xs: 0.5, sm: 0.75 },
        minHeight: 36,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        bgcolor: theme.palette.background.paper,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 1,
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

      {/* Expand/Collapse Button - Right Side */}
      <Tooltip
        title={expanded ? "Colapsar plan" : "Expandir plan"}
        placement="top"
        arrow
      >
        <IconButton
          onClick={onToggleExpanded}
          aria-label={expanded ? "Colapsar plan" : "Expandir plan"}
          aria-expanded={expanded}
          size="small"
          sx={{
            width: 32,
            height: 32,
            p: 0,
            color: theme.palette.text.secondary,
            flexShrink: 0,
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
          <ExpandMore fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
