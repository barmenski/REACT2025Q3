import React from 'react';

type ItemProps = {
  name: string;
  image: string;
};

class Item extends React.Component<ItemProps> {
  render() {
    const { name, image } = this.props;
    return (
      <div>
        <p>{this.props.name}</p>
        {image && <img src={image} alt={name} />}
      </div>
    );
  }
}

export default Item;
