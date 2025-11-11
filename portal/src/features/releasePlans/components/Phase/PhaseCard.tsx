/**
 * PhaseCard Component
 *
 * Minimalist card displaying phase information with inline editing
 */

import { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Chip,
  alpha,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import type { PlanPhase } from "../../types";

export interface PhaseCardProps {
  phase: PlanPhase;
  planName?: string;
  onEdit: (phase: PlanPhase) => void;
  onDelete: (phaseId: string) => void;
}

export function PhaseCard({
  phase,
  planName,
  onEdit,
  onDelete,
}: PhaseCardProps) {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (date?: string) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDuration = () => {
    if (!phase.startDate || !phase.endDate) return null;
    const start = new Date(phase.startDate);
    const end = new Date(phase.endDate);
    const days =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return `${days} ${days === 1 ? "day" : "days"}`;
  };

  return (
    <Card
      variant="outlined"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        height: "100%",
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: "none",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          borderColor: alpha(theme.palette.primary.main, 0.3),
          boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.08)}`,
        },
      }}
    >
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        {/* Header with Actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: "1rem",
                fontWeight: 600,
                letterSpacing: "0.01em",
                color: theme.palette.text.primary,
                mb: 0.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {phase.name}
            </Typography>
            {planName && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: alpha(theme.palette.text.secondary, 0.7),
                  letterSpacing: "0.01em",
                }}
              >
                {planName}
              </Typography>
            )}
          </Box>

          {/* Actions */}
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              opacity: isHovered ? 1 : 0,
              transition: "opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <IconButton
              size="small"
              onClick={() => onEdit(phase)}
              sx={{
                p: 0.5,
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              <EditOutlinedIcon
                sx={{ fontSize: 16, color: theme.palette.primary.main }}
              />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(phase.id)}
              sx={{
                p: 0.5,
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  bgcolor: alpha(theme.palette.error.main, 0.08),
                },
              }}
            >
              <DeleteOutlineOutlinedIcon
                sx={{ fontSize: 16, color: theme.palette.error.main }}
              />
            </IconButton>
          </Box>
        </Box>

        {/* Color Preview */}
        {phase.color && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 16,
                borderRadius: 1,
                bgcolor: phase.color,
                border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.75rem",
                fontWeight: 500,
                color: theme.palette.text.secondary,
                letterSpacing: "0.01em",
              }}
            >
              {phase.color.toUpperCase()}
            </Typography>
          </Box>
        )}

        {/* Date Range */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.6875rem",
                fontWeight: 600,
                color: alpha(theme.palette.success.main, 0.8),
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                minWidth: 36,
              }}
            >
              Start
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: theme.palette.text.primary,
                letterSpacing: "0.01em",
              }}
            >
              {formatDate(phase.startDate)}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.6875rem",
                fontWeight: 600,
                color: alpha(theme.palette.error.main, 0.8),
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                minWidth: 36,
              }}
            >
              End
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: theme.palette.text.primary,
                letterSpacing: "0.01em",
              }}
            >
              {formatDate(phase.endDate)}
            </Typography>
          </Box>

          {/* Duration Chip */}
          {getDuration() && (
            <Box sx={{ mt: 1 }}>
              <Chip
                label={getDuration()}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.6875rem",
                  fontWeight: 500,
                  letterSpacing: "0.01em",
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  color: theme.palette.primary.main,
                  border: "none",
                  "& .MuiChip-label": {
                    px: 1,
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
