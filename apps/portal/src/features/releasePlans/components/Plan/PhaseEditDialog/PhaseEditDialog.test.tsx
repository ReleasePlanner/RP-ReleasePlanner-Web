import { render, screen, fireEvent } from '@testing-library/react';
import PhaseEditDialog from './PhaseEditDialog';

it('edits fields and triggers callbacks', () => {
  const onSave = vi.fn();
  const onCancel = vi.fn();
  const onStartChange = vi.fn();
  const onEndChange = vi.fn();
  const onColorChange = vi.fn();

  render(
    <PhaseEditDialog
      open
      start="2025-01-01"
      end="2025-01-10"
      color="#217346"
      onStartChange={onStartChange}
      onEndChange={onEndChange}
      onColorChange={onColorChange}
      onCancel={onCancel}
      onSave={onSave}
    />
  );

  fireEvent.change(screen.getByLabelText(/start/i), { target: { value: '2025-02-01' } });
  fireEvent.change(screen.getByLabelText(/end/i), { target: { value: '2025-02-10' } });
  fireEvent.change(screen.getByLabelText('Color', { selector: 'input' }), { target: { value: '#000000' } });

  expect(onStartChange).toHaveBeenCalled();
  expect(onEndChange).toHaveBeenCalled();
  expect(onColorChange).toHaveBeenCalled();

  fireEvent.click(screen.getByRole('button', { name: /save/i }));
  expect(onSave).toHaveBeenCalled();

  fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
  expect(onCancel).toHaveBeenCalled();
});


