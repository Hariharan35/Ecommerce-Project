function pagesToShow(page, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, 2, total - 1, total, page - 1, page, page + 1]);
  const list = [...set].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  return list.flatMap((p, i) => (i > 0 && p - list[i - 1] > 1 ? ["…", p] : [p]));
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="pagination" aria-label="Pagination">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</button>
      {pagesToShow(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="gap">…</span>
        ) : (
          <button key={p} className={p === page ? "active" : ""} aria-current={p === page ? "page" : undefined} onClick={() => onChange(p)}>
            {p}
          </button>
        )
      )}
      <button disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next</button>
    </nav>
  );
}

export default Pagination;
