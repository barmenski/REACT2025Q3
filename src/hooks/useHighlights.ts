import { useEffect, useState } from 'react';
import type { Countries } from '../types/country';

export function useHighlights(
  countries: Countries,
  selectedYear: number,
  prevYear: number | null,
  visibleCols: string[]
) {
  const [highlightedCells, setHighlightedCells] = useState<
    Record<string, string[]>
  >({});

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

      if (changed.length > 0) newHighlights[country] = changed;
    });

    setHighlightedCells(newHighlights);
    const timer = setTimeout(() => setHighlightedCells({}), 1000);
    return () => clearTimeout(timer);
  }, [selectedYear, prevYear, countries, visibleCols]);

  return highlightedCells;
}
