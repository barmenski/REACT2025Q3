import { createResource } from './fetchWithCache';
import type { CountryData } from '../types/country';

export function getCountryResource() {
  return createResource(
    fetch('/data/owid-co2-data.json').then(
      (res) => res.json() as Promise<Record<string, CountryData>>
    )
  );
}
