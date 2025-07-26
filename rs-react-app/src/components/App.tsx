import React, { useEffect } from 'react';
import SearchInput from './SearchInput/SearchInput';
import ItemList from './ItemList/ItemList';
import Header from './Header/Header';
import Loader from './Loader/Loader';
import ErrorDescription from './ErrorDescription/ErrorDescription';
import ErrorButton from './ErrorButton/ErrorButton';
import Pagination from './Pagination/Pagination';
import useCharacters from '../hooks/useCharacters';
import './App.css';

const App: React.FC = () => {
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

  useEffect(() => {
    if (hasLastQuery()) {
      const last = loadLastQuery();
      setCurrentQuery(last);
      search(last);
    } else {
      search('');
    }
  }, [hasLastQuery, loadLastQuery, search, setCurrentQuery]);

  const handleNextPage = () => {
    if (nextPageUrl) loadPage(nextPageUrl, page + 1);
  };

  const handlePrevPage = () => {
    if (prevPageUrl) loadPage(prevPageUrl, page - 1);
  };

  return (
    <div className="wrapper-main">
      <Header />
      <SearchInput
        onSearch={search}
        value={currentQuery}
        onChange={setCurrentQuery}
      />
      <div className="result">
        <Loader loading={loading} />
        {!loading && results.length > 0 && (
          <>
            <ItemList results={results} />
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
      </div>
      {error && <ErrorDescription message={error} />}
      <ErrorButton />
    </div>
  );
};

export default App;
