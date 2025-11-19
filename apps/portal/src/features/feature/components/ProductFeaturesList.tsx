/**
 * Product Features List Component
 *
 * Displays filtered and sorted features for a selected product with compact, minimalist Material UI design
 */

import { 
  Box, 
  Typography, 
  useTheme, 
  alpha, 
  Paper,
  Stack,
  IconButton,
  Tooltip,
  Divider,
  Chip,
  CircularProgress,
} from "@mui/material";
import { 
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import type { Feature, ProductWithFeatures } from "../types";
import { STATUS_LABELS } from "../constants";

/**
 * Props for ProductFeaturesList component
 */
interface ProductFeaturesListProps {
  product: ProductWithFeatures | undefined;
  features: Feature[];
  onEditFeature: (feature: Feature) => void;
  onDeleteFeature: (featureId: string) => void;
  isDeleting?: string | null;
}

/**
 * ProductFeaturesList Component
 *
 * Displays filtered and sorted features for a selected product in a compact list format.
 */
export function ProductFeaturesList({
  product,
  features,
  onEditFeature,
  onDeleteFeature,
  isDeleting = null,
}: ProductFeaturesListProps) {
  const theme = useTheme();

  if (!product) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: "center",
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontSize: "0.875rem",
            fontWeight: 500,
            color: theme.palette.text.secondary,
            mb: 0.5,
          }}
        >
          Select a product to view its features
        </Typography>
      </Paper>
    );
  }

  if (features.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: "center",
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontSize: "0.875rem",
            fontWeight: 500,
            color: theme.palette.text.secondary,
            mb: 0.5,
          }}
        >
          No features configured
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: "0.75rem",
            color: theme.palette.text.disabled,
          }}
        >
          Start by adding your first feature
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {features.map((feature, index) => (
        <Box key={feature.id}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              px: 2,
              py: 1.5,
              transition: theme.transitions.create(["background-color"], {
                duration: theme.transitions.duration.shorter,
              }),
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.04),
              },
            }}
          >
            {/* Feature Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                  mb: 0.25,
                }}
              >
                {feature.name}
              </Typography>
              {feature.description && (
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.6875rem",
                    color: theme.palette.text.secondary,
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {feature.description}
                </Typography>
              )}
              <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                {feature.category && (
                  <Chip
                    label={feature.category.name || "No category"}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: "0.625rem",
                      fontWeight: 500,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      "& .MuiChip-label": {
                        px: 0.75,
                      },
                    }}
                  />
                )}
                <Chip
                  label={STATUS_LABELS[feature.status] || feature.status}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: "0.625rem",
                    fontWeight: 500,
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                    "& .MuiChip-label": {
                      px: 0.75,
                    },
                  }}
                />
              </Stack>
            </Box>

            {/* Actions */}
            <Stack direction="row" spacing={0.25} sx={{ ml: 2 }}>
              <Tooltip title="Edit feature">
                <IconButton
                  size="small"
                  onClick={() => onEditFeature(feature)}
                  sx={{
                    fontSize: 16,
                    p: 0.75,
                    color: theme.palette.text.secondary,
                    "&:hover": {
                      color: theme.palette.primary.main,
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  <EditIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete feature">
                <IconButton
                  size="small"
                  onClick={() => onDeleteFeature(feature.id)}
                  disabled={isDeleting === feature.id}
                  sx={{
                    fontSize: 16,
                    p: 0.75,
                    color: theme.palette.text.secondary,
                    "&:hover": {
                      color: theme.palette.error.main,
                      bgcolor: alpha(theme.palette.error.main, 0.08),
                    },
                  }}
                >
                  {isDeleting === feature.id ? (
                    <CircularProgress size={14} />
                  ) : (
                    <DeleteIcon fontSize="inherit" />
                  )}
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
          {index < features.length - 1 && (
            <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.08) }} />
          )}
        </Box>
      ))}
    </Paper>
  );
}
