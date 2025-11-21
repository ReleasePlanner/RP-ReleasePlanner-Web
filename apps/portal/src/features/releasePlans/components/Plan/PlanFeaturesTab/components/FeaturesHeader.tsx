import { Box, Typography, Button, Tooltip, useTheme, alpha } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

export type FeaturesHeaderProps = {
  readonly featureCount: number;
  readonly isAdding: boolean;
  readonly productId?: string;
  readonly onAddClick: () => void;
};

export function FeaturesHeader({
  featureCount,
  isAdding,
  productId,
  onAddClick,
}: FeaturesHeaderProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 1,
        pb: 1,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        flexShrink: 0,
        flexWrap: { xs: "wrap", sm: "nowrap" },
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 600,
          fontSize: { xs: "0.625rem", sm: "0.6875rem" },
          color: theme.palette.text.primary,
          flex: { xs: "1 1 100%", sm: "0 1 auto" },
        }}
      >
        Features ({featureCount})
      </Typography>
      <Tooltip title="Add product features" arrow placement="top">
        <Button
          variant="outlined"
          size="small"
          startIcon={
            isAdding ? (
              <CircularProgress size={14} />
            ) : (
              <AddIcon sx={{ fontSize: 14 }} />
            )
          }
          onClick={onAddClick}
          disabled={isAdding || !productId}
          sx={{
            textTransform: "none",
            fontSize: { xs: "0.625rem", sm: "0.6875rem" },
            fontWeight: 500,
            px: { xs: 1, sm: 1.25 },
            py: 0.5,
            borderRadius: 1,
            minHeight: 26,
            borderColor: alpha(theme.palette.primary.main, 0.5),
            color: theme.palette.primary.main,
            flexShrink: 0,
            "&:hover": {
              borderColor: theme.palette.primary.main,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          {isAdding ? "Adding..." : "Add"}
        </Button>
      </Tooltip>
    </Box>
  );
}

