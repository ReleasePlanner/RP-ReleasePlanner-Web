import { Box, Typography } from "@mui/material";

export function FeaturesEmptyState() {
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
        No features added to this plan. Click "Add" to select features from the
        product.
      </Typography>
    </Box>
  );
}

