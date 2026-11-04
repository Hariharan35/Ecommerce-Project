import { Link } from "react-router-dom";
import { FiArrowRight, FiSmartphone, FiUser, FiUsers, FiAward } from "react-icons/fi";

const TILES = [
  { value: "electronics", label: "Electronics", note: "Gadgets & gear", icon: FiSmartphone, tone: "tile-a" },
  { value: "men's clothing", label: "Men's Fashion", note: "Sharp, everyday style", icon: FiUser, tone: "tile-b" },
  { value: "women's clothing", label: "Women's Fashion", note: "New season edits", icon: FiUsers, tone: "tile-c" },
  { value: "jewelery", label: "Jewellery", note: "Timeless pieces", icon: FiAward, tone: "tile-d" },
];

function CategoryTiles() {
  return (
    <section className="home-section" aria-labelledby="shop-by-cat">
      <div className="section-head">
        <span className="eyebrow">Collections</span>
        <h2 id="shop-by-cat">Shop by Category</h2>
      </div>
      <div className="tile-grid">
        {TILES.map(({ value, label, note, icon: Icon, tone }) => (
          <Link key={value} to={`/home?category=${encodeURIComponent(value)}`} className={`tile ${tone}`}>
            <Icon className="tile-icon" size={90} aria-hidden="true" />
            <div className="tile-text">
              <h3>{label}</h3>
              <p>{note}</p>
              <span className="tile-cta">Explore <FiArrowRight /></span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CategoryTiles;
