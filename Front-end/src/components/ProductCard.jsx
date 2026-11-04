import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { useWishlist } from "../context/WishlistContext";
import { categoryLabel, formatINR, getPricing } from "../utils/format";
import Rating from "./Rating";

function ProductCard({ product }) {
  const { has, toggle } = useWishlist();
  const { mrp, discount } = getPricing(product);
  const wished = has(product._id);
  const soldOut = product.stock === 0;

  return (
    <article className="product-card">
      <button
        className={`wish-btn ${wished ? "active" : ""}`}
        onClick={() => toggle(product._id)}
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={wished}
      >
        <FiHeart size={18} fill={wished ? "currentColor" : "none"} />
      </button>

      <Link to={`/product/${product._id}`} className="product-link">
        <div className="product-img">
          <img src={product.image} alt={product.name} loading="lazy" />
          {!soldOut && <span className="badge-off">-{discount}%</span>}
          {soldOut && <span className="sold-out">Out of stock</span>}
        </div>
        <p className="product-cat">{categoryLabel(product.category)}</p>
        <h3 className="product-name" title={product.name}>{product.name}</h3>
        <Rating productId={product._id} />
        <div className="price-row">
          <span className="price">{formatINR(product.price)}</span>
          <span className="mrp">{formatINR(mrp)}</span>
          <span className="off">{discount}% off</span>
        </div>
        {!soldOut && product.stock <= 5 && <p className="few-left">Only few left!</p>}
      </Link>
    </article>
  );
}

export default ProductCard;
