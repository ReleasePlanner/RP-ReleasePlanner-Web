import { useState, useEffect, useCallback } from "react";

export function useAddPhaseForm(open: boolean) {
  const [tabValue, setTabValue] = useState(0);
  const [selectedBasePhaseIds, setSelectedBasePhaseIds] = useState<Set<string>>(new Set());
  const [newPhaseName, setNewPhaseName] = useState("");
  const [newPhaseColor, setNewPhaseColor] = useState("#1976D2");
  const [error, setError] = useState<string>("");
  const [isValidating, setIsValidating] = useState(false);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setSelectedBasePhaseIds(new Set());
      setNewPhaseName("");
      setNewPhaseColor("#1976D2");
      setError("");
      setIsValidating(false);
      setTabValue(0);
    }
  }, [open]);

  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError("");
  }, []);

  const handleBasePhaseToggle = useCallback((phaseId: string) => {
    setSelectedBasePhaseIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(phaseId)) {
        newSet.delete(phaseId);
      } else {
        newSet.add(phaseId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAllBasePhases = useCallback((availableBasePhases: Array<{ id: string }>) => {
    setSelectedBasePhaseIds((prev) => {
      if (prev.size === availableBasePhases.length) {
        return new Set();
      }
      return new Set(availableBasePhases.map((bp) => bp.id));
    });
  }, []);

  return {
    tabValue,
    selectedBasePhaseIds,
    newPhaseName,
    newPhaseColor,
    error,
    isValidating,
    setTabValue: handleTabChange,
    setNewPhaseName,
    setNewPhaseColor,
    setError,
    setIsValidating,
    handleBasePhaseToggle,
    handleSelectAllBasePhases,
  };
}

