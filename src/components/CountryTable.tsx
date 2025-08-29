import React, { useState, useMemo, useCallback } from 'react';

type YearData = {
  year: number;
  population?: number;
  co2?: number;
  co2_per_capita?: number;
};

type CountryData = {
  iso_code?: string;
  data: YearData[];
};

type Countries = {
  [country: string]: CountryData;
};

type Props = {
  countries: Countries;
};

const CountriesTable: React.FC<Props> = ({ countries }) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'name' | 'population'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const toggleExpand = useCallback(
    (country: string) => {
      setExpanded(expanded === country ? null : country);
    },
    [expanded]
  );

  const filteredCountries = useMemo(() => {
    let entries = Object.entries(countries);

    if (search.trim() !== '') {
      entries = entries.filter(([name]) =>
        name.toLowerCase().includes(search.toLowerCase())
      );
    }

    entries.sort(([nameA, dataA], [nameB, dataB]) => {
      if (sortField === 'name') {
        return sortOrder === 'asc'
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else {
        const popA =
          dataA.data.find((d) => d.year === selectedYear)?.population ?? 0;
        const popB =
          dataB.data.find((d) => d.year === selectedYear)?.population ?? 0;
        return sortOrder === 'asc' ? popA - popB : popB - popA;
      }
    });

    return entries;
  }, [countries, search, sortField, sortOrder, selectedYear]);

  return (
    <div>
      <div className="control-panel">
        <label>
          Year:{' '}
          <input
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          />
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
            onChange={(e) =>
              setSortField(e.target.value as 'name' | 'population')
            }
          >
            <option value="name">Name</option>
            <option value="population">Population</option>
          </select>
        </label>

        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          {sortOrder === 'asc' ? '⬆ Asc' : '⬇ Desc'}
        </button>
      </div>

      <table className="countries-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Population ({selectedYear})</th>
            <th>ISO Code</th>
          </tr>
        </thead>
        <tbody>
          {filteredCountries.map(([country, info]) => {
            const yearData = info.data.find((d) => d.year === selectedYear);
            return (
              <React.Fragment key={country}>
                <tr onClick={() => toggleExpand(country)} className="row-main">
                  <td>{country}</td>
                  <td>{yearData?.population?.toLocaleString() || 'N/A'}</td>
                  <td>{info.iso_code || 'N/A'}</td>
                </tr>

                {expanded === country && (
                  <tr>
                    <td className="row-expanded" colSpan={3}>
                      <table className="sub-table">
                        <thead>
                          <tr>
                            <th>Year</th>
                            <th>Population</th>
                            <th>CO₂</th>
                            <th>CO₂ per capita</th>
                          </tr>
                        </thead>
                        <tbody>
                          {info.data
                            .sort((a, b) => b.year - a.year)
                            .map((row) => (
                              <tr key={row.year}>
                                <td>{row.year}</td>
                                <td>
                                  {row.population?.toLocaleString() || 'N/A'}
                                </td>
                                <td>{row.co2 ?? 'N/A'}</td>
                                <td>{row.co2_per_capita ?? 'N/A'}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CountriesTable;
