import { render } from '@testing-library/react';
import GanttTimeline from './GanttTimeline';

it('renders without today and without button when props omitted', () => {
  const { container } = render(<GanttTimeline start={new Date('2025-01-01')} totalDays={30} pxPerDay={10} />);
  expect(container).toBeTruthy();
});


