import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { toggleCharacter } from '../../state/itemsSlice';
import type { Character } from '../../types';

export default function Item({ item }: { item: Character }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const dispatch = useAppDispatch();
  const selected = useAppSelector(
    (state) => state.checkedItems.items[item.id] !== undefined
  );

  const handleChange = () => {
    dispatch(toggleCharacter(item));
  };

  const handleItemClick = (id: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('details', String(id));
    replace(`${pathname}?${params.toString()}`);
    // setSearchParams(searchParams);
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
