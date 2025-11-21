import { Box } from "@mui/material";
import { ReferencesEmptyState } from "./ReferencesEmptyState";
import { ReferencesList } from "./ReferencesList";
import type { PlanReference } from "../../../../types";

export type ReferencesContentProps = {
  readonly references: PlanReference[];
  readonly getTypeIcon: (type: PlanReference["type"]) => React.ReactNode;
  readonly getTypeColor: (type: PlanReference["type"]) => string;
  readonly getTypeLabel: (type: PlanReference["type"]) => string;
  readonly onEdit: (reference: PlanReference) => void;
  readonly onDelete: (referenceId: string) => void;
  readonly onOpenLink?: (url?: string) => void;
  readonly onScrollToDate?: (date: string) => void;
};

export function ReferencesContent({
  references,
  getTypeIcon,
  getTypeColor,
  getTypeLabel,
  onEdit,
  onDelete,
  onOpenLink,
  onScrollToDate,
}: ReferencesContentProps) {
  if (references.length === 0) {
    return <ReferencesEmptyState />;
  }

  return (
    <ReferencesList
      references={references}
      getTypeIcon={getTypeIcon}
      getTypeColor={getTypeColor}
      getTypeLabel={getTypeLabel}
      onEdit={onEdit}
      onDelete={onDelete}
      onOpenLink={onOpenLink}
      onScrollToDate={onScrollToDate}
    />
  );
}

