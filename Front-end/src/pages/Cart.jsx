import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { formatINR, getPricing } from "../utils/format";
import PriceDetails from "../components/PriceDetails";

function Cart() {
  const navigate = useNavigate();
  const { cart, loading, setQuantity, remove } = useCart();
  const { notify } = useToast();
  const [busyId, setBusyId] = useState("");

  const run = async (id, action) => {
    setBusyId(id);
    try {
      await action();
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setBusyId("");
    }
  };

  if (loading && cart.items.length === 0) {
    return <div className="container page"><div className="spinner" aria-label="Loading cart" /></div>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="container page">
        <div className="card empty-state">
          <FiShoppingCart className="empty-icon" />
          <h2>Your cart is empty!</h2>
          <p>Add items to it now.</p>
          <Link to="/home" className="btn">Shop now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <div className="two-col">
        <section className="card cart-list" aria-label="Cart items">
          <h1 className="section-title">My Cart ({cart.items.length})</h1>

          {cart.items.map((item) => {
            const { mrp, discount } = getPricing({ _id: item.productId, price: item.price });
            const busy = busyId === item.productId;
            return (
              <article className="cart-item" key={item.productId}>
                <div className="cart-item-top">
                  <Link to={`/product/${item.productId}`} className="cart-img">
                    <img src={item.image} alt={item.name} />
                  </Link>
                  <div className="cart-info">
                    <Link to={`/product/${item.productId}`} className="cart-name">{item.name}</Link>
                    <div className="price-row">
                      <span className="mrp">{formatINR(mrp)}</span>
                      <span className="price">{formatINR(item.price)}</span>
                      <span className="off">{discount}% off</span>
                    </div>
                    <p className="muted small">Delivery in 3-5 days | <span className="green">Free</span></p>
                  </div>
                </div>

                <div className="cart-actions">
                  <div className="qty" role="group" aria-label={`Quantity for ${item.name}`}>
                    <button disabled={busy || item.quantity <= 1} aria-label="Decrease quantity"
                      onClick={() => run(item.productId, () => setQuantity(item.productId, item.quantity - 1))}>−</button>
                    <span>{item.quantity}</span>
                    <button disabled={busy || item.quantity >= item.stock} aria-label="Increase quantity"
                      onClick={() => run(item.productId, () => setQuantity(item.productId, item.quantity + 1))}>+</button>
                  </div>
                  <button className="btn-text" onClick={() => notify("Save for later is coming soon")}>Save for later</button>
                  <button className="btn-text" disabled={busy}
                    onClick={() => run(item.productId, () => remove(item.productId))}>Remove</button>
                </div>
              </article>
            );
          })}

          <div className="place-order-bar">
            <button className="btn btn-orange" onClick={() => navigate("/checkout")}>Place order</button>
          </div>
        </section>

        <PriceDetails items={cart.items} total={cart.totalAmount} />
      </div>

      <div className="mobile-order-bar">
        <div>
          <span className="mrp">{formatINR(cart.items.reduce((s, i) => s + getPricing({ _id: i.productId, price: i.price }).mrp * i.quantity, 0))}</span>
          <strong>{formatINR(cart.totalAmount)}</strong>
        </div>
        <button className="btn btn-orange" onClick={() => navigate("/checkout")}>Place order</button>
      </div>
    </div>
  );
}

export default Cart;
