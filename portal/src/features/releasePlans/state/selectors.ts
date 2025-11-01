import type { RootState } from '../../../store/store';

export const selectReleasePlans = (state: RootState) => state.releasePlans.plans;
export const selectPlanById = (planId: string) => (state: RootState) => state.releasePlans.plans.find((p) => p.id === planId);
export const selectPhasesByPlanId = (planId: string) => (state: RootState) => selectPlanById(planId)(state)?.metadata.phases ?? [];


