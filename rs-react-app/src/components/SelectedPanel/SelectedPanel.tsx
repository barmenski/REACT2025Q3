import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { clearSelection } from '../../state/itemsSlice';

export default function SelectedPanel() {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) =>
    Object.values(state.checkedItems.items)
  );
  const count = selected.length;

  if (count === 0) return null; // Ничего не отображать, если нет выбранных

  const handleClear = () => {
    dispatch(clearSelection());
  };

  const handleDownload = () => {
    const csvHeader = 'ID,Name,Species\n';
    const csvRows = selected.map(
      (char) => `${char.id},"${char.name}","${char.species}"`
    );
    const csv = csvHeader + csvRows.join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'selected_characters.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="wrapper-selected-panel">
      <div>Выбрано: {count}</div>
      <div>
        <button onClick={handleClear}>Unselect all</button>
        <button onClick={handleDownload} style={{ marginLeft: 8 }}>
          Download
        </button>
      </div>
    </div>
  );
}
