import { useNavigate, useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

function SearchBar() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const current = params.get("search") || "";

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = new FormData(e.currentTarget).get("q").trim();
    const next = new URLSearchParams();
    if (text) next.set("search", text);
    navigate(`/home${next.size ? `?${next}` : ""}`);
  };

  // key resets the (uncontrolled) input whenever the URL search changes
  return (
    <form className="searchbar" onSubmit={handleSubmit} role="search" key={current}>
      <input
        name="q"
        defaultValue={current}
        placeholder="Search for products, brands and more"
        aria-label="Search products"
      />
      <button type="submit" aria-label="Search"><FiSearch size={20} /></button>
    </form>
  );
}

export default SearchBar;
