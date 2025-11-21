import { Box, Typography } from "@mui/material";

export function NoProductState() {
  return (
    <Box
      sx={{
        p: 4,
        textAlign: "center",
        color: "text.secondary",
      }}
    >
      <Typography variant="body2" sx={{ fontSize: "0.6875rem" }}>
        Please select a product in the Common Data tab to view available
        features.
      </Typography>
    </Box>
  );
}

