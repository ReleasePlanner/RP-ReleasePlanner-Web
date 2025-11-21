import { useCallback, useMemo } from "react";
import { Box, Stack } from "@mui/material";
import { useAppSelector } from "../../../../../store/hooks";
import type { PlanPhase } from "../../../types";
import { BaseEditDialog } from "../../../../../components/BaseEditDialog";
import type { RootState } from "../../../../../store/store";
import {
  usePhaseForm,
  usePhaseValidation,
  usePhaseFormValidation,
} from "./hooks";
import { PhaseNameField, PhaseDateFields, PhaseColorField } from "./components";

export type PhaseEditDialogProps = {
  readonly open: boolean;
  readonly phase: PlanPhase | null;
  readonly planPhases?: PlanPhase[]; // All phases in the current plan
  readonly onCancel: () => void;
  readonly onSave: (phase: PlanPhase) => void;
};

export default function PhaseEditDialog({
  open,
  phase,
  planPhases = [],
  onCancel,
  onSave,
}: PhaseEditDialogProps) {
  const basePhases = useAppSelector(
    (state: RootState) => state.basePhases.phases
  );
  const isNew = !phase?.id || phase.id.startsWith("new-");

  // Form state management
  const {
    formData,
    errors,
    hasInteracted,
    updateField,
    setError,
    setErrorsState,
    convertToUTC,
  } = usePhaseForm(open, phase);

  // Validation logic
  const {
    isBasePhase,
    validatePhaseName,
    validateColor,
    validateDates,
    validateBasePhase,
    validateLocalPhase,
  } = usePhaseValidation(
    open,
    formData,
    phase,
    planPhases,
    basePhases,
    setError,
    setErrorsState
  );

  // Auto-validation with debounce
  const { isValidating } = usePhaseFormValidation(
    open,
    formData,
    hasInteracted,
    validatePhaseName,
    validateColor,
    validateDates
  );

  // Form validity check
  const isFormValid = useMemo(() => {
    const hasDateErrors = !!(
      errors.startDate ||
      errors.endDate ||
      errors.dateRange
    );

    if (isBasePhase) {
      return (
        formData.startDate !== "" && formData.endDate !== "" && !hasDateErrors
      );
    }

    const hasOtherErrors = !!(errors.name || errors.color);
    return (
      formData.name.trim() !== "" &&
      formData.startDate !== "" &&
      formData.endDate !== "" &&
      !hasDateErrors &&
      !hasOtherErrors &&
      !isValidating
    );
  }, [formData, errors, isValidating, isBasePhase]);

  // Helper: Validate and convert dates
  const validateAndConvertDates = useCallback((): {
    startDateUTC: string;
    endDateUTC: string;
    isValid: boolean;
  } => {
    const { startDateUTC, endDateUTC } = convertToUTC();

    if (startDateUTC && endDateUTC) {
      return { startDateUTC, endDateUTC, isValid: true };
    }

    setErrorsState({
      startDate: startDateUTC ? undefined : "Invalid start date",
      endDate: endDateUTC ? undefined : "Invalid end date",
    });
    return { startDateUTC, endDateUTC, isValid: false };
  }, [convertToUTC, setErrorsState]);

  // Helper: Create saved phase object
  const createSavedPhase = useCallback(
    (startDateUTC: string, endDateUTC: string): PlanPhase => {
      return {
        id: phase?.id || `phase-${Date.now()}`,
        name: isBasePhase ? phase?.name || "" : formData.name.trim(),
        startDate: startDateUTC,
        endDate: endDateUTC,
        color: isBasePhase ? phase?.color || "#185ABD" : formData.color,
      };
    },
    [phase, isBasePhase, formData.name, formData.color]
  );

  // Helper: Validate saved phase has all required fields
  const validateSavedPhase = useCallback(
    (savedPhase: PlanPhase): boolean => {
      if (savedPhase.name && savedPhase.startDate && savedPhase.endDate) {
        return true;
      }

      setErrorsState({
        name: savedPhase.name ? undefined : "Phase name is required",
        startDate: savedPhase.startDate ? undefined : "Start date is required",
        endDate: savedPhase.endDate ? undefined : "End date is required",
      });
      return false;
    },
    [setErrorsState]
  );

  // Save handler
  const handleSave = useCallback(() => {
    // Validate based on phase type
    const isValid = isBasePhase ? validateBasePhase() : validateLocalPhase();
    if (!isValid) return;

    // Convert dates to UTC and validate
    const {
      startDateUTC,
      endDateUTC,
      isValid: datesValid,
    } = validateAndConvertDates();
    if (!datesValid) return;

    // Create saved phase
    const savedPhase = createSavedPhase(startDateUTC, endDateUTC);

    // Final validation
    if (!validateSavedPhase(savedPhase)) return;

    onSave(savedPhase);
    onCancel();
  }, [
    isBasePhase,
    validateBasePhase,
    validateLocalPhase,
    validateAndConvertDates,
    createSavedPhase,
    validateSavedPhase,
    onSave,
    onCancel,
  ]);

  // Keyboard handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && isFormValid) {
        e.preventDefault();
        handleSave();
      }
      if (e.key === "Escape") {
        onCancel();
      }
    },
    [isFormValid, handleSave, onCancel]
  );

  return (
    <BaseEditDialog
      open={open}
      onClose={onCancel}
      editing={!isNew}
      title={isNew ? "New Phase" : "Edit Phase"}
      subtitle={
        isBasePhase
          ? "Standard maintenance phase - You can only edit dates"
          : "Modify phase details"
      }
      subtitleChip={isBasePhase ? "Base Phase" : undefined}
      maxWidth="sm"
      fullWidth={true}
      onSave={handleSave}
      saveButtonText="Save Changes"
      cancelButtonText="Cancel"
      isFormValid={isFormValid}
      saveButtonDisabled={!isFormValid}
      showDefaultActions={true}
    >
      <Box sx={{ pt: 1, width: "100%" }}>
        <Stack spacing={3} sx={{ width: "100%" }}>
          <PhaseNameField
            isBasePhase={isBasePhase}
            phaseName={phase?.name}
            formData={formData}
            errors={errors}
            isValidating={isValidating}
            hasInteracted={hasInteracted}
            onNameChange={(value) => updateField("name", value)}
            onKeyDown={handleKeyDown}
          />

          <PhaseDateFields
            formData={formData}
            errors={errors}
            onStartDateChange={(value) => updateField("startDate", value)}
            onEndDateChange={(value) => updateField("endDate", value)}
            onKeyDown={handleKeyDown}
          />

          <PhaseColorField
            isBasePhase={isBasePhase}
            phaseColor={phase?.color}
            formData={formData}
            errors={errors}
            onColorChange={(value) => updateField("color", value)}
          />
        </Stack>
      </Box>
    </BaseEditDialog>
  );
}
