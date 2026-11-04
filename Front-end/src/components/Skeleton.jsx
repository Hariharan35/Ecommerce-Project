export function ProductCardSkeleton() {
  return (
    <div className="product-card skeleton-card" aria-hidden="true">
      <div className="skeleton sk-img" />
      <div className="skeleton sk-line" />
      <div className="skeleton sk-line short" />
      <div className="skeleton sk-line short" />
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="product-grid">
      {Array.from({ length: count }, (_, i) => <ProductCardSkeleton key={i} />)}
    </div>
  );
}
