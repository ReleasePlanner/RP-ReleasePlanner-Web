import { Box, CircularProgress, Typography } from "@mui/material";

export function FeaturesLoadingState() {
  return (
    <Box
      sx={{
        p: 4,
        textAlign: "center",
        color: "text.secondary",
      }}
    >
      <CircularProgress size={24} />
      <Typography variant="body2" sx={{ fontSize: "0.6875rem", mt: 1 }}>
        Loading features...
      </Typography>
    </Box>
  );
}

