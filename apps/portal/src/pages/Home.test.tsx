import { render } from '@testing-library/react';
import Home from './Home';

it('renders null', () => {
  const { container } = render(<Home />);
  expect(container.firstChild).toBeNull();
});
