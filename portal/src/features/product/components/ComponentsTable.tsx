/**
 * Components Table Component
 *
 * Displays components in a table with edit and delete actions
 */

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  Box,
  IconButton,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { type ComponentVersion, type ComponentTypeValue } from "../types";
import { COMPONENT_TYPE_LABELS } from "../constants";

interface ComponentsTableProps {
  components: ComponentVersion[];
  onEditComponent: (component: ComponentVersion) => void;
  onDeleteComponent: (componentId: string) => void;
}

export function ComponentsTable({
  components,
  onEditComponent,
  onDeleteComponent,
}: ComponentsTableProps) {
  const theme = useTheme();

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead sx={{ backgroundColor: theme.palette.action.hover }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Component</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Current</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Previous</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {components.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  No components yet
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            components.map((component) => (
              <TableRow key={component.id}>
                <TableCell>
                  <Typography variant="body2">
                    {
                      COMPONENT_TYPE_LABELS[
                        component.type as ComponentTypeValue
                      ]
                    }
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.success.main,
                    }}
                  >
                    {component.currentVersion}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    {component.previousVersion}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Box
                    sx={{
                      display: "flex",
                      gap: 0.5,
                      justifyContent: "flex-end",
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => onEditComponent(component)}
                      title="Edit component"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onDeleteComponent(component.id)}
                      title="Delete component"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
