import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiMenu, FiX, FiChevronDown, FiPackage, FiLogOut, FiShoppingBag } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import SearchBar from "./SearchBar";

function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [drawer, setDrawer] = useState(false);

  const handleLogout = () => {
    logout();
    setDrawer(false);
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <button className="icon-btn menu-btn" onClick={() => setDrawer(true)} aria-label="Open menu">
          <FiMenu size={24} />
        </button>

        <Link to="/home" className="brand" aria-label="MyShop home">
          <span className="brand-mark"><FiShoppingBag size={18} /></span>
          <span className="brand-name">MyShop</span>
        </Link>

        <div className="navbar-search"><SearchBar /></div>

        <nav className="nav-actions" aria-label="Main">
          {user ? (
            <div className="user-menu">
              <button className="user-trigger" aria-haspopup="true">
                Hi, {user.name?.split(" ")[0]} <FiChevronDown />
              </button>
              <div className="user-dropdown">
                <Link to="/orders"><FiPackage /> My Orders</Link>
                <button onClick={handleLogout}><FiLogOut /> Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="login-btn">Login</Link>
          )}

          <Link to="/cart" className="cart-link" aria-label={`Cart, ${count} items`}>
            <FiShoppingCart size={20} />
            <span className="cart-text">Cart</span>
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>
        </nav>
      </div>

      {/* Mobile drawer */}
      {drawer && <div className="overlay" onClick={() => setDrawer(false)} />}
      <aside className={`drawer ${drawer ? "open" : ""}`} aria-hidden={!drawer}>
        <div className="drawer-head">
          <strong>{user ? `Hi, ${user.name}` : "Welcome to MyShop"}</strong>
          <button className="icon-btn" onClick={() => setDrawer(false)} aria-label="Close menu">
            <FiX size={22} />
          </button>
        </div>
        <NavLink to="/home" onClick={() => setDrawer(false)}>Home</NavLink>
        {user ? (
          <>
            <NavLink to="/cart" onClick={() => setDrawer(false)}>My Cart</NavLink>
            <NavLink to="/orders" onClick={() => setDrawer(false)}>My Orders</NavLink>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" onClick={() => setDrawer(false)}>Login</NavLink>
            <NavLink to="/signup" onClick={() => setDrawer(false)}>Sign up</NavLink>
          </>
        )}
      </aside>

      <div className="navbar-search-mobile container"><SearchBar /></div>
    </header>
  );
}

export default Navbar;
