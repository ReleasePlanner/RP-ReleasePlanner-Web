import { memo } from "react";
import { Box, CircularProgress } from "@mui/material";

export const ComponentsLoadingState = memo(function ComponentsLoadingState() {
  return (
    <Box
      sx={{
        p: 3,
        textAlign: "center",
        color: "text.secondary",
      }}
    >
      <CircularProgress size={24} />
    </Box>
  );
});

