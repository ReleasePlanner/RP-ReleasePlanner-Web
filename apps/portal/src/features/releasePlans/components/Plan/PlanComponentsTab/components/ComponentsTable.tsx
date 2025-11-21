import { memo } from "react";
import { Box, Table, TableBody, TableContainer, Paper, useTheme, alpha } from "@mui/material";
import type { ComponentWithDetails } from "../hooks/usePlanComponents";
import { ComponentsTableHeader } from "./ComponentsTableHeader";
import { ComponentRow } from "./ComponentRow";
import type { PlanComponentsStyles } from "../hooks/usePlanComponentsStyles";

export type ComponentsTableProps = {
  readonly components: ComponentWithDetails[];
  readonly onEdit: (component: ComponentWithDetails) => void;
  readonly onDelete: (componentId: string) => void;
  readonly styles: PlanComponentsStyles;
};

export const ComponentsTable = memo(function ComponentsTable({
  components,
  onEdit,
  onDelete,
  styles,
}: ComponentsTableProps) {
  const theme = useTheme();

  return (
    <Box sx={{ flex: 1, overflow: "auto", minHeight: 0, display: "flex", flexDirection: "column" }}>
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
        <Table size="small" stickyHeader sx={{ width: "100%", tableLayout: "auto" }}>
          <ComponentsTableHeader styles={styles} />
          <TableBody>
            {components.map((component) => (
              <ComponentRow
                key={component.id}
                component={component}
                onEdit={onEdit}
                onDelete={onDelete}
                styles={styles}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
});

