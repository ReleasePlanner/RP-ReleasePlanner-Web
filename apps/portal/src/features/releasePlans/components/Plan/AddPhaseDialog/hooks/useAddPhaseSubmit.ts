import { useCallback } from "react";
import type { BasePhase } from "../../../../../../api/services/basePhases.service";
import type { PlanPhase } from "../../../../types";

function calculateDefaultDates(planStartDate?: string): { startDate: string; endDate: string } {
  if (planStartDate) {
    const phaseStart = new Date(planStartDate);
    const phaseEnd = new Date(phaseStart);
    phaseEnd.setDate(phaseEnd.getDate() + 7);
    return {
      startDate: phaseStart.toISOString().slice(0, 10),
      endDate: phaseEnd.toISOString().slice(0, 10),
    };
  }
  
  // Fallback: use current date + one week
  const today = new Date();
  const weekLater = new Date(today);
  weekLater.setDate(weekLater.getDate() + 7);
  return {
    startDate: today.toISOString().slice(0, 10),
    endDate: weekLater.toISOString().slice(0, 10),
  };
}

export function useAddPhaseSubmit(
  tabValue: number,
  selectedBasePhaseIds: Set<string>,
  basePhases: BasePhase[],
  newPhaseName: string,
  newPhaseColor: string,
  validatePhaseName: (name: string) => boolean,
  planStartDate?: string
) {
  const handleSubmit = useCallback(
    (onSubmit: (phases: PlanPhase[]) => void, onClose: () => void) => {
      const phasesToAdd: PlanPhase[] = [];

      if (tabValue === 0) {
        // Add selected base phases with default one-week duration
        const selectedBasePhases = Array.from(selectedBasePhaseIds)
          .map((phaseId) => basePhases.find((bp) => bp.id === phaseId))
          .filter((bp): bp is BasePhase => bp !== undefined);

        for (const [index, basePhase] of selectedBasePhases.entries()) {
          const { startDate, endDate } = calculateDefaultDates(planStartDate);
          phasesToAdd.push({
            id: `phase-${Date.now()}-${index}-${basePhase.id}`,
            name: basePhase.name,
            color: basePhase.color,
            startDate,
            endDate,
          });
        }
      } else {
        // Add new custom phase with default one-week duration
        if (!validatePhaseName(newPhaseName)) return;

        const { startDate, endDate } = calculateDefaultDates(planStartDate);
        phasesToAdd.push({
          id: `phase-${Date.now()}-custom`,
          name: newPhaseName.trim(),
          color: newPhaseColor,
          startDate,
          endDate,
        });
      }

      if (phasesToAdd.length > 0) {
        onSubmit(phasesToAdd);
        onClose();
      }
    },
    [
      tabValue,
      selectedBasePhaseIds,
      basePhases,
      newPhaseName,
      newPhaseColor,
      validatePhaseName,
      planStartDate,
    ]
  );

  return { handleSubmit };
}

