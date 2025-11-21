import { Box, Typography } from "@mui/material";

export function NoProductState() {
  return (
    <Box
      sx={{
        p: 3,
        textAlign: "center",
        color: "text.secondary",
      }}
    >
      <Typography variant="body2">
        Please select a product in the Common Data tab to manage features.
      </Typography>
    </Box>
  );
}

