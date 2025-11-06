import { Box, Typography, Chip, useTheme, alpha } from "@mui/material";
import {
  Web as WebIcon,
  PhoneAndroid as MobileIcon,
  Cloud as ServiceIcon,
  Dashboard as PortalIcon,
  Api as ApiIcon,
  Storage as DatabaseIcon,
} from "@mui/icons-material";
import type { ComponentVersion } from "../types";

interface ComponentListItemProps {
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

export function ComponentListItem({ component }: ComponentListItemProps) {
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
          borderColor: alpha(theme.palette.primary.main, 0.3),
        },
      }}
    >
      <Box
        sx={{
          color: theme.palette.primary.main,
          display: "flex",
          alignItems: "center",
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
            mb: 0.25,
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
            lineHeight: 1.4,
          }}
        >
          {component.description || "No description available"}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 0.5,
          alignItems: "center",
        }}
      >
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
            }}
          >
            v{component.version}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
