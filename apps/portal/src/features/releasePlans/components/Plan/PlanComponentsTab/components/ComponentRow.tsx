import { memo } from "react";
import { TableRow, TableCell, Box, Typography, Chip, IconButton, Tooltip, useTheme, alpha } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import type { ComponentWithDetails } from "../hooks/usePlanComponents";
import type { PlanComponentsStyles } from "../hooks/usePlanComponentsStyles";

export type ComponentRowProps = {
  readonly component: ComponentWithDetails;
  readonly onEdit: (component: ComponentWithDetails) => void;
  readonly onDelete: (componentId: string) => void;
  readonly styles: PlanComponentsStyles;
};

export const ComponentRow = memo(function ComponentRow({
  component,
  onEdit,
  onDelete,
  styles,
}: ComponentRowProps) {
  const theme = useTheme();

  return (
    <TableRow
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
        <Box
          sx={{
            display: "flex",
            gap: 0.25,
            alignItems: "center",
            flexWrap: "nowrap",
          }}
        >
          <Tooltip title="Edit new version" arrow placement="top">
            <IconButton size="small" onClick={() => onEdit(component)} sx={styles.getEditButtonStyles()}>
              <EditIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete component" arrow placement="top">
            <IconButton
              size="small"
              onClick={() => onDelete(component.planComponentId)}
              sx={styles.getDeleteButtonStyles()}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
      <TableCell sx={{ py: { xs: 0.5, sm: 0.75 }, px: { xs: 0.5, sm: 0.75 } }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            fontSize: { xs: "0.625rem", sm: "0.6875rem" },
            color: theme.palette.text.primary,
            lineHeight: 1.4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
          title={component.name}
        >
          {component.name}
        </Typography>
      </TableCell>
      <TableCell sx={{ py: { xs: 0.5, sm: 0.75 }, px: { xs: 0.5, sm: 0.75 }, whiteSpace: "nowrap" }}>
        <Chip label={component.type} size="small" sx={styles.getTypeChipStyles()} />
      </TableCell>
      <TableCell sx={{ py: { xs: 0.5, sm: 0.75 }, px: { xs: 0.5, sm: 0.75 }, whiteSpace: "nowrap" }}>
        <Typography
          variant="body2"
          sx={{
            fontFamily: "monospace",
            color: theme.palette.text.secondary,
            fontSize: { xs: "0.625rem", sm: "0.6875rem" },
            lineHeight: 1.4,
          }}
        >
          {component.currentVersion || "N/A"}
        </Typography>
      </TableCell>
      <TableCell sx={{ py: { xs: 0.5, sm: 0.75 }, px: { xs: 0.5, sm: 0.75 }, whiteSpace: "nowrap" }}>
        <Typography
          variant="body2"
          sx={{
            fontFamily: "monospace",
            fontWeight: component.finalVersion ? 600 : 400,
            color: component.finalVersion ? theme.palette.primary.main : theme.palette.text.disabled,
            fontSize: { xs: "0.625rem", sm: "0.6875rem" },
            fontStyle: component.finalVersion ? "normal" : "italic",
            lineHeight: 1.4,
          }}
        >
          {component.finalVersion || "Not set"}
        </Typography>
      </TableCell>
    </TableRow>
  );
});

