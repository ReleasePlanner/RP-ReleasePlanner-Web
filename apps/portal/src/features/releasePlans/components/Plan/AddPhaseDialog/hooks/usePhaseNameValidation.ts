import { useEffect, useCallback } from "react";

export function usePhaseNameValidation(
  open: boolean,
  tabValue: number,
  newPhaseName: string,
  existingPhaseNames: string[],
  setError: (error: string) => void,
  setIsValidating: (validating: boolean) => void
) {
  const validatePhaseName = useCallback(
    (name: string): boolean => {
      const trimmedName = name.trim();
      if (!trimmedName) {
        setError("El nombre de la fase es requerido");
        return false;
      }

      const normalizedNew = trimmedName.toLowerCase().trim();

      if (existingPhaseNames.includes(normalizedNew)) {
        setError("Ya existe una fase con este nombre en el plan");
        return false;
      }

      setError("");
      return true;
    },
    [existingPhaseNames, setError]
  );

  // Validate on name change with debounce
  useEffect(() => {
    if (!open || tabValue !== 1) return;

    const trimmedName = newPhaseName.trim();
    if (!trimmedName) {
      setError("");
      setIsValidating(false);
      return;
    }

    setIsValidating(true);
    const timeoutId = setTimeout(() => {
      validatePhaseName(trimmedName);
      setIsValidating(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [newPhaseName, open, tabValue, validatePhaseName, setError, setIsValidating]);

  return { validatePhaseName };
}

