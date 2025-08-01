import Item from '../Item/Item';
import type { Character } from '../../types';

type ItemListProps = {
  results: Character[];
  onItemClick: (id: number) => void;
};

export default function ItemList({ results, onItemClick }: ItemListProps) {
  if (results.length === 0) return null;
  return (
    <div className="wrapper-item-list">
      <div className="item-list" data-testid="item-list">
        {results.map((character) => (
          <Item
            key={character.id}
            name={character.name}
            image={character.image}
            onClick={() => onItemClick(character.id)}
          />
        ))}
      </div>
    </div>
  );
}
