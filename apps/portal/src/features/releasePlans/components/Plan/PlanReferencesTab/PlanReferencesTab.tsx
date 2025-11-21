import { Box, Stack } from "@mui/material";
import { useReferenceOperations, useReferenceUtils } from "./hooks";
import { ReferencesHeader, ReferencesContent } from "./components";
import { ReferenceEditDialog } from "./ReferenceEditDialog";
import type { PlanReference, PlanPhase } from "../../../types";

export type PlanReferencesTabProps = {
  readonly references?: PlanReference[];
  readonly onReferencesChange?: (references: PlanReference[]) => void;
  readonly onScrollToDate?: (date: string) => void;
  readonly phases?: PlanPhase[];
  readonly startDate?: string;
  readonly endDate?: string;
  readonly calendarIds?: string[];
};

export function PlanReferencesTab({
  references = [],
  onReferencesChange,
  onScrollToDate,
  phases = [],
  startDate,
  endDate,
  calendarIds = [],
}: PlanReferencesTabProps) {
  // Operations hook
  const {
    editDialogOpen,
    editingReference,
    isCreating,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
    handleClose,
  } = useReferenceOperations(references, onReferencesChange);

  // Utils hook
  const { getTypeIcon, getTypeColor, getTypeLabel } = useReferenceUtils();

  const handleOpenLink = (url?: string) => {
    if (url) {
      globalThis.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: { xs: 1.5, sm: 2 },
        overflow: "hidden",
      }}
    >
      <Stack
        spacing={1}
        sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}
      >
        <ReferencesHeader count={references.length} onAdd={handleAdd} />

        {/* References Content */}
        <Box
          sx={{
            flex: 1,
            overflow: "hidden",
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ReferencesContent
            references={references}
            getTypeIcon={getTypeIcon}
            getTypeColor={getTypeColor}
            getTypeLabel={getTypeLabel}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onOpenLink={handleOpenLink}
            onScrollToDate={onScrollToDate}
          />
        </Box>
      </Stack>

      <ReferenceEditDialog
        open={editDialogOpen}
        reference={editingReference}
        isCreating={isCreating}
        onClose={handleClose}
        onSave={handleSave}
        phases={phases}
        startDate={startDate}
        endDate={endDate}
        calendarIds={calendarIds}
      />
    </Box>
  );
}
