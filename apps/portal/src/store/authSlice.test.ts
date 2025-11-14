import { describe, it, expect } from 'vitest';
import { authReducer, setUser, setLoading, logout } from './authSlice';
import type { User } from '../api/services/auth.service';

describe('authSlice', () => {
  const mockUser: User = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    role: 'user',
    firstName: 'Test',
    lastName: 'User',
  };

  it('should return initial state', () => {
    const state = authReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it('should handle setUser with user', () => {
    const state = authReducer(undefined, setUser(mockUser));
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it('should handle setUser with null', () => {
    const initialState = authReducer(undefined, setUser(mockUser));
    const state = authReducer(initialState, setUser(null));
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should handle setLoading true', () => {
    const state = authReducer(undefined, setLoading(true));
    expect(state.isLoading).toBe(true);
  });

  it('should handle setLoading false', () => {
    const initialState = authReducer(undefined, setLoading(true));
    const state = authReducer(initialState, setLoading(false));
    expect(state.isLoading).toBe(false);
  });

  it('should handle logout', () => {
    const initialState = authReducer(undefined, setUser(mockUser));
    const state = authReducer(initialState, logout());
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});

