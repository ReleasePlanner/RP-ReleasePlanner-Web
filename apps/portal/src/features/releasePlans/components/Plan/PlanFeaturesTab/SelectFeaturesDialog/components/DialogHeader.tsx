import { Box, Typography, Chip } from "@mui/material";

export type DialogHeaderProps = {
  readonly selectedCount: number;
};

export function DialogHeader({ selectedCount }: DialogHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h6"
        component="div"
        sx={{
          fontWeight: 600,
          fontSize: "0.8125rem",
          letterSpacing: "-0.01em",
        }}
      >
        Select Features
      </Typography>
      {selectedCount > 0 && (
        <Chip
          label={`${selectedCount} selected`}
          color="primary"
          size="small"
          sx={{
            fontWeight: 500,
            height: 18,
            fontSize: "0.625rem",
            "& .MuiChip-label": {
              px: 0.75,
            },
          }}
        />
      )}
    </Box>
  );
}

