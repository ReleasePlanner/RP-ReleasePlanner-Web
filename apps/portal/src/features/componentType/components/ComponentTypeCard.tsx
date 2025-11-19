/**
 * Component Type Card Component
 *
 * Displays Component Type information with edit/delete actions
 * Unified design with Product Card
 */

import {
  Card,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Box,
  Chip,
  Stack,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import type { ComponentType } from "@/api/services/componentTypes.service";

interface ComponentTypeCardProps {
  componentType: ComponentType;
  onEdit: () => void;
  onDelete: () => void;
}

export function ComponentTypeCard({ componentType, onEdit, onDelete }: ComponentTypeCardProps) {
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
              fontSize: "0.9375rem",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: theme.palette.text.primary,
            }}
          >
            {componentType.name}
          </Typography>

          {componentType.code && (
            <Chip
              label={componentType.code}
              size="small"
              sx={{
                height: 22,
                fontSize: "0.6875rem",
                fontWeight: 600,
                bgcolor: alpha(theme.palette.primary.main, 0.08),
                color: theme.palette.primary.main,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                px: 1.25,
                alignSelf: "flex-start",
              }}
            />
          )}

          {componentType.description && (
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.8125rem",
                lineHeight: 1.5,
                color: theme.palette.text.secondary,
              }}
            >
              {componentType.description}
            </Typography>
          )}
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

