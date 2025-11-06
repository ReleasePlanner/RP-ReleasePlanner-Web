/**
 * Material Design minimalista - CommonDataCard refactorizada
 *
 * Mejoras aplicadas:
 * ✅ Seguimiento estricto de Material Design 3.0
 * ✅ Iconografía coherente y minimalista
 * ✅ Espaciado consistente basado en grilla 8px
 * ✅ Tipografía jerárquica clara
 * ✅ Estados de interacción apropiados
 * ✅ Accesibilidad mejorada (a11y)
 * ✅ Colores del tema integrados
 */

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import {
  PersonOutline,
  CalendarToday,
  FolderOpen,
  Schedule,
} from "@mui/icons-material";

export interface CommonDataCardProps {
  owner: string;
  startDate: string;
  endDate: string;
  id: string;
}

interface DataItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: "primary" | "secondary" | "success" | "warning" | "error";
}

const DataItem: React.FC<DataItemProps> = ({
  icon,
  label,
  value,
  color = "primary",
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        py: 1,
        px: 0.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: "50%",
          backgroundColor: alpha(theme.palette[color].main, 0.08),
          color: theme.palette[color].main,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontSize: "0.75rem",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            mb: 0.25,
          }}
        >
          {label}
        </Typography>
        <Typography
          variant="body1"
          color="text.primary"
          sx={{
            fontWeight: 500,
            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

export function CommonDataCard({
  owner,
  startDate,
  endDate,
  id,
}: CommonDataCardProps) {
  const theme = useTheme();

  // Formatear fechas de manera más legible
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calcular duración del proyecto
  const calculateDuration = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.round(diffDays / 30);
      return `${months} month${months > 1 ? "s" : ""}`;
    } else {
      const years = Math.round(diffDays / 365);
      return `${years} year${years > 1 ? "s" : ""}`;
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: alpha(theme.palette.divider, 0.08),
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper,
        boxShadow: "none",
        transition: theme.transitions.create(["box-shadow", "border-color"], {
          duration: theme.transitions.duration.short,
        }),
        "&:hover": {
          borderColor: alpha(theme.palette.primary.main, 0.12),
          boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.04)}`,
        },
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        {/* Header minimalista */}
        <Box
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="subtitle2"
            color="text.primary"
            sx={{
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          >
            Project Details
          </Typography>
          <Chip
            label={id}
            size="small"
            variant="outlined"
            sx={{
              height: 20,
              fontSize: "0.625rem",
              fontWeight: 500,
              borderColor: alpha(theme.palette.primary.main, 0.2),
              color: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
            }}
          />
        </Box>

        <Divider
          sx={{ mb: 2, borderColor: alpha(theme.palette.divider, 0.06) }}
        />

        {/* Datos organizados verticalmente con mejor jerarquía */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <DataItem
            icon={<PersonOutline fontSize="small" />}
            label="Owner"
            value={owner}
            color="primary"
          />

          <DataItem
            icon={<CalendarToday fontSize="small" />}
            label="Start Date"
            value={formatDate(startDate)}
            color="secondary"
          />

          <DataItem
            icon={<Schedule fontSize="small" />}
            label="End Date"
            value={formatDate(endDate)}
            color="secondary"
          />

          <DataItem
            icon={<FolderOpen fontSize="small" />}
            label="Duration"
            value={calculateDuration()}
            color="success"
          />
        </Box>
      </CardContent>
    </Card>
  );
}

export default CommonDataCard;
