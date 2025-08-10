import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    saveQuery,
    loadQuery: loadLastQuery,
    hasQuery: hasLastQuery,
  } = useLastQuery();

  // Состояние текущего запроса (поиска)
  const [currentQuery, setCurrentQuery] = useState(() =>
    hasLastQuery() ? loadLastQuery() : ''
  );

  const [inputValue, setInputValue] = useState(currentQuery);

  // Номер страницы из URL или 1 по умолчанию
  const pageFromUrl = Number(searchParams.get('page')) || 1;

  // RTK Query: данные по текущему запросу и странице
  const { data, error, isLoading, isFetching, refetch } = useGetCharactersQuery(
    { name: currentQuery, page: pageFromUrl }
  );

  const [invalidateCache] = useInvalidateCharactersMutation();

  // При изменении currentQuery сохраняем его в useLastQuery
  useEffect(() => {
    saveQuery(currentQuery);
  }, [currentQuery, saveQuery]);

  // Обработчик поиска:
  // - обновляет currentQuery
  // - сбрасывает страницу в 1 в URL
  const handleSearch = (q: string) => {
    setCurrentQuery(q);
    searchParams.set('page', '1');
    setSearchParams(searchParams);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  // Обработчики пагинации меняют только page в URL
  const handleNextPage = () => {
    if (data?.info.next) {
      searchParams.set('page', String(pageFromUrl + 1));
      setSearchParams(searchParams);
    }
  };

  const handlePrevPage = () => {
    if (data?.info.prev) {
      searchParams.set('page', String(pageFromUrl - 1));
      setSearchParams(searchParams);
    }
  };

  // Получаем id детали из URL
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
