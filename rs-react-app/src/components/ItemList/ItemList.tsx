import Item from '../Item/Item';
import type { Character } from '../../types';

type ItemListProps = {
  results: Character[];
};

export default function ItemList(props: ItemListProps) {
  const results = props.results || [];
  return (
    <div className="item-list">
      {results.map((character) => (
        <Item
          key={character.id}
          name={character.name}
          image={character.image}
        />
      ))}
    </div>
  );
}
