import { render, screen, fireEvent } from '@testing-library/react';
import GanttTimeline from './GanttTimeline';

describe('GanttTimeline', () => {
  it('shows Today button when onJumpToToday provided', () => {
    const onJump = vi.fn();
    render(<GanttTimeline start={new Date('2025-01-01')} totalDays={10} pxPerDay={10} todayIndex={0} onJumpToToday={onJump} />);
    const btn = screen.getByRole('button', { name: /today/i });
    fireEvent.click(btn);
    expect(onJump).toHaveBeenCalled();
  });
});


