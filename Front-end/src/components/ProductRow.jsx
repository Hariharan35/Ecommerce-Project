import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getProducts } from "../services/api";
import ProductCard from "./ProductCard";
import { ProductCardSkeleton } from "./Skeleton";

function ProductRow({ title, eyebrow, category }) {
  const trackRef = useRef(null);
  const [state, setState] = useState({ loaded: false, products: [] });

  useEffect(() => {
    let ignore = false;
    getProducts({ category, limit: 10 })
      .then((d) => !ignore && setState({ loaded: true, products: d.products }))
      .catch(() => !ignore && setState({ loaded: true, products: [] }));
    return () => { ignore = true; };
  }, [category]);

  const scroll = (dir) =>
    trackRef.current?.scrollBy({ left: dir * trackRef.current.clientWidth * 0.8, behavior: "smooth" });

  if (state.loaded && state.products.length === 0) return null;

  return (
    <section className="card row-section" aria-label={title}>
      <div className="row-head">
        <div>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h2>{title}</h2>
        </div>
        <Link to={`/home?category=${encodeURIComponent(category)}`} className="btn btn-ghost btn-sm">View all</Link>
      </div>
      <div className="row-body">
        <button className="row-arrow left" onClick={() => scroll(-1)} aria-label="Scroll left"><FiChevronLeft size={22} /></button>
        <div className="row-track" ref={trackRef}>
          {state.loaded
            ? state.products.map((p) => <ProductCard key={p._id} product={p} />)
            : Array.from({ length: 5 }, (_, i) => <ProductCardSkeleton key={i} />)}
        </div>
        <button className="row-arrow right" onClick={() => scroll(1)} aria-label="Scroll right"><FiChevronRight size={22} /></button>
      </div>
    </section>
  );
}

export default ProductRow;
