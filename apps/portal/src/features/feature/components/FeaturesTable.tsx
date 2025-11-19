/**
 * Features Table Component
 *
 * Elegant Material UI table for displaying features with edit/delete actions
 */

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip,
  useTheme,
  alpha,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon 
} from "@mui/icons-material";
import type { Feature } from "../types";
import { STATUS_LABELS } from "../constants";

/**
 * Props for FeaturesTable component
 */
interface FeaturesTableProps {
  features: Feature[];
  onEditFeature?: (feature: Feature) => void;
  onDeleteFeature: (featureId: string) => void;
  isRemoving?: string | null;
}

/**
 * FeaturesTable Component
 *
 * Displays features in an elegant table with edit/delete actions.
 */
export function FeaturesTable({
  features,
  onEditFeature,
  onDeleteFeature,
  isRemoving = null,
}: FeaturesTableProps) {
  const theme = useTheme();

  if (features.length === 0) {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.6875rem" }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.6875rem" }}>Categoría</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: "0.6875rem" }}>Estado</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, fontSize: "0.6875rem" }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: "0.75rem",
                  }}
                >
                  No hay features disponibles
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: alpha(theme.palette.action.hover, 0.5),
              borderBottom: `2px solid ${alpha(theme.palette.divider, 0.12)}`,
            }}
          >
            <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1.5 }}>
              Nombre
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1.5 }}>
              Categoría
            </TableCell>
            <TableCell sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1.5 }}>
              Estado
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 600, fontSize: "0.75rem", py: 1.5 }}>
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {features.map((feature) => (
            <TableRow
              key={feature.id}
              sx={{
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                transition: theme.transitions.create(["background-color"], {
                  duration: theme.transitions.duration.shorter,
                }),
                "&:hover": {
                  backgroundColor: alpha(theme.palette.action.hover, 0.3),
                },
              }}
            >
              <TableCell sx={{ py: 1.75 }}>
                <Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 500,
                      fontSize: "0.75rem",
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
                        maxWidth: 400,
                      }}
                      title={feature.description}
                    >
                      {feature.description}
                    </Typography>
                  )}
                </Box>
              </TableCell>
              <TableCell sx={{ py: 1.75 }}>
                <Chip
                  label={feature.category?.name || "Sin categoría"}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: "0.6875rem",
                    fontWeight: 500,
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    color: theme.palette.primary.main,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  }}
                />
              </TableCell>
              <TableCell sx={{ py: 1.75 }}>
                <Chip
                  label={STATUS_LABELS[feature.status] || feature.status}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: "0.6875rem",
                    fontWeight: 500,
                    bgcolor: alpha(theme.palette.info.main, 0.08),
                    color: theme.palette.info.main,
                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                  }}
                />
              </TableCell>
              <TableCell align="right" sx={{ py: 1.75 }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                  {onEditFeature && (
                    <Tooltip title="Editar" arrow placement="top">
                      <IconButton
                        size="small"
                        onClick={() => onEditFeature(feature)}
                        sx={{
                          color: theme.palette.text.secondary,
                          transition: theme.transitions.create(["color", "background-color", "transform"], {
                            duration: theme.transitions.duration.shorter,
                          }),
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                            color: theme.palette.primary.main,
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Eliminar" arrow placement="top">
                    <IconButton
                      size="small"
                      onClick={() => onDeleteFeature(feature.id)}
                      disabled={isRemoving === feature.id}
                      sx={{
                        color: theme.palette.text.secondary,
                        transition: theme.transitions.create(["color", "background-color", "transform"], {
                          duration: theme.transitions.duration.shorter,
                        }),
                        "&:hover": {
                          bgcolor: alpha(theme.palette.error.main, 0.12),
                          color: theme.palette.error.main,
                          transform: "scale(1.1)",
                        },
                        "&:disabled": {
                          opacity: 0.5,
                        },
                      }}
                    >
                      {isRemoving === feature.id ? (
                        <CircularProgress size={16} />
                      ) : (
                        <DeleteIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
