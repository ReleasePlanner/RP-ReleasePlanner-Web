import { useMemo } from "react";
import type { BasePhase } from "../../../../../../api/services/basePhases.service";
import type { PlanPhase } from "../../../../types";

export function useAvailableBasePhases(
  basePhases: BasePhase[],
  existingPhases: PlanPhase[]
) {
  const existingPhaseNames = useMemo(
    () => existingPhases.map((p) => p.name.toLowerCase().trim()),
    [existingPhases]
  );

  const availableBasePhases = useMemo(() => {
    const existingNames = new Set(
      existingPhases.map((p) => p.name.toLowerCase().trim())
    );
    return basePhases.filter(
      (bp) => !existingNames.has(bp.name.toLowerCase().trim())
    );
  }, [basePhases, existingPhases]);

  return { existingPhaseNames, availableBasePhases };
}

