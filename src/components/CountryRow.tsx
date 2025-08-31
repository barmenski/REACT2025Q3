import React from 'react';
import type { CountryData, YearData } from '../types/country';

type CountryRowProps = {
  country: string;
  info: CountryData;
  yearData: YearData | undefined;
  highlighted: string[] | undefined;
  visibleCols: string[];
  expanded: boolean;
  toggleExpand: (c: string) => void;
};

const CountryRowComponent: React.FC<CountryRowProps> = ({
  country,
  info,
  yearData,
  highlighted,
  visibleCols,
  expanded,
  toggleExpand,
}) => (
  <>
    <tr onClick={() => toggleExpand(country)} className="row-main">
      <td>{country}</td>
      <td className={highlighted?.includes('population') ? 'highlight' : ''}>
        {yearData?.population?.toLocaleString() || 'N/A'}
      </td>
      <td>{info.iso_code || 'N/A'}</td>
      {visibleCols.map((col) => (
        <td key={col} className={highlighted?.includes(col) ? 'highlight' : ''}>
          {yearData && col in yearData
            ? (yearData[col as keyof typeof yearData] ?? 'N/A').toString()
            : 'N/A'}
        </td>
      ))}
    </tr>
    {expanded && (
      <tr>
        <td className="row-expanded" colSpan={visibleCols.length + 3}>
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
                    <td>{row.population?.toLocaleString() || 'N/A'}</td>
                    <td>{row.co2 ?? 'N/A'}</td>
                    <td>{row.co2_per_capita ?? 'N/A'}</td>
                    {visibleCols.map((col) => (
                      <td key={col}>{row[col as keyof typeof row] ?? 'N/A'}</td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </td>
      </tr>
    )}
  </>
);

export const CountryRow = React.memo(CountryRowComponent);
CountryRow.displayName = 'CountryRow';
