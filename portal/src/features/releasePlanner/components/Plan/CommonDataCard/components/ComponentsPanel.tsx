import {
  Box,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import {
  ViewList as ListViewIcon,
  ViewModule as GridViewIcon,
} from "@mui/icons-material";
import { ComponentCard } from "./ComponentCard";
import { ComponentListItem } from "./ComponentListItem";
import type { Product, ViewMode } from "../types";

interface ComponentsPanelProps {
  selectedProduct?: Product;
  viewMode: ViewMode;
  onToggleViewMode: () => void;
}

export function ComponentsPanel({
  selectedProduct,
  viewMode,
  onToggleViewMode,
}: ComponentsPanelProps) {
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
          Please select a product to view its components
        </Typography>
      </Box>
    );
  }

  if (!selectedProduct.components || selectedProduct.components.length === 0) {
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
          No components found for this product
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
          Components ({selectedProduct.components.length})
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
                color: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            {viewMode === "grid" ? <ListViewIcon /> : <GridViewIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Components display */}
      {viewMode === "grid" ? (
        <Grid container spacing={2}>
          {selectedProduct.components.map((component) => (
            <Grid item xs={12} sm={6} md={4} key={component.id}>
              <ComponentCard component={component} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {selectedProduct.components.map((component) => (
            <ComponentListItem key={component.id} component={component} />
          ))}
        </Box>
      )}
    </Box>
  );
}
