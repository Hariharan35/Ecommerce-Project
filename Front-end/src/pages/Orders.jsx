import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPackage } from "react-icons/fi";
import { getMyOrders, cancelOrder } from "../services/api";
import { useToast } from "../context/ToastContext";
import ConfirmModal from "../components/ConfirmModal";
import { formatINR } from "../utils/format";

const STATUS = {
  placed: { label: "Order placed", color: "var(--orange)" },
  shipped: { label: "Shipped", color: "var(--blue)" },
  delivered: { label: "Delivered", color: "var(--green)" },
  cancelled: { label: "Cancelled", color: "var(--red)" },
};
const TIMELINE = ["placed", "shipped", "delivered"];

function Timeline({ status }) {
  if (status === "cancelled") return <p className="timeline-cancelled">This order was cancelled</p>;
  const current = TIMELINE.indexOf(status);
  return (
    <ol className="timeline" aria-label="Order progress">
      {TIMELINE.map((s, i) => (
        <li key={s} className={i <= current ? "reached" : ""}>
          <span className="dot" />
          {STATUS[s].label}
        </li>
      ))}
    </ol>
  );
}

function Orders() {
  const { notify } = useToast();
  const [state, setState] = useState({ loading: true, orders: [], error: "" });
  const [toCancel, setToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    getMyOrders()
      .then((d) => setState({ loading: false, orders: d.orders, error: "" }))
      .catch((e) => setState({ loading: false, orders: [], error: e.message }));
  }, []);

  const confirmCancel = async () => {
    setCancelling(true);
    try {
      const data = await cancelOrder(toCancel);
      setState((s) => ({ ...s, orders: s.orders.map((o) => (o._id === toCancel ? data.order : o)) }));
      notify("Order cancelled");
      setToCancel(null);
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setCancelling(false);
    }
  };

  if (state.loading) return <div className="container page"><div className="spinner" aria-label="Loading orders" /></div>;

  return (
    <div className="container page">
      <h1 className="page-title">My Orders</h1>
      {state.error && <p className="msg-error">{state.error}</p>}

      {!state.error && state.orders.length === 0 && (
        <div className="card empty-state">
          <FiPackage className="empty-icon" />
          <h2>No orders yet</h2>
          <p>When you place an order it will show up here.</p>
          <Link to="/home" className="btn">Start shopping</Link>
        </div>
      )}

      {state.orders.map((order) => {
        const st = STATUS[order.status] || STATUS.placed;
        return (
          <article className="card order-card" key={order._id}>
            <header className="order-head">
              <div>
                <strong>Order #{order._id.slice(-6).toUpperCase()}</strong>
                <p className="muted small">Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
              <span className="status" style={{ "--status": st.color }}><i /> {st.label}</span>
            </header>

            {order.items.map((item) => (
              <div className="order-item" key={item.productId}>
                <img src={item.image} alt={item.name} />
                <div className="order-item-info">
                  <Link to={`/product/${item.productId}`}>{item.name}</Link>
                  <p className="muted small">Qty: {item.quantity}</p>
                </div>
                <strong>{formatINR(item.price * item.quantity)}</strong>
              </div>
            ))}

            <Timeline status={order.status} />

            <footer className="order-foot">
              <p className="muted small">
                Ship to: {order.shippingAddress.fullName}, {order.shippingAddress.city} - {order.shippingAddress.pincode}
              </p>
              <div className="order-total">
                Total <strong>{formatINR(order.totalAmount)}</strong>
                {order.status === "placed" && (
                  <button className="btn-text danger" onClick={() => setToCancel(order._id)}>Cancel order</button>
                )}
              </div>
            </footer>
          </article>
        );
      })}

      {toCancel && (
        <ConfirmModal
          title="Cancel this order?"
          message="This action cannot be undone."
          confirmText="Yes, cancel"
          busy={cancelling}
          onConfirm={confirmCancel}
          onCancel={() => setToCancel(null)}
        />
      )}
    </div>
  );
}

export default Orders;
