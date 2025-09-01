import { useState } from 'react';

type ModalProps = {
  allColumns: string[];
  selected: string[];
  onChange: (cols: string[]) => void;
  onClose: () => void;
};

export default function Modal({
  allColumns,
  selected,
  onChange,
  onClose,
}: ModalProps) {
  const [temp, setTemp] = useState<string[]>(selected);

  const toggle = (col: string) => {
    setTemp((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const apply = () => {
    onChange(temp);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Select additional columns</h3>
        <div className="checkboxes">
          {allColumns.map((col) => (
            <label key={col}>
              <input
                type="checkbox"
                checked={temp.includes(col)}
                onChange={() => toggle(col)}
              />
              {col}
            </label>
          ))}
        </div>
        <div className="actions">
          <button onClick={apply}>Apply</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
