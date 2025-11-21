import { useState, useEffect, useCallback } from "react";
import type { PlanComponent } from "../../../../../types";
import { validateVersion } from "./useVersionValidation";

export type VersionFormState = {
  finalVersion: string;
  versionError: string;
};

export function useVersionForm(
  open: boolean,
  component: PlanComponent | null,
  currentVersion: string
) {
  const [finalVersion, setFinalVersion] = useState("");
  const [versionError, setVersionError] = useState("");

  useEffect(() => {
    if (open && component) {
      setFinalVersion(component.finalVersion || "");
      setVersionError("");
    }
  }, [open, component]);

  const handleVersionChange = useCallback(
    (value: string) => {
      const cleaned = value.replace(/[^\d.\-+A-Za-z]/g, "");
      setFinalVersion(cleaned);

      const validation = validateVersion(cleaned, currentVersion);
      setVersionError(validation.error);
    },
    [currentVersion]
  );

  const validateForm = useCallback((): boolean => {
    if (!finalVersion.trim()) return false;

    const validation = validateVersion(finalVersion, currentVersion);
    setVersionError(validation.error);
    return validation.isValid;
  }, [finalVersion, currentVersion]);

  return {
    finalVersion,
    versionError,
    handleVersionChange,
    validateForm,
  };
}

