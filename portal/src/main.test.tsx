import { it, expect } from 'vitest';
import { waitFor } from '@testing-library/react';

it('mounts app to #root without crashing', async () => {
  const root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);

  await import('./main');

  await waitFor(() => {
    expect(document.body.textContent).toMatch(/Release Planner/i);
  });
});
