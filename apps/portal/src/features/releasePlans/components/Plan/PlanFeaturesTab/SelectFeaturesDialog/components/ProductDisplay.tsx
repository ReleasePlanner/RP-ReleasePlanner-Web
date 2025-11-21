import { Box, Typography, Chip, useTheme, alpha } from "@mui/material";

export type ProductDisplayProps = {
  readonly productName?: string;
};

export function ProductDisplay({ productName }: ProductDisplayProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        px: 2,
        pt: 1.5,
        pb: 1,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "0.625rem",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Product:
        </Typography>
        {productName ? (
          <Chip
            label={productName}
            size="small"
            sx={{
              height: 18,
              fontSize: "0.625rem",
              fontWeight: 500,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.primary.main, 0.15)
                  : alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              "& .MuiChip-label": {
                px: 0.75,
              },
            }}
          />
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "0.6875rem",
              fontStyle: "italic",
            }}
          >
            Product not found
          </Typography>
        )}
      </Box>
    </Box>
  );
}

