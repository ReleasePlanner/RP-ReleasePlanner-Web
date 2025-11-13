import { render, screen, fireEvent } from '@testing-library/react';
import PlanLeftPane from './PlanLeftPane';

it('renders data and triggers add/edit callbacks', () => {
  const phases = [
    { id: 'ph1', name: 'Phase 1', startDate: '2025-01-01', endDate: '2025-01-31' } as any,
  ];
  const onAddPhase = vi.fn();
  const onEditPhase = vi.fn();

  render(
    <PlanLeftPane
      owner="Owner"
      startDate="2025-01-01"
      endDate="2025-12-31"
      id="plan-1"
      phases={phases as any}
      onAddPhase={onAddPhase}
      onEditPhase={onEditPhase}
    />
  );

  fireEvent.click(screen.getByRole('button', { name: /add/i }));
  expect(onAddPhase).toHaveBeenCalled();

  fireEvent.click(screen.getByLabelText(/edit phase/i));
  expect(onEditPhase).toHaveBeenCalledWith('ph1');
});
