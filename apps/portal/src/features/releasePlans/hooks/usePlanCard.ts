import { useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { addPhase, updatePhase } from "../slice";
import { setPlanLeftPercent, setPlanExpanded } from "../../../store/store";
import type { Plan, PlanPhase } from "../types";

/**
 * Custom hook for PlanCard business logic
 * Follows DRY principle - centralizes all plan card state management
 */
export function usePlanCard(plan: Plan) {
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
    (name: string) => {
      dispatch(addPhase({ planId: plan.id, name }));
      setPhaseOpen(false);
    },
    [dispatch, plan.id]
  );

  const handlePhaseRangeChange = useCallback(
    (phaseId: string, startDate: string, endDate: string) => {
      dispatch(
        updatePhase({
          planId: plan.id,
          phaseId,
          changes: { startDate, endDate },
        })
      );
    },
    [dispatch, plan.id]
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
