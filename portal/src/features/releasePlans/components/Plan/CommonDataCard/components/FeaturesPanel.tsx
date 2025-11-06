import {
  Box,
  Typography,
  Grid2 as Grid,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import {
  ViewList as ListViewIcon,
  ViewModule as GridViewIcon,
} from "@mui/icons-material";
import { FeatureCard } from "./FeatureCard";
import { FeatureListItem } from "./FeatureListItem";
import type { Product, ViewMode } from "../types";

interface FeaturesPanelProps {
  selectedProduct?: Product;
  viewMode: ViewMode;
  onToggleViewMode: () => void;
}

export function FeaturesPanel({
  selectedProduct,
  viewMode,
  onToggleViewMode,
}: FeaturesPanelProps) {
  const theme = useTheme();

  if (!selectedProduct) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 120,
          border: `1px dashed ${alpha(theme.palette.divider, 0.3)}`,
          borderRadius: 2,
          backgroundColor: alpha(theme.palette.background.default, 0.3),
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "0.875rem",
            textAlign: "center",
          }}
        >
          Please select a product to view its features
        </Typography>
      </Box>
    );
  }

  if (!selectedProduct.features || selectedProduct.features.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 120,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "0.875rem",
          }}
        >
          No features found for this product
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with view toggle */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            fontSize: "0.875rem",
          }}
        >
          Features ({selectedProduct.features.length})
        </Typography>

        <Tooltip
          title={`Switch to ${viewMode === "grid" ? "list" : "grid"} view`}
        >
          <IconButton
            onClick={onToggleViewMode}
            size="small"
            sx={{
              color: theme.palette.text.secondary,
              "&:hover": {
                color: theme.palette.secondary.main,
                backgroundColor: alpha(theme.palette.secondary.main, 0.1),
              },
            }}
          >
            {viewMode === "grid" ? <ListViewIcon /> : <GridViewIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Features display */}
      {viewMode === "grid" ? (
        <Grid container spacing={2}>
          {selectedProduct.features.map((feat) => (
            <Grid xs={12} sm={6} md={4} key={feat.id}>
              <FeatureCard feature={feat} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {selectedProduct.features.map((feat) => (
            <FeatureListItem key={feat.id} feature={feat} />
          ))}
        </Box>
      )}
    </Box>
  );
}
