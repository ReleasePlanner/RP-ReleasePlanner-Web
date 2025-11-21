import { memo } from "react";
import { TableHead, TableRow, TableCell, useTheme } from "@mui/material";
import type { PlanComponentsStyles } from "../hooks/usePlanComponentsStyles";

export const ComponentsTableHeader = memo(function ComponentsTableHeader({
  styles,
}: {
  readonly styles: PlanComponentsStyles;
}) {
  const theme = useTheme();
  const headerStyles = styles.getTableHeaderStyles();

  return (
    <TableHead>
      <TableRow>
        <TableCell
          sx={{
            ...headerStyles,
            px: { xs: 0.25, sm: 0.5 },
            width: "auto",
          }}
        >
          Actions
        </TableCell>
        <TableCell sx={headerStyles}>Component</TableCell>
        <TableCell sx={headerStyles}>Type</TableCell>
        <TableCell sx={headerStyles}>Current Version</TableCell>
        <TableCell sx={headerStyles}>New Version</TableCell>
      </TableRow>
    </TableHead>
  );
});

