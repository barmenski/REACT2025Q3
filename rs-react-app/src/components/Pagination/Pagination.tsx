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
    <div className="wrapper-pagination">
      <button onClick={onPrev} disabled={!hasPrev}>
        ◀ Предыдущая
      </button>
      <span className="pagination-info">
        Страница {page} из {totalPages}
      </span>
      <button onClick={onNext} disabled={!hasNext}>
        Следующая ▶
      </button>
    </div>
  );
}
