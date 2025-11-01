import { describe, it, expect } from 'vitest';
import { releasePlansReducer, addPlan, updatePlan, removePlan, addPhase, removePhase, updatePhase } from '../slice';
import type { ReleasePlansState, Plan } from '../types';

function baseState(): ReleasePlansState {
  return {
    plans: [
      {
        id: 'p1',
        metadata: { id: 'p1', name: 'Plan 1', owner: 'Owner', startDate: '2025-01-01', endDate: '2025-12-31', status: 'planned', phases: [] },
        tasks: [],
      },
    ],
  };
}

describe('releasePlans slice', () => {
  it('addPlan appends a plan', () => {
    const plan: Plan = { id: 'p2', metadata: { id: 'p2', name: 'P2', owner: 'O', startDate: '2025-01-01', endDate: '2025-12-31', status: 'planned' }, tasks: [] };
    const s = releasePlansReducer(baseState(), addPlan(plan));
    expect(s.plans.find((p) => p.id === 'p2')).toBeTruthy();
  });

  it('updatePlan replaces a plan by id', () => {
    const updated: Plan = { id: 'p1', metadata: { id: 'p1', name: 'Renamed', owner: 'Owner', startDate: '2025-01-01', endDate: '2025-12-31', status: 'planned' }, tasks: [] };
    const s = releasePlansReducer(baseState(), updatePlan(updated));
    expect(s.plans[0].metadata.name).toBe('Renamed');
  });

  it('removePlan deletes by id', () => {
    const s = releasePlansReducer(baseState(), removePlan({ id: 'p1' }));
    expect(s.plans.length).toBe(0);
  });

  it('addPhase adds a phase', () => {
    let s = baseState();
    s = releasePlansReducer(s, addPhase({ planId: 'p1', name: 'Phase A' }));
    expect(s.plans[0].metadata.phases?.some((ph) => ph.name === 'Phase A')).toBe(true);
  });

  it('updatePhase updates phase fields', () => {
    let s = baseState();
    s = releasePlansReducer(s, addPhase({ planId: 'p1', name: 'Phase A' }));
    const phId = s.plans[0].metadata.phases![0].id;
    s = releasePlansReducer(s, updatePhase({ planId: 'p1', phaseId: phId, changes: { startDate: '2025-02-01', endDate: '2025-02-10', color: '#000' } }));
    const ph = s.plans[0].metadata.phases![0];
    expect(ph.startDate).toBe('2025-02-01');
    expect(ph.color).toBe('#000');
  });

  it('removePhase deletes a phase', () => {
    let s = baseState();
    s = releasePlansReducer(s, addPhase({ planId: 'p1', name: 'Phase A' }));
    const phId = s.plans[0].metadata.phases![0].id;
    s = releasePlansReducer(s, removePhase({ planId: 'p1', phaseId: phId }));
    expect(s.plans[0].metadata.phases?.length).toBe(0);
  });
});


