import { describe, it, expect } from 'vitest';
import {
  calendarsReducer,
  addCalendar,
  updateCalendar,
  deleteCalendar,
  setCalendars,
} from './calendarsSlice';
import type { Calendar } from '@/features/calendar/types';

describe('calendarsSlice', () => {
  const mockCalendar: Calendar = {
    id: '1',
    name: 'Test Calendar',
    year: 2024,
    days: [],
  };

  it('should return initial state', () => {
    const state = calendarsReducer(undefined, { type: 'unknown' });
    expect(state.calendars).toBeDefined();
    expect(Array.isArray(state.calendars)).toBe(true);
  });

  it('should handle addCalendar', () => {
    const initialState = calendarsReducer(undefined, { type: 'unknown' });
    const state = calendarsReducer(initialState, addCalendar(mockCalendar));
    
    expect(state.calendars).toContainEqual(mockCalendar);
  });

  it('should handle updateCalendar', () => {
    const initialState = calendarsReducer(undefined, addCalendar(mockCalendar));
    const updatedCalendar = { ...mockCalendar, name: 'Updated Calendar' };
    
    const state = calendarsReducer(initialState, updateCalendar(updatedCalendar));
    
    const calendar = state.calendars.find((c) => c.id === mockCalendar.id);
    expect(calendar?.name).toBe('Updated Calendar');
  });

  it('should handle deleteCalendar', () => {
    const initialState = calendarsReducer(undefined, addCalendar(mockCalendar));
    const state = calendarsReducer(initialState, deleteCalendar(mockCalendar.id));
    
    expect(state.calendars.find((c) => c.id === mockCalendar.id)).toBeUndefined();
  });

  it('should handle setCalendars', () => {
    const calendars: Calendar[] = [
      { id: '1', name: 'Calendar 1', year: 2024, days: [] },
      { id: '2', name: 'Calendar 2', year: 2024, days: [] },
    ];
    
    const state = calendarsReducer(undefined, setCalendars(calendars));
    
    expect(state.calendars).toEqual(calendars);
    expect(state.calendars.length).toBe(2);
  });

  it('should not update calendar if id does not exist', () => {
    const initialState = calendarsReducer(undefined, { type: 'unknown' });
    const nonExistentCalendar = { ...mockCalendar, id: 'non-existent' };
    
    const state = calendarsReducer(initialState, updateCalendar(nonExistentCalendar));
    
    expect(state.calendars.find((c) => c.id === 'non-existent')).toBeUndefined();
  });
});

