import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { releasePlansReducer } from '../features/releasePlans/slice';
import type { ReleasePlansState } from '../features/releasePlans/types';
import ReleasePlanner from './ReleasePlanner';

function createStoreWithPlans(plansState: ReleasePlansState) {
  return configureStore({
    reducer: {
      releasePlans: releasePlansReducer,
      ui: (state = { leftSidebarOpen: false, rightSidebarOpen: false }) => state,
    },
    preloadedState: { releasePlans: plansState } as any,
  });
}

function createDefaultStore() {
  return configureStore({
    reducer: {
      releasePlans: releasePlansReducer,
      ui: (state = { leftSidebarOpen: false, rightSidebarOpen: false }) => state,
    },
  });
}

it('renders controls when plans exist and triggers expand/collapse actions', () => {
  const store = createDefaultStore();
  render(
    <Provider store={store}>
      <ReleasePlanner />
    </Provider>
  );
  const expandAll = screen.getByRole('button', { name: /expand all/i });
  const collapseAll = screen.getByRole('button', { name: /collapse all/i });

  fireEvent.click(expandAll);
  fireEvent.click(collapseAll);
});

it('renders null when no plans exist', () => {
  const store = createStoreWithPlans({ plans: [] });
  const { container } = render(
    <Provider store={store}>
      <ReleasePlanner />
    </Provider>
  );
  expect(container.firstChild).toBeNull();
});
