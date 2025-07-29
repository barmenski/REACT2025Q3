import { renderHook, act } from '@testing-library/react';
import useCharacters from '../src/hooks/useCharacters';
import { vi } from 'vitest';

// Мокаем useLastQuery
vi.mock('../src/hooks/useLastQuery', () => ({
  default: () => ({
    saveQuery: vi.fn(),
    loadQuery: vi.fn(() => 'Rick'),
    hasQuery: vi.fn(() => true),
  }),
}));

const mockData = {
  info: {
    pages: 1,
    next: null,
    prev: null,
  },
  results: [
    {
      id: 1,
      name: 'Rick Sanchez',
      species: 'Human',
      image: 'some.png',
      type: '',
    },
  ],
};

describe('useCharacters hook', () => {
  beforeEach(() => {
    // Типизируем fetch корректно
    global.fetch = vi.fn() as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and set character data on search success', async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      new Response(JSON.stringify(mockData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }) as unknown as Response
    );

    const { result } = renderHook(() => useCharacters());

    await act(async () => {
      result.current.search('Rick');
      // Ждем, чтобы состояние обновилось
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://rickandmortyapi.com/api/character/?name=Rick&page=1'
    );
    expect(result.current.results).toEqual(mockData.results);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should handle 404 error', async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      new Response(null, {
        status: 404,
        statusText: 'Not Found',
      }) as unknown as Response
    );

    const { result } = renderHook(() => useCharacters());

    await act(async () => {
      result.current.search('Unknown');
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.error).toContain('404');
    expect(result.current.results).toEqual([]);
    expect(result.current.totalPages).toBe(1);
  });

  it('should load a new page via loadPage()', async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      new Response(JSON.stringify(mockData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }) as unknown as Response
    );

    const { result } = renderHook(() => useCharacters());

    await act(async () => {
      result.current.loadPage(
        'https://rickandmortyapi.com/api/character/?page=2',
        2
      );
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(result.current.page).toBe(2);
    expect(result.current.results).toEqual(mockData.results);
    expect(result.current.error).toBeNull();
  });
});
