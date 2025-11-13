import { describe, it, expect } from 'vitest';
import { selectPlanById, selectPhasesByPlanId } from './selectors';

const state: any = {
  releasePlans: {
    plans: [
      { id: 'a', metadata: { id: 'a', name: 'A', owner: '', startDate: '2025-01-01', endDate: '2025-12-31', status: 'planned', phases: [{ id: 'ph', name: 'PH' }] }, tasks: [] },
    ],
  },
};

describe('selectors', () => {
  it('selectPlanById returns plan', () => {
    expect(selectPlanById('a')(state)?.metadata.name).toBe('A');
  });
  it('selectPhasesByPlanId returns phases array', () => {
    expect(selectPhasesByPlanId('a')(state).length).toBe(1);
  });
});


