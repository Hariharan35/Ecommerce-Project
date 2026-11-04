import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiFilter, FiSearch } from "react-icons/fi";
import { getProducts } from "../services/api";
import Carousel from "../components/Carousel";
import ProductRow from "../components/ProductRow";
import TrustBar from "../components/TrustBar";
import CategoryTiles from "../components/CategoryTiles";
import PromoBanner from "../components/PromoBanner";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import Pagination from "../components/Pagination";
import { SkeletonGrid } from "../components/Skeleton";
import { categoryLabel } from "../utils/format";

const SORTS = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];
const DEFAULT_FILTERS = { min: "", max: "", inStock: false };

function Products() {
  const [params, setParams] = useSearchParams();
  const search = params.get("search") || "";
  const category = params.get("category") || "";
  const page = Math.max(parseInt(params.get("page")) || 1, 1);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState("relevance");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [result, setResult] = useState({ key: "", products: [], totalPages: 1, error: "" });

  // "loading" is derived: the stored result belongs to an older request key
  const key = `${search}|${category}|${page}`;
  const loading = result.key !== key;

  useEffect(() => {
    let ignore = false;
    getProducts({ search, category, page })
      .then((d) => !ignore && setResult({ key, products: d.products, totalPages: d.totalPages || 1, error: "" }))
      .catch((e) => !ignore && setResult({ key, products: [], totalPages: 1, error: e.message }));
    return () => { ignore = true; };
  }, [key, search, category, page]);

  const updateParams = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    setParams(next);
  };

  const handlePage = (p) => {
    updateParams({ page: p > 1 ? String(p) : "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategory = (value) => updateParams({ category: value, page: "" });
  const handleFilters = (changes) => setFilters((f) => ({ ...f, ...changes }));
  const clearAll = () => {
    setFilters(DEFAULT_FILTERS);
    setSort("relevance");
    updateParams({ category: "", search: "", page: "" });
  };

  // Client-side filtering/sorting of the current page (backend does not support these yet)
  const visible = useMemo(() => {
    let list = result.products.filter((p) => {
      if (filters.inStock && p.stock === 0) return false;
      if (filters.min !== "" && p.price < Number(filters.min)) return false;
      if (filters.max !== "" && p.price > Number(filters.max)) return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "newest") list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }, [result.products, filters, sort]);

  const showcase = !search && !category && page === 1;
  const heading = search
    ? `Results for "${search}"`
    : category ? categoryLabel(category) : "All Products";

  return (
    <div className="container page">
      {showcase && (
        <>
          <Carousel />
          <TrustBar />
          <CategoryTiles />
          <ProductRow title="Best of Electronics" eyebrow="Trending" category="electronics" />
          <PromoBanner />
          <ProductRow title="Fashion Top Picks" eyebrow="Menswear" category="men's clothing" />
          <ProductRow title="Women's Favourites" eyebrow="Womenswear" category="women's clothing" />
          <ProductRow title="Fine Jewellery" eyebrow="Gifting" category="jewelery" />
          <div className="section-head listing-head-title">
            <span className="eyebrow">The full range</span>
            <h2>Explore All Products</h2>
          </div>
        </>
      )}

      <div className="listing">
        <FilterSidebar
          category={category}
          onCategory={handleCategory}
          filters={filters}
          onFilters={handleFilters}
          onClear={clearAll}
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
        />

        <section className="listing-main card" aria-live="polite">
          <div className="listing-head">
            <h1>{heading}</h1>
            <button className="btn btn-ghost btn-sm filter-toggle" onClick={() => setFiltersOpen(true)}>
              <FiFilter /> Filters
            </button>
          </div>

          <div className="sort-bar">
            <span>Sort By</span>
            {SORTS.map((s) => (
              <button key={s.value} className={sort === s.value ? "active" : ""} onClick={() => setSort(s.value)}>
                {s.label}
              </button>
            ))}
          </div>

          {result.error && !loading && <p className="msg-error listing-pad">{result.error}</p>}
          {loading && <SkeletonGrid count={8} />}

          {!loading && !result.error && visible.length === 0 && (
            <div className="empty-state">
              <FiSearch className="empty-icon" />
              <h2>Sorry, no results found!</h2>
              <p>Try changing your search, category or filters.</p>
              <button className="btn" onClick={clearAll}>Clear filters</button>
            </div>
          )}

          {!loading && visible.length > 0 && (
            <div className="product-grid">
              {visible.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          {!loading && <Pagination page={page} totalPages={result.totalPages} onChange={handlePage} />}
        </section>
      </div>
    </div>
  );
}

export default Products;
