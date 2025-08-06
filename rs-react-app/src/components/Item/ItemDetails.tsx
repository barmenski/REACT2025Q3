import { useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';
import type { Character } from '../../types';

export default function ItemDetails() {
  const [searchParams, setSearchParams] = useSearchParams();
  const detailsId = searchParams.get('details');

  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!detailsId) return;

    const fetchCharacter = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://rickandmortyapi.com/api/character/${detailsId}`
        );
        const data = await res.json();
        setCharacter(data);
      } catch {
        setCharacter(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [detailsId]);

  const closeDetails = () => {
    searchParams.delete('details');
    setSearchParams(searchParams);
  };

  if (!detailsId) return null;
  if (loading) return <p>⏳ Загрузка...</p>;
  if (!character) return <p>No data</p>;

  return (
    <div className="item-details" data-testid="item-details">
      <button className="button-close" onClick={closeDetails}>
        ✖
      </button>

      <h2>{character.name}</h2>
      <img src={character.image} alt={character.name} />
      <p>
        <strong>Species:</strong> {character.species}
      </p>
      <p>
        <strong>Type:</strong> {character.type || 'N/A'}
      </p>
    </div>
  );
}
