/**
 * Components Table Component
 *
 * Minimalist table displaying components with clean actions
 */

import {
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
  alpha,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import type { ComponentVersion } from "@/features/releasePlans/components/Plan/CommonDataCard";

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

  if (components.length === 0) {
    return (
      <Box
        sx={{
          py: 3,
          textAlign: "center",
          color: theme.palette.text.disabled,
        }}
      >
        <Typography variant="body2" sx={{ fontSize: "0.8125rem" }}>
          No components yet
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table size="small" sx={{ borderCollapse: "separate", borderSpacing: 0 }}>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: 600,
                fontSize: "0.75rem",
                color: theme.palette.text.secondary,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                pb: 1,
                pt: 0,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              }}
            >
              Component
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 600,
                fontSize: "0.75rem",
                color: theme.palette.text.secondary,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                pb: 1,
                pt: 0,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              }}
            >
              Version
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 600,
                fontSize: "0.75rem",
                color: theme.palette.text.secondary,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                pb: 1,
                pt: 0,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              }}
            >
              Type
            </TableCell>
            <TableCell
              align="right"
              sx={{
                fontWeight: 600,
                fontSize: "0.75rem",
                color: theme.palette.text.secondary,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                pb: 1,
                pt: 0,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                width: 80,
              }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {components.map((component) => (
            <TableRow
              key={component.id}
              sx={{
                "&:hover": {
                  bgcolor: alpha(theme.palette.action.hover, 0.3),
                },
                "&:last-child td": {
                  borderBottom: "none",
                },
              }}
            >
              <TableCell
                sx={{
                  py: 1.5,
                  borderBottom: `1px solid ${alpha(
                    theme.palette.divider,
                    0.3
                  )}`,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    fontSize: "0.8125rem",
                    color: theme.palette.text.primary,
                  }}
                >
                  {component.name}
                </Typography>
              </TableCell>
              <TableCell
                sx={{
                  py: 1.5,
                  borderBottom: `1px solid ${alpha(
                    theme.palette.divider,
                    0.3
                  )}`,
                }}
              >
                {component.version ? (
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.8125rem",
                      fontFamily: "monospace",
                      color: theme.palette.text.primary,
                      display: "inline-block",
                      px: 1,
                      py: 0.25,
                      borderRadius: 0.5,
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                    }}
                  >
                    {component.version}
                  </Typography>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.8125rem",
                      color: theme.palette.text.disabled,
                      fontStyle: "italic",
                    }}
                  >
                    No version
                  </Typography>
                )}
              </TableCell>
              <TableCell
                sx={{
                  py: 1.5,
                  borderBottom: `1px solid ${alpha(
                    theme.palette.divider,
                    0.3
                  )}`,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "0.8125rem",
                    color: theme.palette.text.secondary,
                    textTransform: "capitalize",
                  }}
                >
                  {component.type}
                </Typography>
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  py: 1.5,
                  borderBottom: `1px solid ${alpha(
                    theme.palette.divider,
                    0.3
                  )}`,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 0.25,
                    justifyContent: "flex-end",
                  }}
                >
                  <Tooltip title="Edit" arrow placement="top">
                    <IconButton
                      size="small"
                      onClick={() => onEditComponent(component)}
                      sx={{
                        color: theme.palette.text.secondary,
                        "&:hover": {
                          color: theme.palette.primary.main,
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                        },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete" arrow placement="top">
                    <IconButton
                      size="small"
                      onClick={() => onDeleteComponent(component.id)}
                      sx={{
                        color: theme.palette.text.secondary,
                        "&:hover": {
                          color: theme.palette.error.main,
                          bgcolor: alpha(theme.palette.error.main, 0.08),
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
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
