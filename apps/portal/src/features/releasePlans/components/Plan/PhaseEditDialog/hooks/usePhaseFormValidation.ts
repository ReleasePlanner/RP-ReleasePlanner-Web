import { useState, useEffect } from "react";
import type { PhaseFormData, PhaseFormErrors } from "./usePhaseForm";

export function usePhaseFormValidation(
  open: boolean,
  formData: PhaseFormData,
  hasInteracted: boolean,
  validatePhaseName: (name: string) => boolean,
  validateColor: (color: string) => boolean,
  validateDates: () => boolean
) {
  const [isValidating, setIsValidating] = useState(false);

  // Validate name with debounce - only after user interaction
  useEffect(() => {
    if (!open || !hasInteracted) return;

    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      setIsValidating(false);
      return;
    }

    setIsValidating(true);
    const timeoutId = setTimeout(() => {
      validatePhaseName(trimmedName);
      setIsValidating(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [formData.name, open, hasInteracted, validatePhaseName]);

  // Validate color on change - only after user interaction
  useEffect(() => {
    if (!open || !hasInteracted || !formData.color) return;
    validateColor(formData.color);
  }, [formData.color, open, hasInteracted, validateColor]);

  // Validate dates on change - only after user interaction
  useEffect(() => {
    if (!open || !hasInteracted) return;
    if (formData.startDate || formData.endDate) {
      validateDates();
    }
  }, [
    formData.startDate,
    formData.endDate,
    open,
    hasInteracted,
    validateDates,
  ]);

  return { isValidating };
}

