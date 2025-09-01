import { Suspense } from 'react';
import { Loader } from './components/Loader';
import CountryTable from './components/CountryTable';
import { getCountryResource } from './utils/countryResource';

function CountryTableWrapper({
  resource,
}: {
  resource: ReturnType<typeof getCountryResource>;
}) {
  const countriesObj = resource.read();
  return <CountryTable countries={countriesObj} />;
}

function App() {
  const countryResource = getCountryResource();

  return (
    <>
      <h1>CO₂ Data by Country</h1>
      <Suspense fallback={<Loader />}>
        <CountryTableWrapper resource={countryResource} />
      </Suspense>
    </>
  );
}

export default App;
