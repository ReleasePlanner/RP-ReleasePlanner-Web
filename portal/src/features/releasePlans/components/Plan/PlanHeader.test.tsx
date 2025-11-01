import { render, screen, fireEvent } from '@testing-library/react';
import PlanHeader from './PlanHeader';

describe('PlanHeader', () => {
  it('renders name and status chip', () => {
    render(<PlanHeader name="Q1 Release" status="planned" description="desc" expanded={true} onToggleExpanded={() => {}} />);
    expect(screen.getByText('Q1 Release')).toBeInTheDocument();
    expect(screen.getByText('planned')).toBeInTheDocument();
  });

  it('calls onToggleExpanded when clicking expand icon', () => {
    const onToggle = vi.fn();
    render(<PlanHeader name="Q1 Release" status="planned" description="desc" expanded={true} onToggleExpanded={onToggle} />);
    const btn = screen.getByRole('button', { name: /expand/i });
    fireEvent.click(btn);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});


