import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Flag as FeaturesIcon,
  Assignment as RequirementIcon,
  Group as TeamIcon,
  PriorityHigh as PriorityIcon,
} from "@mui/icons-material";
import type { FeatureVersion } from "../types";

interface FeatureCardProps {
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

export function FeatureCard({ feature }: FeatureCardProps) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: "100%",
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        borderRadius: 2,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: `0 4px 12px ${alpha(theme.palette.secondary.main, 0.15)}`,
          borderColor: alpha(theme.palette.secondary.main, 0.3),
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          <Box
            sx={{
              color: theme.palette.secondary.main,
              display: "flex",
              alignItems: "center",
              mt: 0.25,
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
                mb: 0.5,
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
                mb: 1,
                lineHeight: 1.4,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {feature.description || "No description available"}
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
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
            </Box>

            {feature.assignedTeam && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <TeamIcon
                  sx={{
                    fontSize: "0.75rem",
                    color: theme.palette.text.secondary,
                  }}
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
                  display: "inline-block",
                  mt: 0.5,
                }}
              >
                ~{feature.estimatedHours}h
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
