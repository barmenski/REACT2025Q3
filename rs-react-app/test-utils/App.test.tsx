import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { itemsReducer } from '../src/state/itemsSlice';
import App from '../src/components/App';
import { vi, describe, it, beforeEach } from 'vitest';
import { ThemeProvider } from '../src/context/ThemeContext';

// Мокаем RTK Query хуки
vi.mock('../src/state/charactersApi', () => ({
  useGetCharactersQuery: vi.fn(),
  useInvalidateCharactersMutation: vi.fn(),
}));

import {
  useGetCharactersQuery,
  useInvalidateCharactersMutation,
} from '../src/state/charactersApi';

// Мокаем дочерние компоненты (по желанию)
vi.mock('../src/components/Item/ItemDetails', () => ({
  __esModule: true,
  default: () => <div data-testid="item-details">Details shown</div>,
}));

vi.mock('../src/components/Loader/Loader', () => ({
  __esModule: true,
  default: ({ loading }: { loading: boolean }) =>
    loading ? <div>Loading...</div> : null,
}));

vi.mock('../src/components/ErrorDescription/ErrorDescription', () => ({
  __esModule: true,
  default: ({ message }: { message: string }) => <div>{message}</div>,
}));

vi.mock('../src/components/SearchInput/SearchInput', () => ({
  __esModule: true,
  default: ({
    onSearch,
    value,
    onChange,
  }: {
    onSearch: () => void;
    value: string;
    onChange: (v: string) => void;
  }) => (
    <input
      data-testid="search-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSearch();
      }}
    />
  ),
}));

// Хелпер для рендера
const renderAppWithProviders = (initialRoute = '/?page=1') => {
  const store = configureStore({
    reducer: {
      checkedItems: itemsReducer,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <ThemeProvider>
          <Routes>
            <Route path="*" element={<App />} />
          </Routes>
        </ThemeProvider>
      </MemoryRouter>
    </Provider>
  );
};

describe('App component', () => {
  const mockInvalidate = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    (useInvalidateCharactersMutation as unknown as jest.Mock).mockReturnValue([
      mockInvalidate,
    ]);
  });

  it('renders item list and pagination', async () => {
    (useGetCharactersQuery as unknown as jest.Mock).mockReturnValue({
      data: {
        results: [
          {
            id: 1,
            name: 'Rick Sanchez',
            image: 'some.png',
            species: 'Human',
            type: 'Scientist',
          },
        ],
        info: {
          pages: 2,
          next: 'next-url',
          prev: null,
        },
      },
      error: null,
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    });

    renderAppWithProviders('/?page=1');

    expect(await screen.findByTestId('item-list')).toBeInTheDocument();
    expect(screen.getByText('Страница 1 из 2')).toBeInTheDocument();
    expect(screen.getByText('Следующая ▶')).toBeEnabled();
    expect(screen.getByText('◀ Предыдущая')).toBeDisabled();
  });

  it('displays details panel when "details" param exists', async () => {
    (useGetCharactersQuery as unknown as jest.Mock).mockReturnValue({
      data: {
        results: [
          {
            id: 1,
            name: 'Rick Sanchez',
            image: 'some.png',
            species: 'Human',
            type: 'Scientist',
          },
        ],
        info: {
          pages: 1,
          next: null,
          prev: null,
        },
      },
      error: null,
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    });

    renderAppWithProviders('/?page=1&details=1');

    expect(await screen.findByTestId('item-details')).toBeInTheDocument();
  });

  it('handles item click and sets details param', async () => {
    (useGetCharactersQuery as unknown as jest.Mock).mockReturnValue({
      data: {
        results: [
          {
            id: 1,
            name: 'Rick Sanchez',
            image: 'some.png',
            species: 'Human',
            type: 'Scientist',
          },
        ],
        info: {
          pages: 1,
          next: null,
          prev: null,
        },
      },
      error: null,
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    });

    renderAppWithProviders('/?page=1');

    fireEvent.click(await screen.findByText('Rick Sanchez'));

    await waitFor(() => {
      expect(screen.getByTestId('item-details')).toBeInTheDocument();
    });
  });

  it('shows error message when error occurs', async () => {
    (useGetCharactersQuery as unknown as jest.Mock).mockReturnValue({
      data: undefined,
      error: { message: 'Something went wrong' },
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    });

    renderAppWithProviders('/');

    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
  });
});
