import { memo } from "react";
import { Box, Typography } from "@mui/material";

export const CalendarsEmptyState = memo(function CalendarsEmptyState() {
  return (
    <Box
      sx={{
        p: 3,
        textAlign: "center",
        color: "text.secondary",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Typography variant="body2" sx={{ fontSize: "0.6875rem" }}>
        No calendars added to this plan. Click "Add" to select calendars from
        maintenance.
      </Typography>
    </Box>
  );
});

