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
  Tooltip,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { type ComponentVersion } from "@/features/releasePlans/components/Plan/CommonDataCard/types";

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
            <TableCell sx={{ fontWeight: 600 }}>Version</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
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
                  <Typography variant="body2">{component.name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.success.main,
                    }}
                  >
                    {component.version || "N/A"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    {component.type}
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
                    <Tooltip title="Edit component">
                      <IconButton
                        size="small"
                        onClick={() => onEditComponent(component)}
                      >
                        <EditIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete component">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDeleteComponent(component.id)}
                      >
                        <DeleteIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                      </IconButton>
                    </Tooltip>
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
