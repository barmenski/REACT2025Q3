import { Suspense, useMemo } from 'react';
import { Loader } from './components/Loader';
import CountryTable from './components/CountryTable';
import { getCountryResource } from './utils/countryResource';

function CountryListWrapper({
  resource,
}: {
  resource: ReturnType<typeof getCountryResource>;
}) {
  const countriesObj = resource.read();
  return <CountryTable countries={countriesObj} />;
}

function App() {
  const countryResource = useMemo(() => getCountryResource(), []);

  return (
    <Suspense fallback={<Loader />}>
      <h1>CO₂ Data by Country</h1>
      <CountryListWrapper resource={countryResource} />
    </Suspense>
  );
}

export default App;
