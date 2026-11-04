import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiShoppingCart, FiZap, FiTag, FiTruck } from "react-icons/fi";
import { getProductById } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { categoryLabel, formatINR, getPricing } from "../utils/format";
import Rating from "../components/Rating";

const OFFERS = [
  "Bank Offer: 10% instant discount on selected cards",
  "Special Price: Get extra 5% off (price inclusive of discount)",
  "Partner Offer: Sign up for MyShop Pay Later and get a welcome reward",
];

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { add } = useCart();
  const { notify } = useToast();

  const [state, setState] = useState({ id: "", product: null, error: "" });
  const [pincode, setPincode] = useState("");
  const [delivery, setDelivery] = useState("");
  const [busy, setBusy] = useState(false);

  const loading = state.id !== id;

  useEffect(() => {
    let ignore = false;
    getProductById(id)
      .then((p) => !ignore && setState({ id, product: p, error: "" }))
      .catch((e) => !ignore && setState({ id, product: null, error: e.message }));
    return () => { ignore = true; };
  }, [id]);

  const requireLogin = () => {
    navigate("/login", { state: { from: `/product/${id}` } });
  };

  const handleAdd = async (goToCheckout = false) => {
    if (!user) return requireLogin();
    setBusy(true);
    try {
      await add(id, 1);
      if (goToCheckout) navigate("/checkout");
      else notify("Item added to your cart");
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  const checkPincode = (e) => {
    e.preventDefault();
    setDelivery(/^\d{6}$/.test(pincode) ? `Delivery by ${deliveryDate()} | Free` : "Enter a valid 6-digit pincode");
  };

  if (loading) return <div className="container page"><div className="spinner" aria-label="Loading" /></div>;

  if (state.error || !state.product) {
    return (
      <div className="container page card empty-state">
        <h2>Product not found</h2>
        <p>{state.error || "This product is no longer available."}</p>
        <Link to="/home" className="btn">Continue shopping</Link>
      </div>
    );
  }

  const p = state.product;
  const { mrp, discount } = getPricing(p);
  const soldOut = p.stock === 0;
  const highlights = (p.description || "").split(/(?<=[.!?])\s+/).filter(Boolean).slice(0, 4);

  return (
    <div className="container page">
      <nav className="breadcrumb card" aria-label="Breadcrumb">
        <Link to="/home">Home</Link> <span>›</span>
        <Link to={`/home?category=${encodeURIComponent(p.category)}`}>{categoryLabel(p.category)}</Link> <span>›</span>
        <span className="crumb-current">{p.name}</span>
      </nav>

      <div className="details card">
        <div className="details-media">
          <div className="thumbs">
            {[0, 1, 2].map((i) => (
              <img key={i} src={p.image} alt={`${p.name} view ${i + 1}`} className={i === 0 ? "active" : ""} />
            ))}
          </div>
          <div className="details-main-img">
            <img src={p.image} alt={p.name} />
          </div>
          <div className="details-cta">
            <button className="btn btn-yellow" disabled={soldOut || busy} onClick={() => handleAdd(false)}>
              <FiShoppingCart /> Add to cart
            </button>
            <button className="btn btn-orange" disabled={soldOut || busy} onClick={() => handleAdd(true)}>
              <FiZap /> Buy now
            </button>
          </div>
        </div>

        <div className="details-info">
          <h1>{p.name}</h1>
          <Rating productId={p._id} />

          <div className="price-block">
            <span className="price-lg">{formatINR(p.price)}</span>
            <span className="mrp">{formatINR(mrp)}</span>
            <span className="off">{discount}% off</span>
          </div>
          <p className={soldOut ? "stock out" : "stock in"}>
            {soldOut ? "Currently out of stock" : p.stock <= 5 ? `Hurry, only ${p.stock} left!` : "In stock"}
          </p>

          <section className="info-block">
            <h3>Available offers</h3>
            <ul>{OFFERS.map((o) => <li key={o}><FiTag className="green" /> {o}</li>)}</ul>
          </section>

          <section className="info-block">
            <h3>Delivery</h3>
            <form className="pincode" onSubmit={checkPincode}>
              <FiTruck />
              <input value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter delivery pincode" aria-label="Delivery pincode" inputMode="numeric" />
              <button className="btn-text" type="submit">Check</button>
            </form>
            {delivery && <p className={delivery.startsWith("Delivery") ? "msg-success" : "msg-error"}>{delivery}</p>}
          </section>

          {highlights.length > 0 && (
            <section className="info-block">
              <h3>Highlights</h3>
              <ul className="bullets">{highlights.map((h) => <li key={h}>{h}</li>)}</ul>
            </section>
          )}

          <section className="info-block">
            <h3>Description</h3>
            <p className="muted">{p.description || "No description available."}</p>
          </section>
        </div>
      </div>
    </div>
  );
}

function deliveryDate() {
  const d = new Date();
  d.setDate(d.getDate() + 4);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export default ProductDetails;
