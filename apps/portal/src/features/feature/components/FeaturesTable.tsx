/**
 * Features Table Component
 *
 * Minimalist and clean Material UI table for displaying features with delete actions
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
  Paper,
} from "@mui/material";
import { 
  Delete as DeleteIcon 
} from "@mui/icons-material";
import type { Feature } from "../types";
import { STATUS_LABELS, STATUS_COLORS } from "../constants";

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
 * Displays features in a minimalist and clean table with delete actions.
 */
export function FeaturesTable({
  features,
  onEditFeature,
  onDeleteFeature,
  isRemoving = null,
}: FeaturesTableProps) {
  const theme = useTheme();

  if (features.length === 0) {
    return null; // Empty state is handled by parent component
  }

  return (
    <TableContainer 
      component={Paper} 
      elevation={0}
      sx={{
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        borderRadius: 2,
        overflowX: "auto",
        overflowY: "auto",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Table 
        size="small" 
        stickyHeader 
        sx={{ 
          width: "100%",
          tableLayout: "auto",
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell 
              sx={{ 
                fontWeight: 600, 
                fontSize: { xs: "0.5625rem", sm: "0.625rem" },
                py: { xs: 0.5, sm: 0.75 },
                px: { xs: 0.25, sm: 0.5 },
                whiteSpace: "nowrap",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                backgroundColor: theme.palette.mode === "dark" 
                  ? alpha(theme.palette.background.paper, 0.8)
                  : theme.palette.background.paper,
                width: "auto",
              }}
            >
              Actions
            </TableCell>
            <TableCell 
              sx={{ 
                fontWeight: 600, 
                fontSize: { xs: "0.5625rem", sm: "0.625rem" },
                py: { xs: 0.5, sm: 0.75 },
                px: { xs: 0.5, sm: 0.75 },
                whiteSpace: "nowrap",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                backgroundColor: theme.palette.mode === "dark" 
                  ? alpha(theme.palette.background.paper, 0.8)
                  : theme.palette.background.paper,
              }}
            >
              Name
            </TableCell>
            <TableCell 
              sx={{ 
                fontWeight: 600, 
                fontSize: { xs: "0.5625rem", sm: "0.625rem" },
                py: { xs: 0.5, sm: 0.75 },
                px: { xs: 0.5, sm: 0.75 },
                whiteSpace: "nowrap",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                backgroundColor: theme.palette.mode === "dark" 
                  ? alpha(theme.palette.background.paper, 0.8)
                  : theme.palette.background.paper,
              }}
            >
              Category
            </TableCell>
            <TableCell 
              sx={{ 
                fontWeight: 600, 
                fontSize: { xs: "0.5625rem", sm: "0.625rem" },
                py: { xs: 0.5, sm: 0.75 },
                px: { xs: 0.5, sm: 0.75 },
                whiteSpace: "nowrap",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                backgroundColor: theme.palette.mode === "dark" 
                  ? alpha(theme.palette.background.paper, 0.8)
                  : theme.palette.background.paper,
              }}
            >
              Status
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
                  backgroundColor: alpha(theme.palette.action.hover, 0.04),
                },
              }}
            >
              <TableCell sx={{ py: { xs: 0.5, sm: 0.75 }, px: { xs: 0.25, sm: 0.5 }, whiteSpace: "nowrap" }}>
                <Tooltip title="Remove feature" arrow placement="top">
                  <IconButton
                    size="small"
                    onClick={() => onDeleteFeature(feature.id)}
                    disabled={isRemoving === feature.id}
                    sx={{
                      fontSize: { xs: 14, sm: 16 },
                      p: { xs: 0.375, sm: 0.5 },
                      color: theme.palette.text.secondary,
                      transition: theme.transitions.create(["color", "background-color"], {
                        duration: theme.transitions.duration.shorter,
                      }),
                      "&:hover": {
                        color: theme.palette.error.main,
                        bgcolor: alpha(theme.palette.error.main, 0.08),
                      },
                      "&:disabled": {
                        opacity: 0.5,
                      },
                    }}
                  >
                    {isRemoving === feature.id ? (
                      <CircularProgress size={14} />
                    ) : (
                      <DeleteIcon fontSize="inherit" />
                    )}
                  </IconButton>
                </Tooltip>
              </TableCell>
              <TableCell sx={{ py: { xs: 0.5, sm: 0.75 }, px: { xs: 0.5, sm: 0.75 } }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    fontSize: { xs: "0.625rem", sm: "0.6875rem" },
                    color: theme.palette.text.primary,
                    mb: feature.description ? 0.125 : 0,
                    wordBreak: "break-word",
                    lineHeight: 1.3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                  title={feature.name}
                >
                  {feature.name}
                </Typography>
                {feature.description && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: { xs: "0.5625rem", sm: "0.625rem" },
                      color: theme.palette.text.secondary,
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      lineHeight: 1.2,
                      mt: 0.125,
                    }}
                    title={feature.description}
                  >
                    {feature.description}
                  </Typography>
                )}
              </TableCell>
              <TableCell sx={{ py: { xs: 0.5, sm: 0.75 }, px: { xs: 0.5, sm: 0.75 }, whiteSpace: "nowrap" }}>
                <Chip
                  label={feature.category?.name || "No category"}
                  size="small"
                  sx={{
                    height: { xs: 16, sm: 18 },
                    fontSize: { xs: "0.5625rem", sm: "0.625rem" },
                    fontWeight: 500,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    "& .MuiChip-label": {
                      px: { xs: 0.5, sm: 0.625 },
                    },
                  }}
                />
              </TableCell>
              <TableCell sx={{ py: { xs: 0.5, sm: 0.75 }, px: { xs: 0.5, sm: 0.75 }, whiteSpace: "nowrap" }}>
                <Chip
                  label={STATUS_LABELS[feature.status] || feature.status}
                  size="small"
                  color={STATUS_COLORS[feature.status]}
                  variant="outlined"
                  sx={{
                    height: { xs: 16, sm: 18 },
                    fontSize: { xs: "0.5625rem", sm: "0.625rem" },
                    fontWeight: 500,
                    "& .MuiChip-label": {
                      px: { xs: 0.5, sm: 0.625 },
                    },
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
