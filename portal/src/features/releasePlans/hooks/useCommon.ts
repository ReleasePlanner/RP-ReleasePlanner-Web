import { useState, useCallback } from "react";

/**
 * Hook for managing boolean toggle states (modals, dialogs, etc.)
 * Follows DRY principle - avoid repetitive useState(false) patterns
 */
export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue((prev) => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return {
    value,
    toggle,
    open: setTrue,
    close: setFalse,
    setValue,
  };
}

/**
 * Hook for managing form field states with validation
 * Reduces boilerplate in dialog components
 */
export function useFormField<T>(
  initialValue: T,
  validator?: (value: T) => string | null
) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const validate = useCallback(
    (newValue: T) => {
      if (validator) {
        const validationError = validator(newValue);
        setError(validationError);
        return validationError === null;
      }
      return true;
    },
    [validator]
  );

  const onChange = useCallback(
    (newValue: T) => {
      setValue(newValue);
      if (touched) {
        validate(newValue);
      }
    },
    [validate, touched]
  );

  const onBlur = useCallback(() => {
    setTouched(true);
    validate(value);
  }, [validate, value]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
    setTouched(false);
  }, [initialValue]);

  return {
    value,
    error,
    touched,
    isValid: error === null,
    onChange,
    onBlur,
    reset,
  };
}

/**
 * Hook for managing phase editing state
 * Centralizes phase edit logic across components
 */
export function usePhaseEdit() {
  const [isOpen, setIsOpen] = useState(false);
  const [phaseId, setPhaseId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [color, setColor] = useState("#217346");

  const openEdit = useCallback(
    (
      id: string,
      initialStartDate?: string,
      initialEndDate?: string,
      initialColor?: string
    ) => {
      setPhaseId(id);
      setStartDate(initialStartDate || "");
      setEndDate(initialEndDate || "");
      setColor(initialColor || "#217346");
      setIsOpen(true);
    },
    []
  );

  const close = useCallback(() => {
    setIsOpen(false);
    setPhaseId(null);
    setStartDate("");
    setEndDate("");
    setColor("#217346");
  }, []);

  return {
    isOpen,
    phaseId,
    startDate,
    endDate,
    color,
    setStartDate,
    setEndDate,
    setColor,
    openEdit,
    close,
  };
}
