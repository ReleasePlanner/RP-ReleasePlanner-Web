import { Box, CircularProgress } from "@mui/material";

export function FeaturesLoadingState() {
  return (
    <Box
      sx={{
        p: 3,
        textAlign: "center",
        color: "text.secondary",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 1,
      }}
    >
      <CircularProgress size={24} />
    </Box>
  );
}

