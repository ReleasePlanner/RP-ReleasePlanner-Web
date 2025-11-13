import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { store } from '../../../../store/store';
import PlanCard from './PlanCard';
import { theme } from '../../../../theme';

const plan = {
  id: 'p-expand',
  metadata: { id: 'p-expand', name: 'Plan Expand', owner: 'Owner', startDate: '2025-01-01', endDate: '2025-12-31', status: 'planned', phases: [] },
  tasks: [],
};

it('toggles expanded state and persists to store', () => {
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <PlanCard plan={plan as any} />
      </ThemeProvider>
    </Provider>
  );
  const btn = screen.getByRole('button', { name: /expand/i });
  fireEvent.click(btn);
  const state = store.getState();
  expect(state.ui.planExpandedByPlanId?.['p-expand']).toBe(false);
});


