import React from 'react';
import Item from '../Item/Item';
import type { Character } from './../App';

type ItemListProps = {
  results: Character[];
};

class ItemList extends React.Component<ItemListProps> {
  render() {
    return (
      <div className="item-list">
        {this.props.results.map((character) => (
          <Item
            key={character.id}
            name={character.name}
            image={character.image}
          />
        ))}
      </div>
    );
  }
}

export default ItemList;
