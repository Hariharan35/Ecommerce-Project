import { FiX } from "react-icons/fi";
import { CATEGORIES } from "../utils/format";

function FilterSidebar({ category, onCategory, filters, onFilters, onClear, open, onClose }) {
  return (
    <>
      {open && <div className="overlay filter-overlay" onClick={onClose} />}
      <aside className={`filters card ${open ? "open" : ""}`} aria-label="Filters">
        <div className="filters-head">
          <h3>Filters</h3>
          <button className="btn-text" onClick={onClear}>Clear all</button>
          <button className="icon-btn filters-close" onClick={onClose} aria-label="Close filters"><FiX size={20} /></button>
        </div>

        <fieldset className="filter-group">
          <legend>Category</legend>
          <label><input type="radio" name="cat" checked={category === ""} onChange={() => onCategory("")} /> All</label>
          {CATEGORIES.map((c) => (
            <label key={c.value}>
              <input type="radio" name="cat" checked={category === c.value} onChange={() => onCategory(c.value)} />
              {c.label}
            </label>
          ))}
        </fieldset>

        <fieldset className="filter-group">
          <legend>Price (₹)</legend>
          <div className="price-inputs">
            <input type="number" min="0" placeholder="Min" value={filters.min} aria-label="Minimum price"
              onChange={(e) => onFilters({ min: e.target.value })} />
            <span>to</span>
            <input type="number" min="0" placeholder="Max" value={filters.max} aria-label="Maximum price"
              onChange={(e) => onFilters({ max: e.target.value })} />
          </div>
        </fieldset>

        <fieldset className="filter-group">
          <legend>Availability</legend>
          <label>
            <input type="checkbox" checked={filters.inStock} onChange={(e) => onFilters({ inStock: e.target.checked })} />
            Exclude out of stock
          </label>
        </fieldset>
      </aside>
    </>
  );
}

export default FilterSidebar;
