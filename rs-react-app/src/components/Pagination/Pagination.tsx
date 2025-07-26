type Props = {
  page: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export default function Pagination({
  page,
  totalPages,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
}: Props) {
  return (
    <div style={{ marginTop: '16px' }}>
      <button onClick={onPrev} disabled={!hasPrev}>
        ◀ Предыдущая
      </button>
      <span style={{ margin: '0 12px' }}>
        Страница {page} из {totalPages}
      </span>
      <button onClick={onNext} disabled={!hasNext}>
        Следующая ▶
      </button>
    </div>
  );
}
