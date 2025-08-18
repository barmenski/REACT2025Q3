'use client'

import React, { useEffect, useState } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import SearchInput from './SearchInput/SearchInput';
import ItemList from './ItemList/ItemList';
import Loader from './Loader/Loader';
import ErrorDescription from './ErrorDescription/ErrorDescription';
import Pagination from './Pagination/Pagination';
import ItemDetails from './Item/ItemDetails';
import SelectedPanel from './SelectedPanel/SelectedPanel';

import {
  useGetCharactersQuery,
  useInvalidateCharactersMutation,
} from '../state/charactersApi';
import useLastQuery from '../hooks/useLastQuery';

const App: React.FC = () => {
  const searchParams = useSearchParams();
  const {
    saveQuery,
    loadQuery: loadLastQuery,
    hasQuery: hasLastQuery,
  } = useLastQuery();

  const [currentQuery, setCurrentQuery] = useState(() =>
    hasLastQuery() ? loadLastQuery() : ''
  );

  const [inputValue, setInputValue] = useState(currentQuery);
  const pathname = usePathname();
  const { replace } = useRouter();

  // const pageFromUrl = Number(searchParams.get('page')) || 1;
  const pageFromUrl = Number(searchParams.get('page')) || 1;

  const { data, error, isLoading, isFetching, refetch } = useGetCharactersQuery(
    { name: currentQuery, page: pageFromUrl }
  );

  const [invalidateCache] = useInvalidateCharactersMutation();

  useEffect(() => {
    saveQuery(currentQuery);
  }, [currentQuery, saveQuery]);

  const handleSearch = (q: string) => {
    const params = new URLSearchParams(searchParams);
    setCurrentQuery(q);
    params.set('page', '1');
    replace(`${pathname}?${params.toString()}`);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleNextPage = () => {
    const params = new URLSearchParams(searchParams);
    if (data?.info.next) {
      params.set('page', String(pageFromUrl + 1));
      replace(`${pathname}?${params.toString()}`);
      // setSearchParams(searchParams);
    }
  };

  const handlePrevPage = () => {
    const params = new URLSearchParams(searchParams);
    if (data?.info.prev) {
      params.set('page', String(pageFromUrl - 1));
      replace(`${pathname}?${params.toString()}`);
      // setSearchParams(searchParams);
    }
  };

  const detailsId = searchParams.get('details') || undefined;

  return (
    <div className="wrapper-main">
      <SearchInput
        onSearch={() => handleSearch(inputValue)}
        value={inputValue}
        onChange={handleInputChange}
      />
      <button
        onClick={() => {
          invalidateCache(undefined);
          refetch();
        }}
      >
        Refresh
      </button>

      <div className="main-content">
        <Loader loading={isLoading || isFetching} />

        {error ? (
          <ErrorDescription
            message={
              'status' in error
                ? `Ошибка: ${error.status}`
                : (error?.message ?? 'Неизвестная ошибка')
            }
          />
        ) : isLoading || isFetching ? null : (
          data?.results?.length && (
            <>
              <div className="content">
                <ItemList results={data.results} />
                {detailsId && <ItemDetails />}
              </div>

              <Pagination
                page={pageFromUrl}
                totalPages={data.info.pages}
                hasPrev={!!data.info.prev}
                hasNext={!!data.info.next}
                onPrev={handlePrevPage}
                onNext={handleNextPage}
              />
            </>
          )
        )}

        <SelectedPanel />
      </div>
    </div>
  );
};

export default App;
