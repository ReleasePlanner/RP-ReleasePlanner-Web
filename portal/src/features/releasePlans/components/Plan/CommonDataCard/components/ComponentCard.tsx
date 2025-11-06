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
  Web as WebIcon,
  PhoneAndroid as MobileIcon,
  Cloud as ServiceIcon,
  Dashboard as PortalIcon,
  Api as ApiIcon,
  Storage as DatabaseIcon,
} from "@mui/icons-material";
import type { ComponentVersion } from "../types";

interface ComponentCardProps {
  component: ComponentVersion;
}

function getComponentIcon(type: string) {
  const iconMap = {
    web: <WebIcon />,
    mobile: <MobileIcon />,
    service: <ServiceIcon />,
    dashboard: <PortalIcon />,
    portal: <PortalIcon />,
    api: <ApiIcon />,
    gateway: <DatabaseIcon />,
  };

  return iconMap[type.toLowerCase() as keyof typeof iconMap] || <ServiceIcon />;
}

function getStatusColor(status?: string) {
  const colorMap = {
    production: "success",
    testing: "warning",
    development: "info",
    deprecated: "error",
  };

  return colorMap[status as keyof typeof colorMap] || "default";
}

export function ComponentCard({ component }: ComponentCardProps) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: "100%",
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        borderRadius: 2,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
          borderColor: alpha(theme.palette.primary.main, 0.3),
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          <Box
            sx={{
              color: theme.palette.primary.main,
              display: "flex",
              alignItems: "center",
              mt: 0.25,
              "& .MuiSvgIcon-root": {
                fontSize: "1.25rem",
              },
            }}
          >
            {getComponentIcon(component.type)}
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
              {component.name}
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
              {component.description || "No description available"}
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
              <Chip
                label={component.type.toUpperCase()}
                size="small"
                variant="outlined"
                sx={{
                  height: 20,
                  fontSize: "0.65rem",
                  fontWeight: 500,
                  borderRadius: 1,
                }}
              />
              {component.status && (
                <Chip
                  label={component.status.toUpperCase()}
                  size="small"
                  color={
                    getStatusColor(component.status) as
                      | "success"
                      | "warning"
                      | "info"
                      | "error"
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
            </Box>

            {component.version && (
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
                }}
              >
                v{component.version}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
