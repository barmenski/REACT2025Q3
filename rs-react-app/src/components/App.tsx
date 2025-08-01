import React, { useEffect } from 'react';
import { NavLink, useSearchParams } from 'react-router';
import SearchInput from './SearchInput/SearchInput';
import ItemList from './ItemList/ItemList';
import Header from './Header/Header';
import Loader from './Loader/Loader';
import ErrorDescription from './ErrorDescription/ErrorDescription';
import Pagination from './Pagination/Pagination';
import useCharacters from '../hooks/useCharacters';
import ItemDetails from './Item/ItemDetails';

const API_BASE_URL = 'https://rickandmortyapi.com/api/character/';

const App: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageFromUrl = Number(searchParams.get('page')) || 1;
  const detailsId = searchParams.get('details');

  const {
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
  } = useCharacters();

  // Загрузка результатов поиска
  useEffect(() => {
    if (hasLastQuery()) {
      const last = loadLastQuery();
      setCurrentQuery(last);
      const url = `${API_BASE_URL}?name=${encodeURIComponent(last)}&page=${pageFromUrl}`;
      loadPage(url, pageFromUrl);
    } else {
      search('');
    }
  }, [
    hasLastQuery,
    loadLastQuery,
    search,
    setCurrentQuery,
    loadPage,
    pageFromUrl,
  ]);

  // Обработка пагинации
  const handleNextPage = () => {
    if (nextPageUrl) {
      loadPage(nextPageUrl, page + 1);
      searchParams.set('page', String(page + 1));
      setSearchParams(searchParams);
    }
  };

  const handlePrevPage = () => {
    if (prevPageUrl) {
      loadPage(prevPageUrl, page - 1);
      searchParams.set('page', String(page - 1));
      setSearchParams(searchParams);
    }
  };

  // Обработка клика по элементу
  const handleItemClick = (id: number) => {
    searchParams.set('details', String(id));
    setSearchParams(searchParams);
  };

  return (
    <div className="wrapper-main">
      <Header />
      <NavLink
        to="about"
        className={({ isActive }) => (isActive ? 'active' : '')}
      >
        About
      </NavLink>

      <SearchInput
        onSearch={search}
        value={currentQuery}
        onChange={setCurrentQuery}
      />

      <div className="main-content">
        {/* Левая часть — список результатов */}

        <Loader loading={loading} />
        {!loading && results.length > 0 && (
          <>
            <div className="content">
              <ItemList results={results} onItemClick={handleItemClick} />
              {/* Правая часть — детали, если выбран элемент */}
              {detailsId && <ItemDetails />}
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              hasPrev={!!prevPageUrl}
              hasNext={!!nextPageUrl}
              onPrev={handlePrevPage}
              onNext={handleNextPage}
            />
          </>
        )}
        {error && <ErrorDescription message={error} />}
      </div>
    </div>
  );
};

export default App;
