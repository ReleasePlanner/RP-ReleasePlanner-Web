import { Box, Paper, useTheme, alpha } from "@mui/material";
import { ReferenceItem } from "./ReferenceItem";
import type { PlanReference } from "../../../../types";

export type ReferencesListProps = {
  readonly references: PlanReference[];
  readonly getTypeIcon: (type: PlanReference["type"]) => React.ReactNode;
  readonly getTypeColor: (type: PlanReference["type"]) => string;
  readonly getTypeLabel: (type: PlanReference["type"]) => string;
  readonly onEdit: (reference: PlanReference) => void;
  readonly onDelete: (referenceId: string) => void;
  readonly onOpenLink?: (url?: string) => void;
  readonly onScrollToDate?: (date: string) => void;
};

export function ReferencesList({
  references,
  getTypeIcon,
  getTypeColor,
  getTypeLabel,
  onEdit,
  onDelete,
  onOpenLink,
  onScrollToDate,
}: ReferencesListProps) {
  const theme = useTheme();

  return (
    <Box sx={{ flex: 1, overflow: "auto", minHeight: 0 }}>
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {references.map((reference, index) => (
          <ReferenceItem
            key={reference.id || `ref-${index}`}
            reference={reference}
            isLast={index === references.length - 1}
            getTypeIcon={getTypeIcon}
            getTypeColor={getTypeColor}
            getTypeLabel={getTypeLabel}
            onEdit={onEdit}
            onDelete={onDelete}
            onOpenLink={onOpenLink}
            onScrollToDate={onScrollToDate}
          />
        ))}
      </Paper>
    </Box>
  );
}

