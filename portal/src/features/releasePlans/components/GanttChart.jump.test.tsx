import { render, screen, fireEvent } from '@testing-library/react';
import GanttChart from './GanttChart';

it('scrolls to today when clicking Today button', () => {
  const { container } = render(
    <GanttChart startDate="2025-01-01" endDate="2025-12-31" tasks={[]} phases={[]} />
  );
  const scroller = container.querySelector('.overflow-auto') as HTMLElement;
  const scrollSpy = vi.spyOn(scroller as any, 'scrollTo');
  const btn = screen.getByRole('button', { name: /today/i });
  fireEvent.click(btn);
  expect(scrollSpy).toHaveBeenCalled();
});


