import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import App from '../src/components/App';
import { vi } from 'vitest';

// импортируем модуль, а не функцию
import * as useCharactersModule from '../src/hooks/useCharacters';

vi.mock('../src/hooks/useCharacters');

const mockedUseCharacters = useCharactersModule.default as jest.Mock;

mockedUseCharacters.mockReturnValueOnce({
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
});

vi.mock('../../components/Item/ItemDetails', () => ({
  __esModule: true,
  default: () => <div data-testid="item-details">Details shown</div>,
}));

vi.mock('../../components/ItemList/ItemList', () => ({
  __esModule: true,
  default: ({ onItemClick }: { onItemClick: (id: number) => void }) => (
    <div data-testid="item-list">
      <button onClick={() => onItemClick(1)}>Rick Sanchez</button>
    </div>
  ),
}));

vi.mock('../../components/Loader/Loader', () => ({
  __esModule: true,
  default: ({ loading }: { loading: boolean }) =>
    loading ? <div>Loading...</div> : null,
}));

vi.mock('../../components/ErrorDescription/ErrorDescription', () => ({
  __esModule: true,
  default: ({ message }: { message: string }) => <div>{message}</div>,
}));

vi.mock('../../components/SearchInput/SearchInput', () => ({
  __esModule: true,
  default: ({ onSearch }: { onSearch: (query: string) => void }) => (
    <input
      data-testid="search-input"
      onChange={(e) => onSearch(e.target.value)}
    />
  ),
}));

describe('App component', () => {
  beforeEach(() => {
    // Сбрасываем мок перед каждым тестом
    mockedUseCharacters.mockReset();
  });

  it('renders item list and pagination', async () => {
    mockedUseCharacters.mockReturnValue({
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
    });

    render(
      <MemoryRouter initialEntries={['/?page=1']}>
        <Routes>
          <Route path="*" element={<App />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByTestId('item-list')).toBeInTheDocument();
    expect(screen.getByText('Страница 1 из 2')).toBeInTheDocument();
    expect(screen.getByText('Следующая ▶')).toBeEnabled();
    expect(screen.getByText('◀ Предыдущая')).toBeDisabled();
  });

  it('calls search("") if no last query is saved', () => {
    const searchMock = vi.fn();

    mockedUseCharacters.mockReturnValue({
      results: [],
      currentQuery: '',
      setCurrentQuery: vi.fn(),
      nextPageUrl: null,
      prevPageUrl: null,
      page: 1,
      totalPages: 1,
      loading: false,
      error: '',
      search: searchMock,
      loadPage: vi.fn(),
      loadLastQuery: () => '',
      hasLastQuery: () => false,
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="*" element={<App />} />
        </Routes>
      </MemoryRouter>
    );

    expect(searchMock).toHaveBeenCalledWith('');
  });

  it('shows loader when loading is true', () => {
    mockedUseCharacters.mockReturnValue({
      results: [],
      currentQuery: '',
      setCurrentQuery: vi.fn(),
      nextPageUrl: null,
      prevPageUrl: null,
      page: 1,
      totalPages: 1,
      loading: true,
      error: '',
      search: vi.fn(),
      loadPage: vi.fn(),
      loadLastQuery: () => '',
      hasLastQuery: () => false,
    });

    render(
      <MemoryRouter>
        <Routes>
          <Route path="*" element={<App />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('⏳ Загрузка...')).toBeInTheDocument();
  });

  it('handles next page click', () => {
    const loadPageMock = vi.fn();

    mockedUseCharacters.mockReturnValue({
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
      prevPageUrl: 'prev-url',
      page: 1,
      totalPages: 3,
      loading: false,
      error: '',
      search: vi.fn(),
      loadPage: loadPageMock,
      loadLastQuery: () => 'Rick',
      hasLastQuery: () => true,
    });

    render(
      <MemoryRouter initialEntries={['/?page=1']}>
        <Routes>
          <Route path="*" element={<App />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Следующая ▶'));
    expect(loadPageMock).toHaveBeenCalledWith('next-url', 2);
  });

  it('handles previous page click', () => {
    const loadPageMock = vi.fn();

    mockedUseCharacters.mockReturnValue({
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
      prevPageUrl: 'prev-url',
      page: 2,
      totalPages: 3,
      loading: false,
      error: '',
      search: vi.fn(),
      loadPage: loadPageMock,
      loadLastQuery: () => 'Rick',
      hasLastQuery: () => true,
    });

    render(
      <MemoryRouter initialEntries={['/?page=2']}>
        <Routes>
          <Route path="*" element={<App />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('◀ Предыдущая'));
    expect(loadPageMock).toHaveBeenCalledWith('prev-url', 1);
  });

  it('displays details panel when "details" param exists', async () => {
    mockedUseCharacters.mockReturnValue({
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
    });

    render(
      <MemoryRouter initialEntries={['/?page=1&details=1']}>
        <Routes>
          <Route path="*" element={<App />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByTestId('item-details')).toBeInTheDocument();
  });

  it('handles item click and sets details param', async () => {
    mockedUseCharacters.mockReturnValue({
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
    });

    render(
      <MemoryRouter initialEntries={['/?page=1']}>
        <Routes>
          <Route path="*" element={<App />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(await screen.findByText('Rick Sanchez'));
    await waitFor(() => {
      expect(screen.getByTestId('item-details')).toBeInTheDocument();
    });
  });

  it('shows error message when error occurs', () => {
    mockedUseCharacters.mockReturnValue({
      results: [],
      currentQuery: '',
      setCurrentQuery: vi.fn(),
      nextPageUrl: null,
      prevPageUrl: null,
      page: 1,
      totalPages: 1,
      loading: false,
      error: 'Something went wrong',
      search: vi.fn(),
      loadPage: vi.fn(),
      loadLastQuery: () => '',
      hasLastQuery: () => false,
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="*" element={<App />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
  });
});
