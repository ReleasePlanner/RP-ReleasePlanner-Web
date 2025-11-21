import { memo } from "react";
import { Box, Typography, useTheme, alpha } from "@mui/material";

export type CurrentVersionDisplayProps = {
  readonly currentVersion: string;
};

export const CurrentVersionDisplay = memo(function CurrentVersionDisplay({
  currentVersion,
}: CurrentVersionDisplayProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 1,
        bgcolor: alpha(theme.palette.info.main, 0.06),
        border: `1px solid ${alpha(theme.palette.info.main, 0.12)}`,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          display: "block",
          mb: 0.5,
          color: theme.palette.text.secondary,
          fontSize: "0.75rem",
        }}
      >
        Current Version
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontFamily: "monospace",
          fontWeight: 600,
          color: theme.palette.info.main,
        }}
      >
        {currentVersion}
      </Typography>
    </Box>
  );
});

