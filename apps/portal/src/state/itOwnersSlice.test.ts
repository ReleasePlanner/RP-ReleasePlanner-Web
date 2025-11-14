import { describe, it, expect } from 'vitest';
import {
  itOwnersReducer,
  addITOwner,
  updateITOwner,
  deleteITOwner,
  setITOwners,
} from './itOwnersSlice';
import type { ITOwner } from '@/features/releasePlans/constants/itOwners';

describe('itOwnersSlice', () => {
  const mockITOwner: ITOwner = {
    id: 'test-owner-1',
    name: 'Test Owner',
    email: 'test@example.com',
    department: 'Test Department',
  };

  it('should return initial state', () => {
    const state = itOwnersReducer(undefined, { type: 'unknown' });
    expect(state.itOwners).toBeDefined();
    expect(Array.isArray(state.itOwners)).toBe(true);
    expect(state.itOwners.length).toBeGreaterThan(0);
  });

  it('should handle addITOwner', () => {
    const initialState = itOwnersReducer(undefined, { type: 'unknown' });
    const state = itOwnersReducer(initialState, addITOwner(mockITOwner));
    
    expect(state.itOwners).toContainEqual(mockITOwner);
  });

  it('should handle updateITOwner', () => {
    const initialState = itOwnersReducer(undefined, addITOwner(mockITOwner));
    const updatedOwner = { ...mockITOwner, name: 'Updated Owner' };
    
    const state = itOwnersReducer(initialState, updateITOwner(updatedOwner));
    
    const owner = state.itOwners.find((o) => o.id === mockITOwner.id);
    expect(owner?.name).toBe('Updated Owner');
  });

  it('should handle deleteITOwner', () => {
    const initialState = itOwnersReducer(undefined, addITOwner(mockITOwner));
    const state = itOwnersReducer(initialState, deleteITOwner(mockITOwner.id));
    
    expect(state.itOwners.find((o) => o.id === mockITOwner.id)).toBeUndefined();
  });

  it('should handle setITOwners', () => {
    const owners: ITOwner[] = [
      { id: '1', name: 'Owner 1', email: 'owner1@example.com', department: 'Dept 1' },
      { id: '2', name: 'Owner 2', email: 'owner2@example.com', department: 'Dept 2' },
    ];
    
    const state = itOwnersReducer(undefined, setITOwners(owners));
    
    expect(state.itOwners).toEqual(owners);
    expect(state.itOwners.length).toBe(2);
  });

  it('should not update owner if id does not exist', () => {
    const initialState = itOwnersReducer(undefined, { type: 'unknown' });
    const nonExistentOwner = { ...mockITOwner, id: 'non-existent' };
    
    const state = itOwnersReducer(initialState, updateITOwner(nonExistentOwner));
    
    expect(state.itOwners.find((o) => o.id === 'non-existent')).toBeUndefined();
  });
});

