import { Dialog, DialogContent, DialogActions as MuiDialogActions, useTheme, alpha } from "@mui/material";
import {
  useReferenceForm,
  useReferenceValidation,
  useReferenceSave,
  useFileOperations,
  useReferenceFormValidation,
  useReferenceTypeColor,
} from "./hooks";
import {
  DialogHeader,
  ReferenceFormContent,
  DialogActions,
} from "./components";
import type { PlanReference, PlanPhase } from "../../../types";

export interface ReferenceEditDialogProps {
  readonly open: boolean;
  readonly reference: PlanReference | null;
  readonly isCreating: boolean;
  readonly onClose: () => void;
  readonly onSave: (reference: PlanReference) => void;
  readonly phases?: PlanPhase[];
  readonly startDate?: string;
  readonly endDate?: string;
  readonly calendarIds?: string[];
}

export function ReferenceEditDialog({
  open,
  reference,
  isCreating,
  onClose,
  onSave,
  phases = [],
  startDate,
  endDate,
  calendarIds = [],
}: ReferenceEditDialogProps) {
  const theme = useTheme();

  // Form state
  const {
    type,
    setType,
    title,
    setTitle,
    url,
    setUrl,
    description,
    setDescription,
    milestoneColor,
    setMilestoneColor,
    milestoneDate,
    setMilestoneDate,
    milestonePhaseId,
    setMilestonePhaseId,
    milestoneDescription,
    setMilestoneDescription,
    useCustomColor,
    customColor,
    colorPickerAnchor,
    setColorPickerAnchor,
    selectedFiles,
    setSelectedFiles,
    resetForm,
    handleCustomColorClick,
    handleCustomColorChange,
    handleColorSelect,
  } = useReferenceForm(open, reference, isCreating);

  // File operations
  const { handleFileSelect, handleFileRemove, formatFileSize } = useFileOperations();

  // Override selectedFiles from file operations hook with form state
  const fileOperations = {
    selectedFiles,
    setSelectedFiles,
    handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files && files.length > 0) {
        const newFiles = Array.from(files).map((file) => ({
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          file: file,
        }));
        setSelectedFiles((prev) => [...prev, ...newFiles]);
      }
      if (event.target) {
        event.target.value = "";
      }
    },
    handleFileRemove,
    formatFileSize,
  };

  // Validation
  const { urlError, dateError, validateUrl, validateMilestoneDate } = useReferenceValidation(
    open,
    type,
    milestoneDate,
    url,
    calendarIds,
    startDate,
    endDate
  );

  // Form validation
  const { isFormValid } = useReferenceFormValidation(
    type,
    title,
    url,
    milestoneDate,
    milestonePhaseId,
    milestoneDescription,
    urlError,
    dateError
  );

  // Type color
  const { getTypeColor } = useReferenceTypeColor(milestoneColor);

  // Save handler
  const { handleSave: handleSaveInternal } = useReferenceSave(
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
    (savedReference) => {
      onSave(savedReference);
      resetForm();
      onClose();
    }
  );

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.12)}`,
          },
        },
      }}
    >
      <DialogHeader isCreating={isCreating} />

      <DialogContent sx={{ pt: 3.5, px: 3, pb: 2 }}>
        <ReferenceFormContent
          type={type}
          title={title}
          url={url}
          description={description}
          milestoneColor={milestoneColor}
          milestoneDate={milestoneDate}
          milestonePhaseId={milestonePhaseId}
          milestoneDescription={milestoneDescription}
          useCustomColor={useCustomColor}
          customColor={customColor}
          colorPickerAnchor={colorPickerAnchor}
          selectedFiles={selectedFiles}
          phases={phases}
          startDate={startDate}
          endDate={endDate}
          urlError={urlError}
          dateError={dateError}
          getTypeColor={getTypeColor}
          onTypeChange={setType}
          onTitleChange={setTitle}
          onUrlChange={setUrl}
          onDescriptionChange={setDescription}
          onMilestoneColorSelect={handleColorSelect}
          onCustomColorClick={handleCustomColorClick}
          onColorPickerClose={() => setColorPickerAnchor(null)}
          onCustomColorChange={handleCustomColorChange}
          onMilestoneDateChange={setMilestoneDate}
          onMilestonePhaseChange={setMilestonePhaseId}
          onMilestoneDescriptionChange={setMilestoneDescription}
          onFileSelect={fileOperations.handleFileSelect}
          onFileRemove={fileOperations.handleFileRemove}
          formatFileSize={fileOperations.formatFileSize}
        />
      </DialogContent>

      <MuiDialogActions
        sx={{
          px: 3,
          py: 3,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
          gap: 1.5,
        }}
      >
        <DialogActions
          isCreating={isCreating}
          isFormValid={isFormValid}
          onCancel={handleClose}
          onSave={handleSaveInternal}
        />
      </MuiDialogActions>
    </Dialog>
  );
}

