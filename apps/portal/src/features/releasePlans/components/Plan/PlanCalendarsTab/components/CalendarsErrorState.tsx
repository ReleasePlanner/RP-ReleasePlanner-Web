import { memo } from "react";
import { Box, Alert } from "@mui/material";

export const CalendarsErrorState = memo(function CalendarsErrorState() {
  return (
    <Box sx={{ p: 1.5 }}>
      <Alert
        severity="error"
        sx={{
          "& .MuiAlert-message": {
            fontSize: "0.6875rem",
          },
          "& .MuiAlert-icon": {
            fontSize: "1rem",
          },
        }}
      >
        Error loading some calendars. Please try again.
      </Alert>
    </Box>
  );
});

