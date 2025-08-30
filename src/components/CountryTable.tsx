import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { CountriesObj } from '../types/country';
import Modal from './Modal';
import { getAllColumns } from '../utils/allColumns';

const CountriesTable: React.FC<CountriesObj> = ({ countries }) => {
  const allColumns = getAllColumns({ countries });

  const [selectedCols, setSelectedCols] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [prevYear, setPrevYear] = useState<number | null>(null);
  const [highlightedCells, setHighlightedCells] = useState<
    Record<string, string[]>
  >({});

  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'name' | 'population'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const visibleCols = useMemo(() => selectedCols, [selectedCols]);

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

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrevYear(selectedYear);
    setSelectedYear(Number(e.target.value));
  };

  useEffect(() => {
    if (!prevYear) return;

    const newHighlights: Record<string, string[]> = {};

    Object.entries(countries).forEach(([country, info]) => {
      const prevData = info.data.find((d) => d.year === prevYear);
      const currData = info.data.find((d) => d.year === selectedYear);

      if (!prevData || !currData) return;

      const changed: string[] = [];

      if (prevData.population !== currData.population) {
        changed.push('population');
      }

      visibleCols.forEach((col) => {
        if (
          prevData[col as keyof typeof prevData] !==
          currData[col as keyof typeof currData]
        ) {
          changed.push(col);
        }
      });

      if (changed.length > 0) {
        newHighlights[country] = changed;
      }
    });

    setHighlightedCells(newHighlights);

    const timer = setTimeout(() => setHighlightedCells({}), 1000);
    return () => clearTimeout(timer);
  }, [selectedYear]);

  return (
    <div>
      <button onClick={() => setModalOpen(true)}>Выбрать колонки</button>

      {modalOpen && (
        <Modal
          allColumns={allColumns}
          selected={selectedCols}
          onChange={setSelectedCols}
          onClose={() => setModalOpen(false)}
        />
      )}
      <div className="control-panel">
        <label>
          Year:{' '}
          <input
            type="number"
            value={selectedYear}
            onChange={handleYearChange}
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
            {visibleCols.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filteredCountries.map(([country, info]) => {
            const yearData = info.data.find((d) => d.year === selectedYear);

            return (
              <React.Fragment key={country}>
                <tr onClick={() => toggleExpand(country)} className="row-main">
                  <td>{country}</td>
                  <td
                    className={
                      highlightedCells[country]?.includes('population')
                        ? 'highlight'
                        : ''
                    }
                  >
                    {yearData?.population?.toLocaleString() || 'N/A'}
                  </td>
                  <td>{info.iso_code || 'N/A'}</td>

                  {visibleCols.map((col) => (
                    <td
                      key={col}
                      className={
                        highlightedCells[country]?.includes(col)
                          ? 'highlight'
                          : ''
                      }
                    >
                      {yearData && col in yearData
                        ? (
                            yearData[col as keyof typeof yearData] ?? 'N/A'
                          ).toString()
                        : 'N/A'}
                    </td>
                  ))}
                </tr>

                {expanded === country && (
                  <tr>
                    <td
                      className="row-expanded"
                      colSpan={visibleCols.length + 3}
                    >
                      <table className="sub-table">
                        <thead>
                          <tr>
                            <th>Year</th>
                            <th>Population</th>
                            <th>CO₂</th>
                            <th>CO₂ per capita</th>
                            {visibleCols.map((col) => (
                              <th key={col}>{col}</th>
                            ))}
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
                                {visibleCols.map((col) => (
                                  <td key={col}>
                                    {row[col as keyof typeof row] ?? 'N/A'}
                                  </td>
                                ))}
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
