import { Box, Typography, Chip, useTheme, alpha } from "@mui/material";
import {
  Flag as FeaturesIcon,
  Assignment as RequirementIcon,
  Group as TeamIcon,
  PriorityHigh as PriorityIcon,
} from "@mui/icons-material";
import type { FeatureVersion } from "../types";

interface FeatureListItemProps {
  feature: FeatureVersion;
}

function getPriorityColor(priority?: string) {
  const colorMap = {
    critical: "error",
    high: "warning",
    medium: "info",
    low: "success",
  };

  return colorMap[priority as keyof typeof colorMap] || "default";
}

function getStatusColor(status?: string) {
  const colorMap = {
    completed: "success",
    "in-progress": "info",
    testing: "warning",
    backlog: "default",
    blocked: "error",
  };

  return colorMap[status as keyof typeof colorMap] || "default";
}

function getCategoryIcon(category?: string) {
  const iconMap = {
    ui: <FeaturesIcon />,
    backend: <RequirementIcon />,
    integration: <TeamIcon />,
    security: <PriorityIcon />,
  };

  return iconMap[category as keyof typeof iconMap] || <FeaturesIcon />;
}

export function FeatureListItem({ feature }: FeatureListItemProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        borderRadius: 2,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: alpha(theme.palette.action.hover, 0.5),
          borderColor: alpha(theme.palette.secondary.main, 0.3),
        },
      }}
    >
      <Box
        sx={{
          color: theme.palette.secondary.main,
          display: "flex",
          alignItems: "center",
          "& .MuiSvgIcon-root": {
            fontSize: "1.25rem",
          },
        }}
      >
        {getCategoryIcon(feature.category)}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            mb: 0.25,
            fontSize: "0.875rem",
            color: theme.palette.text.primary,
          }}
        >
          {feature.name}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "0.75rem",
            lineHeight: 1.4,
            mb: 0.5,
          }}
        >
          {feature.description || "No description available"}
        </Typography>

        {feature.assignedTeam && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <TeamIcon
              sx={{ fontSize: "0.75rem", color: theme.palette.text.secondary }}
            />
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "0.7rem",
              }}
            >
              {feature.assignedTeam}
            </Typography>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 0.5,
          alignItems: "center",
        }}
      >
        {feature.priority && (
          <Chip
            label={feature.priority.toUpperCase()}
            size="small"
            color={
              getPriorityColor(feature.priority) as
                | "error"
                | "warning"
                | "info"
                | "success"
                | "default"
            }
            sx={{
              height: 20,
              fontSize: "0.65rem",
              fontWeight: 500,
              borderRadius: 1,
            }}
          />
        )}
        {feature.status && (
          <Chip
            label={feature.status.replace("-", " ").toUpperCase()}
            size="small"
            color={
              getStatusColor(feature.status) as
                | "success"
                | "info"
                | "warning"
                | "default"
                | "error"
            }
            variant="outlined"
            sx={{
              height: 20,
              fontSize: "0.65rem",
              fontWeight: 500,
              borderRadius: 1,
            }}
          />
        )}
        {feature.estimatedHours && (
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "0.7rem",
              fontFamily: "monospace",
              backgroundColor: alpha(theme.palette.background.default, 0.5),
              px: 0.75,
              py: 0.25,
              borderRadius: 0.5,
            }}
          >
            ~{feature.estimatedHours}h
          </Typography>
        )}
      </Box>
    </Box>
  );
}
