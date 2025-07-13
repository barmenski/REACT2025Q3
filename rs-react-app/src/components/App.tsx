import React from 'react';
import SearchInput from './SearchInput/SearchInput';
import Item from './Item/Item';
import Header from './Header/Header';
import './App.css';

type Character = {
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
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.loadPage = this.loadPage.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
    this.handlePrevPage = this.handlePrevPage.bind(this);
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

  loadPage(url: string, page: number) {
    fetch(url)
      .then((response) => response.json())
      .then((data: ApiResponse) => {
        if (data.results && data.results.length > 0) {
          this.setState({
            results: data.results,
            currentPageUrl: url,
            nextPageUrl: data.info.next,
            prevPageUrl: data.info.prev,
            page: page,
            totalPages: data.info.pages,
          });
        } else {
          this.setState({
            results: [],
            nextPageUrl: null,
            prevPageUrl: null,
            page: 1,
            totalPages: 1,
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
        <div>
          <SearchInput
            onSearch={this.handleSearch}
            value={this.state.currentQuery}
            onChange={this.handleQueryChange}
          />
        </div>
        <div>
          {this.state.results.length > 0 ? (
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {this.state.results.map((character) => (
                  <Item
                    key={character.id}
                    name={character.name}
                    image={character.image}
                  />
                ))}
              </div>

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
          ) : (
            <p style={{ marginTop: '20px' }}>Нет результатов</p>
          )}
        </div>
      </div>
    );
  }
}

export default App;
