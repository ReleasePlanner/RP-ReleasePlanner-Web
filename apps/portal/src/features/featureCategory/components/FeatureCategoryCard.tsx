/**
 * Feature Category Card Component
 *
 * Displays Feature Category information with edit/delete actions
 * Unified design with Product Card
 */

import {
  Card,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Stack,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import type { FeatureCategory } from "@/api/services/featureCategories.service";

interface FeatureCategoryCardProps {
  category: FeatureCategory;
  onEdit: () => void;
  onDelete: () => void;
}

export function FeatureCategoryCard({ category, onEdit, onDelete }: FeatureCategoryCardProps) {
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
        <Stack spacing={2}>
          <Typography
            variant="h6"
            sx={{
              fontSize: "1.125rem",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: theme.palette.text.primary,
            }}
          >
            {category.name}
          </Typography>
        </Stack>
      </CardContent>

      <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
        <Stack direction="row" spacing={1} sx={{ ml: "auto" }}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={onEdit}
              sx={{
                color: theme.palette.text.secondary,
                transition: theme.transitions.create(["color", "transform"], {
                  duration: theme.transitions.duration.shorter,
                }),
                "&:hover": {
                  color: theme.palette.primary.main,
                  transform: "scale(1.1)",
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={onDelete}
              sx={{
                color: theme.palette.text.secondary,
                transition: theme.transitions.create(["color", "transform"], {
                  duration: theme.transitions.duration.shorter,
                }),
                "&:hover": {
                  color: theme.palette.error.main,
                  transform: "scale(1.1)",
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardActions>
    </Card>
  );
}

