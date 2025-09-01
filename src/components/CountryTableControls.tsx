type Props = {
  selectedYear: number;
  onYearChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  search: string;
  setSearch: (s: string) => void;
  sortField: 'name' | 'population';
  setSortField: (f: 'name' | 'population') => void;
  sortOrder: 'asc' | 'desc';
  toggleSort: () => void;
};

export const CountryTableControls = ({
  selectedYear,
  onYearChange,
  search,
  setSearch,
  sortField,
  setSortField,
  sortOrder,
  toggleSort,
}: Props) => (
  <div className="control-panel">
    <label>
      Year: <input type="number" value={selectedYear} onChange={onYearChange} />
    </label>

    <label>
      Search:{' '}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Type country name..."
      />
    </label>

    <label>
      Sort by:{' '}
      <select
        value={sortField}
        onChange={(e) => setSortField(e.target.value as 'name' | 'population')}
      >
        <option value="name">Name</option>
        <option value="population">Population</option>
      </select>
    </label>

    <button onClick={toggleSort}>
      {sortOrder === 'asc' ? '⬆ Asc' : '⬇ Desc'}
    </button>
  </div>
);
