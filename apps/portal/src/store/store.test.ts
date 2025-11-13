import { describe, it, expect } from 'vitest';
import { store, setPlanExpanded, setPlanLeftPercent } from './store';

describe('ui store', () => {
  it('sets plan expanded state', () => {
    store.dispatch(setPlanExpanded({ planId: 'plan-x', expanded: false }));
    const state = store.getState();
    expect(state.ui.planExpandedByPlanId?.['plan-x']).toBe(false);
  });

  it('sets plan left percent', () => {
    store.dispatch(setPlanLeftPercent({ planId: 'plan-x', percent: 42 }));
    const state = store.getState();
    expect(state.ui.planLeftPercentByPlanId?.['plan-x']).toBe(42);
  });
});


