/**
 * CalendarDayCard Component
 *
 * Displays a single calendar day (holiday or special day)
 */

import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  IconButton,
  Chip,
  useTheme,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Repeat as RepeatIcon,
} from "@mui/icons-material";
import type { CalendarDay } from "../types";
import { formatDate } from "../utils/calendarUtils";

interface CalendarDayCardProps {
  day: CalendarDay;
  onEdit: (day: CalendarDay) => void;
  onDelete: (dayId: string) => void;
}

export function CalendarDayCard({
  day,
  onEdit,
  onDelete,
}: CalendarDayCardProps) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: theme.shadows[1],
        transition: theme.transitions.create(["box-shadow"]),
        "&:hover": {
          boxShadow: theme.shadows[4],
        },
      }}
    >
      {/* Header */}
      <CardHeader
        title={day.name}
        subheader={formatDate(day.date)}
        sx={{
          pb: 1,
          "& .MuiCardHeader-title": {
            fontSize: "1.1rem",
            fontWeight: 600,
          },
        }}
      />

      {/* Content */}
      <CardContent sx={{ flex: 1, pb: 1 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {/* Type Badge */}
          <Chip
            label={day.type === "holiday" ? "Holiday" : "Special Day"}
            size="small"
            color={day.type === "holiday" ? "error" : "info"}
            variant="outlined"
          />

          {/* Description */}
          {day.description && (
            <Typography variant="body2" color="text.secondary">
              {day.description}
            </Typography>
          )}

          {/* Recurring Badge */}
          {day.recurring && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <RepeatIcon sx={{ fontSize: "1rem" }} />
              <Typography variant="caption" color="text.secondary">
                Recurring annually
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>

      {/* Actions */}
      <Box
        sx={{
          p: 2,
          pt: 1,
          borderTop: `1px solid ${theme.palette.divider}`,
          display: "flex",
          gap: 1,
          justifyContent: "flex-end",
        }}
      >
        <IconButton
          size="small"
          color="primary"
          onClick={() => onEdit(day)}
          title="Edit day"
        >
          <EditIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={() => onDelete(day.id)}
          title="Delete day"
        >
          <DeleteIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
        </IconButton>
      </Box>
    </Card>
  );
}
