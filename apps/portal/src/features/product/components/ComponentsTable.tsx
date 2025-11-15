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
  Chip,
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
      <Table size="medium" sx={{ borderCollapse: "separate", borderSpacing: 0 }}>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: 700,
                fontSize: "0.75rem",
                color: theme.palette.text.secondary,
                textTransform: "uppercase",
                letterSpacing: "1px",
                pb: 1.5,
                pt: 0,
                borderBottom: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
                bgcolor: alpha(theme.palette.action.hover, 0.3),
              }}
            >
              Component
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 700,
                fontSize: "0.75rem",
                color: theme.palette.text.secondary,
                textTransform: "uppercase",
                letterSpacing: "1px",
                pb: 1.5,
                pt: 0,
                borderBottom: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
                bgcolor: alpha(theme.palette.action.hover, 0.3),
              }}
            >
              Version
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 700,
                fontSize: "0.75rem",
                color: theme.palette.text.secondary,
                textTransform: "uppercase",
                letterSpacing: "1px",
                pb: 1.5,
                pt: 0,
                borderBottom: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
                bgcolor: alpha(theme.palette.action.hover, 0.3),
              }}
            >
              Type
            </TableCell>
            <TableCell
              align="right"
              sx={{
                fontWeight: 700,
                fontSize: "0.75rem",
                color: theme.palette.text.secondary,
                textTransform: "uppercase",
                letterSpacing: "1px",
                pb: 1.5,
                pt: 0,
                borderBottom: `2px solid ${alpha(theme.palette.divider, 0.2)}`,
                bgcolor: alpha(theme.palette.action.hover, 0.3),
                width: 100,
              }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {components.map((component, index) => (
            <TableRow
              key={component.id}
              sx={{
                transition: theme.transitions.create(["background-color"], {
                  duration: theme.transitions.duration.shorter,
                }),
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                },
                "&:last-child td": {
                  borderBottom: "none",
                },
                "& td": {
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                },
              }}
            >
              <TableCell
                sx={{
                  py: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: theme.palette.text.primary,
                  }}
                >
                  {component.name}
                </Typography>
              </TableCell>
              <TableCell
                sx={{
                  py: 2,
                }}
              >
                {component.version ? (
                  <Chip
                    label={component.version}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.8125rem",
                      fontFamily: "monospace",
                      height: 26,
                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                      color: theme.palette.primary.main,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      "& .MuiChip-label": {
                        px: 1.5,
                      },
                    }}
                  />
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
                  py: 2,
                }}
              >
                <Chip
                  label={component.type}
                  size="small"
                  sx={{
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    textTransform: "capitalize",
                    height: 24,
                    bgcolor: alpha(theme.palette.text.secondary, 0.08),
                    color: theme.palette.text.secondary,
                    "& .MuiChip-label": {
                      px: 1.5,
                    },
                  }}
                />
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  py: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 0.5,
                    justifyContent: "flex-end",
                  }}
                >
                  <Tooltip title="Edit Component" arrow placement="top">
                    <IconButton
                      size="small"
                      onClick={() => onEditComponent(component)}
                      sx={{
                        color: theme.palette.text.secondary,
                        transition: theme.transitions.create(["color", "background-color", "transform"], {
                          duration: theme.transitions.duration.shorter,
                        }),
                        "&:hover": {
                          color: theme.palette.primary.main,
                          bgcolor: alpha(theme.palette.primary.main, 0.12),
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Component" arrow placement="top">
                    <IconButton
                      size="small"
                      onClick={() => onDeleteComponent(component.id)}
                      sx={{
                        color: theme.palette.text.secondary,
                        transition: theme.transitions.create(["color", "background-color", "transform"], {
                          duration: theme.transitions.duration.shorter,
                        }),
                        "&:hover": {
                          color: theme.palette.error.main,
                          bgcolor: alpha(theme.palette.error.main, 0.12),
                          transform: "scale(1.1)",
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
