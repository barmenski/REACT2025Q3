import { useSearchParams } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { toggleCharacter } from '../../state/itemsSlice';
import type { Character } from '../../types';

export default function Item({ item }: { item: Character }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useAppDispatch();
  const selected = useAppSelector(
    (state) => state.checkedItems.items[item.id] !== undefined
  );

  const handleChange = () => {
    dispatch(toggleCharacter(item));
  };

  const handleItemClick = (id: number) => {
    searchParams.set('details', String(id));
    setSearchParams(searchParams);
  };

  return (
    <div className="item" data-testid="item">
      <input type="checkbox" checked={selected} onChange={handleChange}></input>
      <p className="item-name" onClick={() => handleItemClick(item.id)}>
        {item.name}
      </p>
      {item.image && (
        <img className="item-img" src={item.image} alt={item.name} />
      )}
    </div>
  );
}
