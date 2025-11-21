import { useMemo } from "react";
import type { PlanReferenceType } from "../../../../../types";

export function useReferenceFormValidation(
  type: PlanReferenceType,
  title: string,
  url: string,
  milestoneDate: string,
  milestonePhaseId: string,
  milestoneDescription: string,
  urlError: string,
  dateError: string
) {
  const isFormValid = useMemo(() => {
    if (!title.trim()) return false;
    if (type === "link" && !url.trim()) return false;
    if (type === "milestone") {
      if (!milestoneDate || !milestonePhaseId || !milestoneDescription.trim() || !!dateError) {
        return false;
      }
    }
    if (!!urlError) return false;
    return true;
  }, [
    type,
    title,
    url,
    milestoneDate,
    milestonePhaseId,
    milestoneDescription,
    urlError,
    dateError,
  ]);

  return { isFormValid };
}

