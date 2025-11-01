import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../store/store';
import PlanCard from '../components/PlanCard';

const plan = {
  id: 'p-expand',
  metadata: { id: 'p-expand', name: 'Plan Expand', owner: 'Owner', startDate: '2025-01-01', endDate: '2025-12-31', status: 'planned', phases: [] },
  tasks: [],
};

it('toggles expanded state and persists to store', () => {
  render(
    <Provider store={store}>
      <PlanCard plan={plan as any} />
    </Provider>
  );
  const btn = screen.getByRole('button', { name: /expand/i });
  fireEvent.click(btn);
  const state = store.getState();
  expect(state.ui.planExpandedByPlanId?.['p-expand']).toBe(false);
});


