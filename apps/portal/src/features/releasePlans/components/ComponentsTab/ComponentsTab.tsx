/**
 * Components Tab - Shows components based on selected product
 *
 * This component demonstrates how the product selection in Common Data
 * can be used to filter and display relevant components.
 */

import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  useTheme,
  alpha,
} from "@mui/material";
import { getProductById } from "../../lib/productData";
import { buildComponentConfig, type ComponentConfig } from "@/builders";

interface ComponentsTabProps {
  selectedProduct?: string;
}

function ComponentCard({ config }: { config: ComponentConfig }) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        transition: theme.transitions.create(["transform", "box-shadow"], {
          duration: theme.transitions.duration.short,
        }),
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette[config.color].main, 0.1),
              color: theme.palette[config.color].main,
              mr: 1.5,
            }}
          >
            {config.icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontSize: "1rem",
                fontWeight: 600,
                lineHeight: 1.2,
                mb: 0.5,
              }}
            >
              {config.name}
            </Typography>
            <Chip
              label={
                config.color.charAt(0).toUpperCase() + config.color.slice(1)
              }
              size="small"
              color={config.color}
              sx={{ height: 20, fontSize: "0.75rem" }}
            />
          </Box>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: "0.875rem", lineHeight: 1.4 }}
        >
          {config.description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export function ComponentsTab({ selectedProduct }: ComponentsTabProps) {
  const theme = useTheme();
  const product = selectedProduct ? getProductById(selectedProduct) : null;

  if (!selectedProduct || !product) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 200,
          textAlign: "center",
          p: 3,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 1, fontWeight: 500 }}
          >
            No Product Selected
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please select a product from the Common Data tab to view its
            components.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: "1.125rem",
            color: theme.palette.text.primary,
            mb: 0.5,
          }}
        >
          Components for {product.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: "0.875rem" }}
        >
          {product.description}
        </Typography>
      </Box>

      {/* Responsive CSS grid to avoid MUI Grid v1/v2 typing differences */}
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
        }}
      >
        {(product.components as any[]).map((comp) => {
          const name = typeof comp === "string" ? comp : comp.name;
          const key = typeof comp === "string" ? comp : comp.id;
          const config = buildComponentConfig(name);
          return <ComponentCard key={key} config={config} />;
        })}
      </Box>

      {product.components.length === 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 100,
            border: `1px dashed ${alpha(theme.palette.divider, 0.3)}`,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.background.default, 0.5),
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No components defined for this product.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default ComponentsTab;
