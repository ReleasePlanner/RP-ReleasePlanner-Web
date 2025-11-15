/**
 * CalendarCard Component
 *
 * Elegant Material UI card for displaying calendar information
 */

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Box,
  useTheme,
  alpha,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, CalendarMonth as CalendarIcon } from "@mui/icons-material";
import type { Calendar } from "../types";

interface CalendarCardProps {
  calendar: Calendar;
  isSelected?: boolean;
  onSelect: (calendarId: string) => void;
  onEdit: (calendar: Calendar) => void;
  onDelete: (calendarId: string) => void;
}

export function CalendarCard({
  calendar,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
}: CalendarCardProps) {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      onClick={() => onSelect(calendar.id)}
      sx={{
        border: `1px solid ${isSelected ? theme.palette.primary.main : alpha(theme.palette.divider, 0.12)}`,
        borderRadius: 3,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.04) : "background.paper",
        "&:hover": {
          borderColor: theme.palette.primary.main,
          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <CalendarIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: "1.125rem",
                letterSpacing: "-0.01em",
                mb: 0.5,
                color: theme.palette.text.primary,
              }}
            >
              {calendar.name}
            </Typography>
            {calendar.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                  mb: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {calendar.description}
              </Typography>
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
              {calendar.country && (
                <Chip
                  label={`${calendar.country.name} (${calendar.country.code})`}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    color: theme.palette.primary.main,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    px: 1.5,
                  }}
                />
              )}
              <Chip
                label={`${calendar.days.length} day${calendar.days.length !== 1 ? "s" : ""}`}
                size="small"
                sx={{
                  height: 24,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  bgcolor: alpha(theme.palette.text.secondary, 0.08),
                  color: theme.palette.text.secondary,
                  border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                  px: 1.5,
                }}
              />
            </Box>
          </Box>
        </Box>
      </CardContent>
      <CardActions sx={{ px: 3, pb: 3, pt: 0, gap: 0.5 }}>
        <Tooltip title="Edit Calendar">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(calendar);
            }}
            sx={{
              color: theme.palette.primary.main,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                transform: "scale(1.1)",
              },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Calendar">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(calendar.id);
            }}
            sx={{
              color: theme.palette.error.main,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                bgcolor: alpha(theme.palette.error.main, 0.08),
                transform: "scale(1.1)",
              },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}

