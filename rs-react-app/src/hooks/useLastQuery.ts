'use client'

import { useCallback } from 'react';

const LAST_QUERY_KEY = 'lastQuery';

export default function useLastQuery() {
  const saveQuery = useCallback((query: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LAST_QUERY_KEY, query);
    }

  }, []);

  const loadQuery = useCallback((): string => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(LAST_QUERY_KEY) || '';
    };
    return '';
  }, []);

  const hasQuery = useCallback((): boolean => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(LAST_QUERY_KEY) !== null;
    };
    return false;
  }, []);

  return { saveQuery, loadQuery, hasQuery };
}
