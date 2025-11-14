import { describe, it, expect } from 'vitest';
import { useAppDispatch, useAppSelector } from './hooks';
import { configureStore } from '@reduxjs/toolkit';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { authReducer } from './authSlice';

describe('hooks', () => {
  const createWrapper = (store: ReturnType<typeof configureStore>) => {
    return ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );
  };

  it('useAppDispatch returns typed dispatch', () => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });

    const { result } = renderHook(() => useAppDispatch(), {
      wrapper: createWrapper(store),
    });

    expect(typeof result.current).toBe('function');
  });

  it('useAppSelector returns typed selector', () => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });

    const { result } = renderHook(() => useAppSelector((state) => state.auth), {
      wrapper: createWrapper(store),
    });

    expect(result.current).toBeDefined();
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});

