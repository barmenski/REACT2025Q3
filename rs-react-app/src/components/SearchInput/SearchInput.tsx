import React from 'react';

type SearchInputProps = {
  onSearch: (query: string) => void;
  value: string;
  onChange: (value: string) => void;
};

export default function SearchInput(props: SearchInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(e.target.value);
  };

  const handleSearch = () => {
    props.onSearch(props.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      props.onSearch(props.value);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <input
        type="text"
        value={props.value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Введите запрос..."
      />
      <button onClick={handleSearch}>🔍 Поиск</button>
    </div>
  );
}
