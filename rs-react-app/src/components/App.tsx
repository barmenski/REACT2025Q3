import React from 'react';
import SearchInput from './SearchInput/SearchInput';
import ItemList from './ItemList/ItemList';
import Header from './Header/Header';
import Loader from './Loader/Loader';
import ErrorDescription from './ErrorDescription/ErrorDescription';
import ErrorButton from './ErrorButton/ErrorButton';
import './App.css';

export type Character = {
  id: number;
  name: string;
  image: string;
};

type ApiResponse = {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
};

type AppState = {
  results: Character[];
  currentQuery: string;
  currentPageUrl: string;
  nextPageUrl: string | null;
  prevPageUrl: string | null;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  forceRenderError: boolean;
};

class App extends React.Component<object, AppState> {
  constructor(props: object) {
    super(props);

    this.state = {
      results: [],
      currentQuery: '',
      currentPageUrl: '',
      nextPageUrl: null,
      prevPageUrl: null,
      page: 1,
      totalPages: 1,
      loading: false,
      error: null,
      forceRenderError: false,
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.loadPage = this.loadPage.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
    this.handlePrevPage = this.handlePrevPage.bind(this);
    this.triggerTestError = this.triggerTestError.bind(this);
  }

  componentDidMount() {
    const savedQuery = localStorage.getItem('lastQuery');
    if (savedQuery) {
      this.setState({ currentQuery: savedQuery });
      this.handleSearch(savedQuery);
    }
  }

  handleQueryChange(newQuery: string) {
    this.setState({ currentQuery: newQuery });
  }

  handleSearch(queryRaw: string) {
    const query = queryRaw.trim();

    if (!query) {
      localStorage.removeItem('lastQuery');
      this.setState({
        results: [],
        currentQuery: '',
        nextPageUrl: null,
        prevPageUrl: null,
        page: 1,
        totalPages: 1,
      });
      return;
    }

    localStorage.setItem('lastQuery', query);

    const url = `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(query)}`;
    this.loadPage(url, 1);
  }

  triggerTestError() {
    this.setState({ forceRenderError: true });
  }

  loadPage(url: string, page: number) {
    this.setState({ loading: true, error: null });
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('404: Персонажи не найдены');
          }
          if (response.status === 503) {
            throw new Error('503: Сервис временно недоступен');
          }
          throw new Error(`${response.status}: Ошибка сервера`);
        }
        return response.json();
      })
      .then((data: ApiResponse) => {
        if (data.results && data.results.length > 0) {
          this.setState({
            results: data.results,
            currentPageUrl: url,
            nextPageUrl: data.info.next,
            prevPageUrl: data.info.prev,
            page,
            totalPages: data.info.pages,
            loading: false,
            error: null,
          });
        } else {
          this.setState({
            results: [],
            nextPageUrl: null,
            prevPageUrl: null,
            page: 1,
            totalPages: 1,
            loading: false,
            error: 'Персонажи не найдены',
          });
        }
      })
      .catch((err) => {
        console.error(err);
        this.setState({
          results: [],
          nextPageUrl: null,
          prevPageUrl: null,
          page: 1,
          totalPages: 1,
          loading: false,
          error: err.message || 'Ошибка загрузки',
        });
      });
  }

  handleNextPage() {
    if (this.state.nextPageUrl) {
      this.loadPage(this.state.nextPageUrl, this.state.page + 1);
    }
  }

  handlePrevPage() {
    if (this.state.prevPageUrl) {
      this.loadPage(this.state.prevPageUrl, this.state.page - 1);
    }
  }

  render() {
    return (
      <div className="wrapper-main">
        <Header />
        <SearchInput
          onSearch={this.handleSearch}
          value={this.state.currentQuery}
          onChange={this.handleQueryChange}
        />
        <div className="result">
          {this.state.forceRenderError &&
            (() => {
              throw new Error('Тестовая ошибка рендера');
            })()}
          {this.state.loading && <Loader />}
          {!this.state.loading && this.state.results.length > 0 ? (
            <>
              <ItemList results={this.state.results} />
              <div style={{ marginTop: '16px' }}>
                <button
                  onClick={this.handlePrevPage}
                  disabled={!this.state.prevPageUrl}
                >
                  ◀ Предыдущая
                </button>
                <span style={{ margin: '0 12px' }}>
                  Страница {this.state.page} из {this.state.totalPages}
                </span>
                <button
                  onClick={this.handleNextPage}
                  disabled={!this.state.nextPageUrl}
                >
                  Следующая ▶
                </button>
              </div>
            </>
          ) : null}
        </div>
        {this.state.error && <ErrorDescription message={this.state.error} />}
        <ErrorButton onError={this.triggerTestError} />
      </div>
    );
  }
}

export default App;
