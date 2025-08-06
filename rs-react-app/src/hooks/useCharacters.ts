import { useState, useCallback } from 'react';
import type { Character } from '../types';
import useLastQuery from './useLastQuery';

const API_BASE_URL = 'https://rickandmortyapi.com/api/character/';

function useCharacters() {
  const {
    saveQuery,
    loadQuery: loadLastQuery,
    hasQuery: hasLastQuery,
  } = useLastQuery();

  const [results, setResults] = useState<Character[]>([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFromUrl = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) throw new Error('404: Персонажи не найдены');
      if (response.status === 503)
        throw new Error('503: Сервис временно недоступен');
      throw new Error(`${response.status}: Ошибка сервера`);
    }
    return response.json();
  };

  const search = useCallback(
    (queryRaw: string) => {
      const query = queryRaw.trim();
      saveQuery(query);
      setLoading(true);
      setError(null);

      const url = `${API_BASE_URL}?name=${encodeURIComponent(query)}&page=1`;

      fetchFromUrl(url)
        .then((data) => {
          setResults(data.results);
          setCurrentQuery(query);
          setNextPageUrl(data.info.next);
          setPrevPageUrl(data.info.prev);
          setPage(1);
          setTotalPages(data.info.pages);
          setLoading(false);
        })
        .catch((err) => {
          setResults([]);
          setError(err.message);
          setNextPageUrl(null);
          setPrevPageUrl(null);
          setPage(1);
          setTotalPages(1);
          setLoading(false);
        });
    },
    [saveQuery]
  );

  const loadPage = useCallback((url: string, newPage: number) => {
    setLoading(true);
    setError(null);

    fetchFromUrl(url)
      .then((data) => {
        setResults(data.results);
        setNextPageUrl(data.info.next);
        setPrevPageUrl(data.info.prev);
        setPage(newPage);
        setTotalPages(data.info.pages);
        setLoading(false);
      })
      .catch((err) => {
        setResults([]);
        setError(err.message);
        setNextPageUrl(null);
        setPrevPageUrl(null);
        setPage(1);
        setTotalPages(1);
        setLoading(false);
      });
  }, []);

  return {
    results,
    currentQuery,
    setCurrentQuery,
    nextPageUrl,
    prevPageUrl,
    page,
    totalPages,
    loading,
    error,
    search,
    loadPage,
    loadLastQuery,
    hasLastQuery,
  };
}

export default useCharacters;
