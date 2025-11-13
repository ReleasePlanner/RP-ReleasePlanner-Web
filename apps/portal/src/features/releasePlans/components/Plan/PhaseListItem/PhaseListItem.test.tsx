import { render, screen, fireEvent } from '@testing-library/react';
import PhaseListItem from './PhaseListItem';

it('renders toolset and triggers view/edit/delete callbacks', () => {
  const onView = vi.fn();
  const onEdit = vi.fn();
  const onDelete = vi.fn();
  render(
    <PhaseListItem
      id="p1"
      name="Discovery"
      startDate="2025-11-03"
      endDate="2025-11-07"
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );

  fireEvent.click(screen.getByLabelText(/view phase/i));
  fireEvent.click(screen.getByLabelText(/edit phase/i));
  fireEvent.click(screen.getByLabelText(/delete phase/i));

  expect(onView).toHaveBeenCalledWith('p1');
  expect(onEdit).toHaveBeenCalledWith('p1');
  expect(onDelete).toHaveBeenCalledWith('p1');
});


