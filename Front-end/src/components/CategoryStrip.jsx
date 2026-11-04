import { Link, useSearchParams } from "react-router-dom";
import { FiGrid, FiSmartphone, FiUser, FiUsers, FiAward } from "react-icons/fi";
import { CATEGORIES } from "../utils/format";

const ICONS = {
  electronics: FiSmartphone,
  "men's clothing": FiUser,
  "women's clothing": FiUsers,
  jewelery: FiAward,
};

function CategoryStrip() {
  const [params] = useSearchParams();
  const active = params.get("category") || "";

  const items = [{ value: "", label: "All" }, ...CATEGORIES];

  return (
    <div className="category-strip">
      <ul className="container category-list">
        {items.map((c) => {
          const Icon = ICONS[c.value] || FiGrid;
          const to = c.value ? `/home?category=${encodeURIComponent(c.value)}` : "/home";
          return (
            <li key={c.label}>
              <Link to={to} className={`category-item ${active === c.value ? "active" : ""}`}>
                <span className="category-icon"><Icon size={26} /></span>
                <span>{c.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default CategoryStrip;
