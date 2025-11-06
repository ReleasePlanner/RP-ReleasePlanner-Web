import React from "react";
import { Box, Typography, Chip, useTheme } from "@mui/material";

interface DataRowProps {
  icon: React.ReactElement;
  label: string;
  value: string;
  isStatus?: boolean;
}

export function DataRow({
  icon,
  label,
  value,
  isStatus = false,
}: DataRowProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        minHeight: 32,
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          color: theme.palette.text.secondary,
          display: "flex",
          alignItems: "center",
          "& .MuiSvgIcon-root": {
            fontSize: "1.1rem",
          },
        }}
      >
        {icon}
      </Box>

      <Typography
        variant="body2"
        sx={{
          color: theme.palette.text.secondary,
          fontWeight: 500,
          minWidth: 80,
          fontSize: "0.813rem",
        }}
      >
        {label}:
      </Typography>

      {isStatus ? (
        <Chip
          label={value}
          size="small"
          variant="outlined"
          sx={{
            height: 20,
            fontSize: "0.75rem",
            fontWeight: 500,
            borderRadius: 1,
            "& .MuiChip-label": {
              px: 1,
            },
          }}
        />
      ) : (
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 400,
            fontSize: "0.813rem",
          }}
        >
          {value}
        </Typography>
      )}
    </Box>
  );
}
