import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store, setLeftSidebarOpen, setRightSidebarOpen } from '../store/store';
import { MainLayout } from './MainLayout';

it('toggles left and right sidebars', () => {
  store.dispatch(setLeftSidebarOpen(false));
  store.dispatch(setRightSidebarOpen(false));

  render(
    <Provider store={store}>
      <MemoryRouter>
        <MainLayout>
          <div>content</div>
        </MainLayout>
      </MemoryRouter>
    </Provider>
  );

  fireEvent.click(screen.getByLabelText(/open navigation/i));
  const hideLeftButtons = screen.getAllByLabelText(/hide left sidebar/i);
  expect(hideLeftButtons.length).toBeGreaterThan(0);
  fireEvent.click(hideLeftButtons[0]);

  fireEvent.click(screen.getByLabelText(/open right panel/i));
  const hideRightButtons = screen.getAllByLabelText(/hide right sidebar/i);
  expect(hideRightButtons.length).toBeGreaterThan(0);
  fireEvent.click(hideRightButtons[0]);
});
