import type { CountriesObj } from '../types/country';

export function getAllColumns({ countries }: CountriesObj): string[] {
  const allKeys = new Set<string>();

  for (const [, countryData] of Object.entries(countries)) {
    for (const yearData of countryData.data) {
      Object.keys(yearData).forEach((key) => {
        if (key !== 'year') {
          allKeys.add(key);
        }
      });
    }
  }

  return Array.from(allKeys);
}
