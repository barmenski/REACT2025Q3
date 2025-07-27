import Item from '../Item/Item';
import type { Character } from '../../types';

type ItemListProps = {
  results: Character[];
  onItemClick: (id: number) => void;
};

export default function ItemList({ results, onItemClick }: ItemListProps) {
  return (
    <div className="item-list">
      {results.map((character) => (
        <Item
          key={character.id}
          data-testid="item"
          name={character.name}
          image={character.image}
          onClick={() => onItemClick(character.id)}
        />
      ))}
    </div>
  );
}
