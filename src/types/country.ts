export type YearData = {
  year: number;
  population?: number;
  cement_co2?: number;
  cement_co2_per_capita?: number;
  co2?: number;
  co2_growth_abs?: number;
  co2_growth_prct?: number;
  co2_per_capita?: number;
  cumulative_cement_co2?: number;
  cumulative_co2?: number;
  cumulative_flaring_co2?: number;
  cumulative_oil_co2?: number;
  flaring_co2?: number;
  flaring_co2_per_capita?: number;
  nitrous_oxide?: number;
  nitrous_oxide_per_capita?: number;
  oil_co2?: number;
  oil_co2_per_capita?: number;
  share_global_cement_co2?: number;
  share_global_co2?: number;
  share_global_cumulative_cement_co2?: number;
  share_global_cumulative_co2?: number;
  share_global_cumulative_flaring_co2?: number;
  share_global_cumulative_oil_co2?: number;
  share_global_flaring_co2?: number;
  share_global_oil_co2?: number;
  share_of_temperature_change_from_ghg?: number;
  temperature_change_from_ch4?: number;
  temperature_change_from_co2?: number;
  temperature_change_from_ghg?: number;
  temperature_change_from_n2o?: number;
};

export type CountryData = {
  iso_code?: string;
  data: YearData[];
};

// export type CountriesData = Record<string, CountryData>;

export type Countries = {
  [country: string]: CountryData;
};

export type CountriesObj = {
  countries: Countries;
};
