import { render, screen, waitFor } from '@testing-library/react';
import App from '../src/components/App';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

// mock API response
const mockApiResponse = {
  info: { count: 1, pages: 1, next: null, prev: null },
  results: [{ id: 1, name: 'Rick Sanchez', image: 'rick.png' }],
};

beforeEach(() => {
  vi.resetAllMocks();
  localStorage.clear();

  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    })
  ) as unknown as typeof fetch;
});

describe('App', () => {
  it('renders without crashing', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Поиск/i)).toBeInTheDocument();
    });
  });

  it('Retrieves saved search term on component mount', async () => {
    localStorage.setItem('lastQuery', 'Rick');

    render(<App />);

    // wait, fetch contain query=Rick
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('name=Rick')
      );
      expect(screen.getByRole('textbox')).toHaveValue('Rick');
    });
  });

  it('Overwrites existing localStorage value when new search is performed', async () => {
    render(<App />);

    const input = screen.getByRole('textbox');
    const user = userEvent.setup();

    await user.clear(input);
    await user.type(input, 'Morty');
    await user.keyboard('{Enter}');

    // дождись рендера новых данных
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('name=Morty')
      );
      expect(screen.getByRole('textbox')).toHaveValue('Morty');
    });
  });
});
