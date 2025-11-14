import { useCallback, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { setPlanLeftPercent, setPlanExpanded } from "../../../store/store";
import type { Plan, PlanPhase } from "../types";
import type { UseMutationResult } from "@tanstack/react-query";
import type { UpdatePlanDto } from "../../../api/services/plans.service";
import { createPartialUpdateDto } from "../lib/planConverters";

/**
 * Custom hook for PlanCard business logic
 * Follows DRY principle - centralizes all plan card state management
 */
export function usePlanCard(
  plan: Plan,
  updatePlanMutation: UseMutationResult<any, Error, { id: string; data: UpdatePlanDto }, unknown>
) {
  const dispatch = useAppDispatch();

  // Layout state
  const savedPercent = useAppSelector(
    (s) => s.ui.planLeftPercentByPlanId?.[plan.id]
  );
  const [leftPercent, setLeftPercent] = useState<number>(savedPercent ?? 35);

  const savedExpanded = useAppSelector(
    (s) => s.ui.planExpandedByPlanId?.[plan.id]
  );
  const expanded = savedExpanded ?? true;

  // Dialog state
  const [phaseOpen, setPhaseOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingPhase, setEditingPhase] = useState<PlanPhase | null>(null);

  // Actions
  const handleToggleExpanded = useCallback(() => {
    dispatch(setPlanExpanded({ planId: plan.id, expanded: !expanded }));
  }, [dispatch, plan.id, expanded]);

  const handleLeftPercentChange = useCallback(
    (v: number) => {
      setLeftPercent(v);
      dispatch(setPlanLeftPercent({ planId: plan.id, percent: v }));
    },
    [dispatch, plan.id]
  );

  const openEdit = useCallback(
    (phaseId: string) => {
      const ph = (plan.metadata.phases ?? []).find(
        (phase) => phase.id === phaseId
      );
      if (!ph) return;
      setEditingPhase(ph);
      setEditOpen(true);
    },
    [plan.metadata.phases]
  );

  const handleAddPhase = useCallback(
    async (name: string) => {
      const newPhase: PlanPhase = {
        id: `phase-${Date.now()}`,
        name,
      };
      const updatedPhases = [...(plan.metadata.phases || []), newPhase];
      try {
        await updatePlanMutation.mutateAsync({
          id: plan.id,
          data: createPartialUpdateDto(plan, {
            phases: updatedPhases,
          }),
        });
        setPhaseOpen(false);
      } catch (error) {
        console.error('Error adding phase:', error);
      }
    },
    [plan, updatePlanMutation]
  );

  const handlePhaseRangeChange = useCallback(
    async (phaseId: string, startDate: string, endDate: string) => {
      const updatedPhases = (plan.metadata.phases || []).map((p) =>
        p.id === phaseId ? { ...p, startDate, endDate } : p
      );
      try {
        await updatePlanMutation.mutateAsync({
          id: plan.id,
          data: createPartialUpdateDto(plan, {
            phases: updatedPhases,
          }),
        });
      } catch (error) {
        console.error('Error updating phase range:', error);
      }
    },
    [plan, updatePlanMutation]
  );

  return {
    // State
    leftPercent,
    expanded,
    phaseOpen,
    editOpen,
    editingPhase,

    // Actions
    handleToggleExpanded,
    handleLeftPercentChange,
    openEdit,
    handleAddPhase,
    handlePhaseRangeChange,

    // Dialog controls
    setPhaseOpen,
    setEditOpen,
  };
}
