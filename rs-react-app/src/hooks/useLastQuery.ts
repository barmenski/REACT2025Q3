import { useCallback } from 'react';

const LAST_QUERY_KEY = 'lastQuery';

export default function useLastQuery() {
  const saveQuery = useCallback((query: string) => {
    localStorage.setItem(LAST_QUERY_KEY, query);
  }, []);

  const loadQuery = useCallback((): string => {
    return localStorage.getItem(LAST_QUERY_KEY) || '';
  }, []);

  const hasQuery = useCallback((): boolean => {
    return localStorage.getItem(LAST_QUERY_KEY) !== null;
  }, []);

  return { saveQuery, loadQuery, hasQuery };
}
