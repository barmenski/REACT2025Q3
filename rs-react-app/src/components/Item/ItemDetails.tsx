import { useSearchParams } from 'react-router';
import { useGetCharacterByIdQuery } from '../../state/charactersApi';

export default function ItemDetails() {
  const [searchParams, setSearchParams] = useSearchParams();
  const detailsId = searchParams.get('details');
  const idNum = detailsId ? parseInt(detailsId, 10) : undefined;

  const { data, isLoading, isError } = useGetCharacterByIdQuery(
    idNum ?? (Symbol() as unknown as number),
    {
      skip: idNum === undefined,
    }
  );

  const closeDetails = () => {
    searchParams.delete('details');
    setSearchParams(searchParams);
  };

  if (!detailsId) return null;
  if (isLoading) return <p>Loading details...</p>;
  if (isError || !data) return <p>No data</p>;

  return (
    <div className="item-details" data-testid="item-details">
      <button className="button-close" onClick={closeDetails}>
        ✖
      </button>
      <h2>{data.name}</h2>
      <img src={data.image} alt={data.name} />
      <p>
        <strong>Species:</strong> {data.species}
      </p>
      <p>
        <strong>Type:</strong> {data.type || 'N/A'}
      </p>
    </div>
  );
}
