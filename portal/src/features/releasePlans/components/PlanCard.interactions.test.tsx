import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../store/store';
import PlanCard from '../components/PlanCard';

const plan = {
  id: 'p-test',
  metadata: { id: 'p-test', name: 'Plan Test', owner: 'Owner', startDate: '2025-01-01', endDate: '2025-12-31', status: 'planned', phases: [] },
  tasks: [],
};

it('opens Add Phase dialog and closes on cancel', () => {
  render(
    <Provider store={store}>
      <PlanCard plan={plan as any} />
    </Provider>
  );
  fireEvent.click(screen.getByRole('button', { name: /add/i }));
  fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
});


