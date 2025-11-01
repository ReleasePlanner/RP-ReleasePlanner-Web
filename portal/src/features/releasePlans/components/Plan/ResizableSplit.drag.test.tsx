import { render, screen, fireEvent } from '@testing-library/react';
import ResizableSplit from './ResizableSplit';

it('mouse drag calls onLeftPercentChange', () => {
  const onChange = vi.fn();
  const { container } = render(<ResizableSplit leftPercent={35} onLeftPercentChange={onChange} left={<div>left</div>} right={<div>right</div>} />);
  const sep = screen.getByRole('separator');
  const grid = container.firstElementChild as HTMLElement;
  const rectSpy = vi.spyOn(grid, 'getBoundingClientRect').mockReturnValue({
    x: 0, y: 0, left: 0, top: 0, right: 300, bottom: 100, width: 300, height: 100, toJSON: () => ({})
  } as any);
  fireEvent.mouseDown(sep, { clientX: 100 });
  fireEvent.mouseMove(window, { clientX: 200 });
  fireEvent.mouseUp(window);
  expect(onChange).toHaveBeenCalled();
  rectSpy.mockRestore();
});


