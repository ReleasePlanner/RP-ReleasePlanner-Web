import { useCallback } from "react";
import { filesService } from "../../../../../../../api/services/files.service";
import type {
  PlanReference,
  PlanReferenceType,
  PlanReferenceFile,
} from "../../../../../types";

export function useReferenceSave(
  type: PlanReferenceType,
  title: string,
  url: string,
  description: string,
  milestoneDate: string,
  milestonePhaseId: string,
  milestoneDescription: string,
  milestoneColor: string,
  useCustomColor: boolean,
  customColor: string,
  selectedFiles: PlanReferenceFile[],
  isCreating: boolean,
  reference: PlanReference | null,
  validateUrl: (url: string) => boolean,
  validateMilestoneDate: (date: string) => string,
  onSave: (reference: PlanReference) => void
) {
  const handleSave = useCallback(async () => {
    if (!title.trim()) return;

    // Validate URL for link type
    if (type === "link" && url.trim() && !validateUrl(url)) {
      return;
    }

    // Validate milestone requirements
    if (type === "milestone") {
      if (!milestoneDate) {
        return;
      }
      if (!milestonePhaseId) {
        return;
      }
      const dateErr = validateMilestoneDate(milestoneDate);
      if (dateErr) {
        return;
      }
    }

    const handleClose = () => {
      // Reset handled by parent component
    };

    const now = new Date().toISOString();
    const finalColor = useCustomColor ? customColor : milestoneColor;

    // Generate unique ID
    const generateUniqueId = () => {
      if (!isCreating && reference?.id && !reference.id.startsWith("temp-")) {
        return reference.id;
      }
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 9);
      return `ref-${timestamp}-${random}`;
    };

    // Upload files if document type and has new files
    let uploadedFiles: PlanReferenceFile[] = [];
    if (type === "document" && selectedFiles.length > 0) {
      try {
        const filesToUpload = selectedFiles.filter((f) => f.file);
        const alreadyUploadedFiles = selectedFiles.filter((f) => f.url && !f.file);

        if (filesToUpload.length > 0) {
          const uploadResults = await filesService.uploadFiles(
            filesToUpload.map((f) => f.file!)
          );

          uploadedFiles = uploadResults.map((result, index) => ({
            id: filesToUpload[index].id,
            name: filesToUpload[index].name,
            size: result.size,
            type: result.mimeType,
            url: result.url,
          }));
        }

        uploadedFiles = [...uploadedFiles, ...alreadyUploadedFiles];
      } catch (error) {
        console.error("Error uploading files:", error);
        return;
      }
    }

    const referenceToSave: PlanReference = {
      id: generateUniqueId(),
      type,
      title: title.trim(),
      url: type === "link" && url.trim() ? url.trim() : undefined,
      description:
        type === "milestone"
          ? milestoneDescription.trim() || undefined
          : description.trim() || undefined,
      createdAt: reference?.createdAt || now,
      updatedAt: now,
      ...(type === "milestone" && {
        date: milestoneDate,
        phaseId:
          milestonePhaseId &&
          milestonePhaseId.trim() !== "" &&
          !milestonePhaseId.startsWith("phase-")
            ? milestonePhaseId.trim()
            : undefined,
        milestoneColor: finalColor,
      }),
      ...(type === "document" && uploadedFiles.length > 0 && {
        files: uploadedFiles,
      }),
    };

    onSave(referenceToSave);
  }, [
    type,
    title,
    url,
    description,
    milestoneDate,
    milestonePhaseId,
    milestoneDescription,
    milestoneColor,
    useCustomColor,
    customColor,
    selectedFiles,
    isCreating,
    reference,
    validateUrl,
    validateMilestoneDate,
    onSave,
  ]);

  return { handleSave };
}

