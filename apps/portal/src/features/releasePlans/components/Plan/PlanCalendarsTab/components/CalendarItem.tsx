import { memo } from "react";
import { Box, Typography, Stack, Chip, IconButton, Tooltip, useTheme, alpha } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import type { Calendar } from "@/features/calendar/types";
import type { PlanCalendarsStyles } from "../hooks/usePlanCalendarsStyles";

export type CalendarItemProps = {
  readonly calendar: Calendar;
  readonly isLast: boolean;
  readonly onDelete: (id: string) => void;
  readonly styles: PlanCalendarsStyles;
};

export const CalendarItem = memo(function CalendarItem({
  calendar,
  isLast,
  onDelete,
  styles,
}: CalendarItemProps) {
  const theme = useTheme();

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 0.75, sm: 1 },
          px: { xs: 1, sm: 1.25 },
          py: { xs: 0.75, sm: 1 },
          transition: theme.transitions.create(["background-color", "border-color"], {
            duration: theme.transitions.duration.shorter,
          }),
          "&:hover": {
            bgcolor: alpha(theme.palette.primary.main, 0.04),
          },
        }}
      >
        {/* Actions */}
        <Stack direction="row" spacing={0.25} sx={{ flexShrink: 0 }}>
          <Tooltip title="Delete calendar" arrow placement="top">
            <IconButton
              size="small"
              onClick={() => onDelete(calendar.id)}
              sx={styles.getDeleteButtonStyles()}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Calendar Info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: "0.6875rem", sm: "0.75rem" },
              fontWeight: 500,
              color: theme.palette.text.primary,
              mb: 0.125,
              lineHeight: 1.4,
            }}
          >
            {calendar.name}
          </Typography>
          {calendar.description && (
            <Typography
              variant="caption"
              sx={{
                fontSize: { xs: "0.625rem", sm: "0.6875rem" },
                color: theme.palette.text.secondary,
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {calendar.description}
            </Typography>
          )}
          <Stack
            direction="row"
            spacing={{ xs: 0.5, sm: 0.75 }}
            sx={{ mt: 0.25 }}
            flexWrap="wrap"
          >
            {calendar.country && (
              <Chip label={calendar.country.name} size="small" sx={styles.getCountryChipStyles()} />
            )}
            <Chip
              label={`${calendar.days.length} ${calendar.days.length !== 1 ? "days" : "day"}`}
              size="small"
              sx={styles.getDaysChipStyles()}
            />
          </Stack>
        </Box>
      </Box>
      {!isLast && (
        <Box
          sx={{
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          }}
        />
      )}
    </Box>
  );
});

