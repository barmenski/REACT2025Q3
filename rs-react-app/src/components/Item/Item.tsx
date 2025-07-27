type ItemProps = {
  name: string;
  image: string;
  onClick?: () => void;
};

export default function Item({ name, image, onClick }: ItemProps) {
  return (
    <div className="item" onClick={onClick} style={{ cursor: 'pointer' }}>
      <p className="item-name">{name}</p>
      {image && <img className="item-img" src={image} alt={name} />}
    </div>
  );
}
