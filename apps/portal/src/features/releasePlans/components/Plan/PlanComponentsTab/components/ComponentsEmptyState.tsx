import { memo } from "react";
import { Box, Typography } from "@mui/material";

export const ComponentsEmptyState = memo(function ComponentsEmptyState() {
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
        No components added to this plan. Click "Add" to select components from
        the product.
      </Typography>
    </Box>
  );
});

