import React, { useState, useMemo, useCallback } from 'react';
import type { CountriesObj } from '../types/country';
import Modal from './Modal';
import { getAllColumns } from '../utils/allColumns';

import { useFilters } from '../hooks/useFilters';
import { useHighlights } from '../hooks/useHighlights';
import { CountryTableControls } from './CountryTableControls';
import { CountryRow } from './CountryRow';

const CountriesTable: React.FC<CountriesObj> = ({ countries }) => {
  const allColumns = getAllColumns({ countries });

  const [selectedCols, setSelectedCols] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [prevYear, setPrevYear] = useState<number | null>(null);

  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'name' | 'population'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const visibleCols = useMemo(() => selectedCols, [selectedCols]);

  const filteredCountries = useFilters({
    countries,
    search,
    sortField,
    sortOrder,
    selectedYear,
  });

  const highlightedCells = useHighlights(
    countries,
    selectedYear,
    prevYear,
    visibleCols
  );

  const toggleExpand = useCallback(
    (country: string) => {
      setExpanded(expanded === country ? null : country);
    },
    [expanded]
  );

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrevYear(selectedYear);
    setSelectedYear(Number(e.target.value));
  };

  const toggleSort = () => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');

  return (
    <div>
      <button onClick={() => setModalOpen(true)}>Select columns</button>

      {modalOpen && (
        <Modal
          allColumns={allColumns}
          selected={selectedCols}
          onChange={setSelectedCols}
          onClose={() => setModalOpen(false)}
        />
      )}

      <CountryTableControls
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
        search={search}
        setSearch={setSearch}
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        toggleSort={toggleSort}
      />

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
              <CountryRow
                key={country}
                country={country}
                info={info}
                yearData={yearData}
                highlighted={highlightedCells[country]}
                visibleCols={visibleCols}
                expanded={expanded === country}
                toggleExpand={toggleExpand}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CountriesTable;
