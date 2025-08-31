import { useMemo } from 'react';
import type { Countries } from '../types/country';

export function useFilters({
  countries,
  search,
  sortField,
  sortOrder,
  selectedYear,
}: {
  countries: Countries;
  search: string;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
  selectedYear: number;
}) {
  return useMemo(() => {
    let entries = Object.entries(countries);

    if (search.trim()) {
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
}
