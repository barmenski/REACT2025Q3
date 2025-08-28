import React, { useState } from 'react';

type YearData = {
  year: number;
  population?: number;
  cement_co2?: number;
  cement_co2_per_capita?: number;
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

  const toggleExpand = (country: string) => {
    setExpanded(expanded === country ? null : country);
  };

  return (
    <table className="countries-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Population (Latest)</th>
          <th>ISO Code</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(countries).map(([country, info]) => {
          const latestYear = Math.max(...info.data.map((d) => d.year));
          const latestData = info.data.find((d) => d.year === latestYear);

          return (
            <React.Fragment key={country}>
              <tr onClick={() => toggleExpand(country)} className="row-main">
                <td>{country}</td>
                <td>{latestData?.population?.toLocaleString() || 'N/A'}</td>
                <td>{info.iso_code || 'N/A'}</td>
              </tr>

              {expanded === country && (
                <tr>
                  <td colSpan={3} className="row-expanded">
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
                              <td>{row.cement_co2 ?? 'N/A'}</td>
                              <td>{row.cement_co2_per_capita ?? 'N/A'}</td>
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
  );
};

export default CountriesTable;
