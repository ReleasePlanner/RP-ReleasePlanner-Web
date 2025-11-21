import { useState } from "react";
import type { PlanReference } from "../../../../types";

export function useReferenceOperations(
  references: PlanReference[],
  onReferencesChange?: (references: PlanReference[]) => void
) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingReference, setEditingReference] =
    useState<PlanReference | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleAdd = () => {
    setEditingReference(null);
    setIsCreating(true);
    setEditDialogOpen(true);
  };

  const handleEdit = (reference: PlanReference) => {
    setEditingReference(reference);
    setIsCreating(false);
    setEditDialogOpen(true);
  };

  const handleDelete = (referenceId: string) => {
    if (onReferencesChange) {
      onReferencesChange(references.filter((r) => r.id !== referenceId));
    }
  };

  const handleSave = (reference: PlanReference) => {
    if (onReferencesChange) {
      if (isCreating) {
        // Check if reference already exists (by ID or by content for milestones)
        const existsById =
          reference.id && references.some((r) => r.id === reference.id);
        const existsByContent =
          reference.type === "milestone" && reference.date
            ? references.some(
                (r) =>
                  r.type === "milestone" &&
                  r.date === reference.date &&
                  r.phaseId === reference.phaseId
              )
            : false;

        if (!existsById && !existsByContent) {
          onReferencesChange([...references, reference]);
        }
      } else {
        onReferencesChange(
          references.map((r) => (r.id === reference.id ? reference : r))
        );
      }
    }
    setEditDialogOpen(false);
    setEditingReference(null);
    setIsCreating(false);
  };

  const handleClose = () => {
    setEditDialogOpen(false);
    setEditingReference(null);
    setIsCreating(false);
  };

  return {
    editDialogOpen,
    editingReference,
    isCreating,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
    handleClose,
  };
}

