import { memo } from "react";
import { Box, Typography, Button, Tooltip, useTheme, alpha } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import type { PlanCalendarsStyles } from "../hooks/usePlanCalendarsStyles";

export type CalendarsHeaderProps = {
  readonly calendarCount: number;
  readonly onAddClick: () => void;
  readonly styles: PlanCalendarsStyles;
};

export const CalendarsHeader = memo(function CalendarsHeader({
  calendarCount,
  onAddClick,
  styles,
}: CalendarsHeaderProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 1,
        pb: 1,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        flexShrink: 0,
        flexWrap: { xs: "wrap", sm: "nowrap" },
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 600,
          fontSize: { xs: "0.625rem", sm: "0.6875rem" },
          color: theme.palette.text.primary,
          flex: { xs: "1 1 100%", sm: "0 1 auto" },
        }}
      >
        Calendars ({calendarCount})
      </Typography>
      <Tooltip title="Add calendars from maintenance" arrow placement="top">
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon sx={{ fontSize: 14 }} />}
          onClick={onAddClick}
          sx={styles.getAddButtonStyles()}
        >
          Add
        </Button>
      </Tooltip>
    </Box>
  );
});

