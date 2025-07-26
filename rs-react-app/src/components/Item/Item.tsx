type ItemProps = {
  name: string;
  image: string;
};

export default function Item(props: ItemProps) {
  const { name, image } = props;
  return (
    <div className="item">
      <p className="item-name">{props.name}</p>
      {image && <img className="item-img" src={image} alt={name} />}
    </div>
  );
}
