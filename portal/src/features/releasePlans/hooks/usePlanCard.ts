import { useCallback, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { addPhase, updatePhase } from "../slice";
import { setPlanLeftPercent, setPlanExpanded } from "../../../store/store";
import { logger, monitoring } from "../../../utils/logging";
import type { Plan } from "../types";

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
  const [editPhaseId, setEditPhaseId] = useState<string | null>(null);
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");
  const [editColor, setEditColor] = useState("#217346");

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

      setEditPhaseId(phaseId);
      const today = new Date();
      const weekLater = new Date(today);
      weekLater.setDate(weekLater.getDate() + 7);
      const startIso = today.toISOString().slice(0, 10);
      const endIso = weekLater.toISOString().slice(0, 10);
      setEditStart(ph.startDate ?? startIso);
      setEditEnd(ph.endDate ?? endIso);
      setEditColor(ph.color ?? "#217346");
      setEditOpen(true);
    },
    [plan.metadata.phases]
  );

  const saveEdit = useCallback(() => {
    if (!editPhaseId) return;
    dispatch(
      updatePhase({
        planId: plan.id,
        phaseId: editPhaseId,
        changes: { startDate: editStart, endDate: editEnd, color: editColor },
      })
    );
    setEditOpen(false);
  }, [dispatch, plan.id, editPhaseId, editStart, editEnd, editColor]);

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
    editStart,
    editEnd,
    editColor,

    // Actions
    handleToggleExpanded,
    handleLeftPercentChange,
    openEdit,
    saveEdit,
    handleAddPhase,
    handlePhaseRangeChange,

    // Dialog controls
    setPhaseOpen,
    setEditOpen,
    setEditStart,
    setEditEnd,
    setEditColor,
  };
}
