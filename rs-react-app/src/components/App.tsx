import React from 'react';
import SearchInput from './SearchInput/SearchInput';
import ItemList from './ItemList/ItemList';
import Header from './Header/Header';
import Loader from './Loader/Loader';
import ErrorDescription from './ErrorDescription/ErrorDescription';
import ErrorButton from './ErrorButton/ErrorButton';
import './App.css';
import { CharacterService } from './CharacterService/CharacterService';
import type { Character } from '../types';

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
  private service: CharacterService;

  constructor(props: object) {
    super(props);
    this.service = new CharacterService();
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
    const savedQuery = this.service.loadLastQuery();
    this.setState({ currentQuery: savedQuery });
    this.handleSearch(savedQuery);
  }

  handleQueryChange(newQuery: string) {
    this.setState({ currentQuery: newQuery });
  }

  handleSearch(queryRaw: string) {
    const query = queryRaw.trim();
    this.service.saveQuery(query);
    this.setState({ loading: true, error: null });

    this.service
      .fetchCharacters(query)
      .then((data) => {
        this.setState({
          results: data.results,
          currentPageUrl: `${this.service.baseUrl}?name=${encodeURIComponent(query)}`,
          nextPageUrl: data.info.next,
          prevPageUrl: data.info.prev,
          page: 1,
          totalPages: data.info.pages,
          loading: false,
        });
      })
      .catch((err) => {
        this.setState({
          results: [],
          loading: false,
          error: err.message,
          nextPageUrl: null,
          prevPageUrl: null,
          page: 1,
          totalPages: 1,
        });
      });
  }

  loadPage(url: string, page: number) {
    this.setState({ loading: true, error: null });

    this.service
      .fetchFromUrl(url)
      .then((data) => {
        this.setState({
          results: data.results,
          currentPageUrl: url,
          nextPageUrl: data.info.next,
          prevPageUrl: data.info.prev,
          page,
          totalPages: data.info.pages,
          loading: false,
        });
      })
      .catch((err) => {
        this.setState({
          results: [],
          loading: false,
          error: err.message,
          nextPageUrl: null,
          prevPageUrl: null,
          page: 1,
          totalPages: 1,
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

  triggerTestError() {
    this.setState({ forceRenderError: true });
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
          <Loader loading={this.state.loading} />
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
        <ErrorButton />
      </div>
    );
  }
}

export default App;
