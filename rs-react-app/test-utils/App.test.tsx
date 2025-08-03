import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { itemsReducer } from '../src/state/itemsSlice';
import App from '../src/components/App';
import { vi, describe, it, beforeEach } from 'vitest';
import { act } from 'react-dom/test-utils';

// 🧪 Мокаем useCharacters
import * as useCharactersModule from '../src/hooks/useCharacters';
vi.mock('../src/hooks/useCharacters');
const mockedUseCharacters = useCharactersModule.default as ReturnType<
  typeof vi.fn
>;

// 🧪 Мокаем дочерние компоненты
vi.mock('../src/components/Item/ItemDetails', () => ({
  __esModule: true,
  default: () => <div data-testid="item-details">Details shown</div>,
}));

it('handles item click and sets details param', async () => {
  mockedUseCharacters.mockReturnValue(baseHookResult);

  renderAppWithProviders('/?page=1');

  // клик по кнопке
  await act(async () => {
    fireEvent.click(await screen.findByText('Rick Sanchez'));
  });

  // Ожидаем появления панели деталей
  await waitFor(() => {
    expect(screen.getByTestId('item-details')).toBeInTheDocument();
  });
});

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
  default: ({ onSearch }: { onSearch: (query: string) => void }) => (
    <input
      data-testid="search-input"
      onChange={(e) => onSearch(e.target.value)}
    />
  ),
}));

// 🧪 Вспомогательная функция для рендера с Redux и Router
const renderAppWithProviders = (initialRoute = '/?page=1') => {
  const store = configureStore({
    reducer: {
      checkedItems: itemsReducer,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="*" element={<App />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

// 🧪 Общие данные useCharacters
const baseHookResult = {
  results: [
    {
      id: 1,
      name: 'Rick Sanchez',
      image: 'some.png',
      species: 'rick',
      type: 'rick',
    },
  ],
  currentQuery: '',
  setCurrentQuery: vi.fn(),
  nextPageUrl: 'next-url',
  prevPageUrl: null,
  page: 1,
  totalPages: 2,
  loading: false,
  error: '',
  search: vi.fn(),
  loadPage: vi.fn(),
  loadLastQuery: () => 'Rick',
  hasLastQuery: () => true,
};

describe('App component', () => {
  beforeEach(() => {
    mockedUseCharacters.mockReset();
  });

  it('renders item list and pagination', async () => {
    mockedUseCharacters.mockReturnValue(baseHookResult);

    renderAppWithProviders('/?page=1');

    expect(await screen.findByTestId('item-list')).toBeInTheDocument();
    expect(screen.getByText('Страница 1 из 2')).toBeInTheDocument();
    expect(screen.getByText('Следующая ▶')).toBeEnabled();
    expect(screen.getByText('◀ Предыдущая')).toBeDisabled();
  });

  it('displays details panel when "details" param exists', async () => {
    mockedUseCharacters.mockReturnValue(baseHookResult);

    renderAppWithProviders('/?page=1&details=1');

    expect(await screen.findByTestId('item-details')).toBeInTheDocument();
  });

  it('handles item click and sets details param', async () => {
    mockedUseCharacters.mockReturnValue(baseHookResult);

    renderAppWithProviders('/?page=1');

    fireEvent.click(await screen.findByText('Rick Sanchez'));

    await waitFor(() => {
      expect(screen.getByTestId('item-details')).toBeInTheDocument();
    });
  });

  it('shows error message when error occurs', () => {
    mockedUseCharacters.mockReturnValue({
      ...baseHookResult,
      results: [],
      error: 'Something went wrong',
    });

    renderAppWithProviders('/');

    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
  });
});
