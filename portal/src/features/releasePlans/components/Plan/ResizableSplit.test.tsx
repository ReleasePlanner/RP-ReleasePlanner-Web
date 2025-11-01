import { render, screen, fireEvent } from '@testing-library/react';
import ResizableSplit from './ResizableSplit';

describe('ResizableSplit', () => {
  it('renders separator and responds to keyboard', () => {
    const onChange = vi.fn();
    render(<ResizableSplit leftPercent={35} onLeftPercentChange={onChange} left={<div>left</div>} right={<div>right</div>} />);
    const sep = screen.getByRole('separator');
    fireEvent.keyDown(sep, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalled();
  });
});


