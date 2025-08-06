import { renderHook, act } from '@testing-library/react';
import useLastQuery from '../src/hooks/useLastQuery';
import { vi } from 'vitest';

describe('useLastQuery', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('should save query to localStorage', () => {
    const { result } = renderHook(() => useLastQuery());

    act(() => {
      result.current.saveQuery('Morty');
    });

    expect(localStorage.getItem('lastQuery')).toBe('Morty');
  });

  it('should load query from localStorage', () => {
    localStorage.setItem('lastQuery', 'Summer');

    const { result } = renderHook(() => useLastQuery());

    let value = '';
    act(() => {
      value = result.current.loadQuery();
    });

    expect(value).toBe('Summer');
  });

  it('should return empty string if no query saved', () => {
    const { result } = renderHook(() => useLastQuery());

    let value = 'initial';
    act(() => {
      value = result.current.loadQuery();
    });

    expect(value).toBe('');
  });

  it('should return true from hasQuery when query exists', () => {
    localStorage.setItem('lastQuery', 'Beth');

    const { result } = renderHook(() => useLastQuery());

    let hasQuery = false;
    act(() => {
      hasQuery = result.current.hasQuery();
    });

    expect(hasQuery).toBe(true);
  });

  it('should return false from hasQuery when no query', () => {
    const { result } = renderHook(() => useLastQuery());

    let hasQuery = true;
    act(() => {
      hasQuery = result.current.hasQuery();
    });

    expect(hasQuery).toBe(false);
  });
});
