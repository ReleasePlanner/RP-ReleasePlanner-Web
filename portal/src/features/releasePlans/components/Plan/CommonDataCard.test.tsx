import { render, screen } from '@testing-library/react';
import CommonDataCard from './CommonDataCard';

it('renders owner, schedule, and id', () => {
  render(<CommonDataCard owner="Alice" startDate="2025-01-01" endDate="2025-01-31" id="p1" />);
  expect(screen.getByText('Alice')).toBeInTheDocument();
  expect(screen.getByText(/2025-01-01/)).toBeInTheDocument();
  expect(screen.getByText('p1')).toBeInTheDocument();
});


