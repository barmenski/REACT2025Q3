import React from 'react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  value: string;
  onChange: (value: string) => void;
}

class SearchInput extends React.Component<SearchInputProps> {
  constructor(props: SearchInputProps) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.props.onChange(e.target.value);
  }

  handleSearch() {
    this.props.onSearch(this.props.value);
  }

  handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      this.props.onSearch(this.props.value);
    }
  }

  render() {
    return (
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={this.props.value}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          placeholder="Введите запрос..."
        />
        <button onClick={this.handleSearch}>🔍 Поиск</button>
      </div>
    );
  }
}

export default SearchInput;
