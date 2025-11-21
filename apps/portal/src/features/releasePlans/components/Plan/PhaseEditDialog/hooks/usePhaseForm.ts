import { useState, useEffect, useCallback } from "react";
import {
  utcToLocalDate,
  localDateToUTC,
  getCurrentDateUTC,
  addDays,
} from "../../../../lib/date";
import type { PlanPhase } from "../../../../types";

export type PhaseFormData = {
  name: string;
  startDate: string;
  endDate: string;
  color: string;
};

export type PhaseFormErrors = {
  name?: string;
  startDate?: string;
  endDate?: string;
  dateRange?: string;
  color?: string;
};

export function usePhaseForm(open: boolean, phase: PlanPhase | null) {
  const [formData, setFormData] = useState<PhaseFormData>({
    name: "",
    startDate: "",
    endDate: "",
    color: "#185ABD",
  });

  const [errors, setErrors] = useState<PhaseFormErrors>({});
  const [hasInteracted, setHasInteracted] = useState(false);

  // Initialize form when dialog opens
  useEffect(() => {
    if (!open) {
      return;
    }

    setHasInteracted(false);
    setErrors({});

    if (phase) {
      // Editing existing phase
      setFormData({
        name: phase.name || "",
        startDate: phase.startDate ? utcToLocalDate(phase.startDate) : "",
        endDate: phase.endDate ? utcToLocalDate(phase.endDate) : "",
        color: phase.color || "#185ABD",
      });
    } else {
      // New phase - calculate defaults
      const todayUTC = getCurrentDateUTC();
      const [year, month, day] = todayUTC.split("-").map(Number);
      const weekLaterDate = addDays(
        new Date(Date.UTC(year, month - 1, day)),
        7
      );
      const weekLaterUTC = weekLaterDate.toISOString().slice(0, 10);

      setFormData({
        name: "",
        startDate: utcToLocalDate(todayUTC),
        endDate: utcToLocalDate(weekLaterUTC),
        color: "#185ABD",
      });
    }
  }, [open, phase]);

  const updateField = useCallback(
    (field: keyof PhaseFormData, value: string) => {
      if (!hasInteracted) setHasInteracted(true);
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [hasInteracted]
  );

  const setError = useCallback((field: keyof PhaseFormErrors, error?: string) => {
    setErrors((prev) => {
      if (error) {
        return { ...prev, [field]: error };
      }
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const setErrorsState = useCallback((newErrors: Partial<PhaseFormErrors>) => {
    setErrors((prev) => ({ ...prev, ...newErrors }));
  }, []);

  const convertToUTC = useCallback((): {
    startDateUTC: string;
    endDateUTC: string;
  } => {
    return {
      startDateUTC: formData.startDate
        ? localDateToUTC(formData.startDate)
        : "",
      endDateUTC: formData.endDate ? localDateToUTC(formData.endDate) : "",
    };
  }, [formData.startDate, formData.endDate]);

  return {
    formData,
    errors,
    hasInteracted,
    updateField,
    setError,
    setErrorsState,
    convertToUTC,
  };
}

