import { theme } from './theme';

it('exposes expected palette and shape', () => {
  expect(theme.palette.primary.main).toBe('#217346');
  expect(theme.shape?.borderRadius).toBe(8);
});
