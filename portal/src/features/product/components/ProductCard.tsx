/**
 * Product Card Component
 *
 * Minimalist, elegant card displaying product with components
 */

import {
  Card,
  CardContent,
  Button,
  Typography,
  Box,
  alpha,
  useTheme,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import {
  type Product,
  type ComponentVersion,
} from "@/features/releasePlans/components/Plan/CommonDataCard";
import { ComponentsTable } from "./index";

interface ProductCardProps {
  product: Product;
  onEditComponent: (product: Product, component: ComponentVersion) => void;
  onDeleteComponent: (productId: string, componentId: string) => void;
  onAddComponent: (product: Product) => void;
}

export function ProductCard({
  product,
  onEditComponent,
  onDeleteComponent,
  onAddComponent,
}: ProductCardProps) {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
        borderRadius: 2,
        transition: theme.transitions.create(
          ["box-shadow", "border-color", "transform"],
          {
            duration: theme.transitions.duration.shorter,
          }
        ),
        "&:hover": {
          borderColor: alpha(theme.palette.primary.main, 0.3),
          boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.08)}`,
          transform: "translateY(-1px)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {/* Product Header */}
        <Stack spacing={1} sx={{ mb: 2.5 }}>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                lineHeight: 1.3,
                mb: 0.5,
              }}
            >
              {product.name}
            </Typography>
            {product.description && (
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: "0.8125rem",
                  lineHeight: 1.4,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {product.description}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Chip
              label={`${product.components.length} component${
                product.components.length !== 1 ? "s" : ""
              }`}
              size="small"
              sx={{
                height: 20,
                fontSize: "0.6875rem",
                fontWeight: 500,
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                color: theme.palette.primary.main,
                "& .MuiChip-label": {
                  px: 1,
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.disabled,
                fontFamily: "monospace",
                fontSize: "0.6875rem",
              }}
            >
              {product.id}
            </Typography>
          </Box>
        </Stack>

        <Divider
          sx={{ mb: 2, borderColor: alpha(theme.palette.divider, 0.5) }}
        />

        {/* Components Table */}
        <Box sx={{ mb: 2 }}>
          <ComponentsTable
            components={product.components}
            onEditComponent={(component: ComponentVersion) =>
              onEditComponent(product, component)
            }
            onDeleteComponent={(componentId: string) =>
              onDeleteComponent(product.id, componentId)
            }
          />
        </Box>

        {/* Add Component Button */}
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon fontSize="small" />}
          onClick={() => onAddComponent(product)}
          fullWidth
          sx={{
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.8125rem",
            py: 0.75,
            borderColor: alpha(theme.palette.divider, 0.5),
            color: theme.palette.text.secondary,
            "&:hover": {
              borderColor: theme.palette.primary.main,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              color: theme.palette.primary.main,
            },
          }}
        >
          Add Component
        </Button>
      </CardContent>
    </Card>
  );
}
