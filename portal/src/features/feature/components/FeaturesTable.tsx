import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  useTheme,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import type { Feature } from "../types";
import { STATUS_LABELS, STATUS_COLORS } from "../constants";

/**
 * Props for FeaturesTable component
 */
interface FeaturesTableProps {
  features: Feature[];
  onEditFeature: (feature: Feature) => void;
  onDeleteFeature: (featureId: string) => void;
}

/**
 * FeaturesTable Component
 *
 * Displays features in a compact table with edit/delete actions.
 * Used within FeatureCard for inline display.
 *
 * @example
 * ```tsx
 * <FeaturesTable
 *   features={features}
 *   onEditFeature={handleEdit}
 *   onDeleteFeature={handleDelete}
 * />
 * ```
 */
export function FeaturesTable({
  features,
  onEditFeature,
  onDeleteFeature,
}: FeaturesTableProps) {
  const theme = useTheme();

  if (features.length === 0) {
    return (
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right" width={80}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 2 }}>
                No features yet
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right" width={80}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {features.map((feature) => (
            <TableRow
              key={feature.id}
              sx={{
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <TableCell sx={{ maxWidth: 200 }}>
                <span title={feature.description}>{feature.name}</span>
              </TableCell>
              <TableCell>{feature.category.name}</TableCell>
              <TableCell>
                <Chip
                  label={STATUS_LABELS[feature.status]}
                  size="small"
                  color={STATUS_COLORS[feature.status]}
                  variant="outlined"
                />
              </TableCell>
              <TableCell align="right">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => onEditFeature(feature)}
                  title="Edit feature"
                >
                  <EditIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDeleteFeature(feature.id)}
                  title="Delete feature"
                >
                  <DeleteIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
