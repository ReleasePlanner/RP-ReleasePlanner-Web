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
        border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        borderRadius: 3,
        overflow: "hidden",
        transition: theme.transitions.create(
          ["box-shadow", "border-color", "transform"],
          {
            duration: theme.transitions.duration.shorter,
            easing: theme.transitions.easing.easeInOut,
          }
        ),
        "&:hover": {
          borderColor: alpha(theme.palette.primary.main, 0.4),
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.1)}, 0 0 0 1px ${alpha(theme.palette.primary.main, 0.08)}`,
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Product Header */}
        <Stack spacing={1.5} sx={{ mb: 3 }}>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "0.9375rem",
                color: theme.palette.text.primary,
                lineHeight: 1.4,
                mb: 0.75,
                letterSpacing: "-0.01em",
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
                  lineHeight: 1.5,
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
              gap: 1.5,
              flexWrap: "wrap",
            }}
          >
            <Chip
              label={`${product.components.length} component${
                product.components.length !== 1 ? "s" : ""
              }`}
              size="small"
              sx={{
                height: 22,
                fontSize: "0.6875rem",
                fontWeight: 600,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                "& .MuiChip-label": {
                  px: 1.25,
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.disabled,
                fontFamily: "monospace",
                fontSize: "0.625rem",
                fontWeight: 400,
              }}
            >
              {product.id}
            </Typography>
          </Box>
        </Stack>

        <Divider
          sx={{ 
            mb: 3, 
            borderColor: alpha(theme.palette.divider, 0.12),
            borderWidth: 1,
          }}
        />

        {/* Components Table */}
        <Box sx={{ mb: 3 }}>
          <ComponentsTable
            components={product.components.map((c: ComponentVersion) => ({
              ...c,
              // Map backend format to frontend format
              name: (c as any).name || c.type || '', // Use name if exists, fallback to type
              version: (c as any).currentVersion || (c as any).version || '', // Map currentVersion to version
            }))}
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
          size="medium"
          startIcon={<AddIcon />}
          onClick={() => onAddComponent(product)}
          fullWidth
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
            py: 1.25,
            borderRadius: 2,
            borderColor: alpha(theme.palette.divider, 0.3),
            borderWidth: 1.5,
            color: theme.palette.text.secondary,
            bgcolor: alpha(theme.palette.action.hover, 0.3),
            transition: theme.transitions.create(
              ["border-color", "background-color", "color", "transform"],
              {
                duration: theme.transitions.duration.shorter,
              }
            ),
            "&:hover": {
              borderColor: theme.palette.primary.main,
              borderWidth: 1.5,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              color: theme.palette.primary.main,
              transform: "scale(1.01)",
            },
          }}
        >
          Add Component
        </Button>
      </CardContent>
    </Card>
  );
}
