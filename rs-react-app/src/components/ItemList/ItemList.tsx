import Item from '../Item/Item';
import type { Character } from '../../types';

type ItemListProps = {
  results: Character[];
};

export default function ItemList({ results }: ItemListProps) {
  if (results.length === 0) return null;
  return (
    <div className="wrapper-item-list">
      <div className="item-list" data-testid="item-list">
        {results.map((character) => (
          <Item item={character} key={character.id} />
        ))}
      </div>
    </div>
  );
}
