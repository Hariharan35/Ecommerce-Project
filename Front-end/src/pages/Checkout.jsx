import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiCheck } from "react-icons/fi";
import { placeOrder } from "../services/api";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import PriceDetails from "../components/PriceDetails";
import { formatINR } from "../utils/format";

const STEPS = ["Login", "Delivery address", "Order summary", "Payment"];

const FIELDS = [
  { name: "fullName", label: "Full name", type: "text", autoComplete: "name" },
  { name: "phone", label: "10-digit mobile number", type: "tel", autoComplete: "tel", inputMode: "numeric" },
  { name: "addressLine", label: "Address (house no, building, street, area)", type: "text", autoComplete: "street-address" },
  { name: "city", label: "City / District / Town", type: "text", autoComplete: "address-level2" },
  { name: "pincode", label: "Pincode", type: "text", autoComplete: "postal-code", inputMode: "numeric" },
];

const validate = (f) => {
  const e = {};
  if (f.fullName.trim().length < 2) e.fullName = "Enter your full name";
  if (!/^\d{10}$/.test(f.phone)) e.phone = "Enter a valid 10-digit mobile number";
  if (f.addressLine.trim().length < 5) e.addressLine = "Enter your complete address";
  if (f.city.trim().length < 2) e.city = "Enter your city";
  if (!/^\d{6}$/.test(f.pincode)) e.pincode = "Enter a valid 6-digit pincode";
  return e;
};

function Checkout() {
  const navigate = useNavigate();
  const { cart, loading: cartLoading, refresh } = useCart();
  const { notify } = useToast();

  const [form, setForm] = useState({ fullName: "", phone: "", addressLine: "", city: "", pincode: "" });
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const errors = validate(form);
  const hasErrors = Object.keys(errors).length > 0;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ fullName: true, phone: true, addressLine: true, city: true, pincode: true });
    if (hasErrors) return;

    setSubmitting(true);
    setError("");
    try {
      await placeOrder(form);
      await refresh();
      notify("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (cartLoading && cart.items.length === 0) {
    return <div className="container page"><div className="spinner" aria-label="Loading" /></div>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="container page card empty-state">
        <h2>Your cart is empty</h2>
        <p>Add something before checking out.</p>
        <Link to="/home" className="btn">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="container page">
      <ol className="stepper card" aria-label="Checkout progress">
        {STEPS.map((label, i) => (
          <li key={label} className={i === 0 ? "done" : i === 1 ? "current" : ""}>
            <span className="step-num">{i === 0 ? <FiCheck /> : i + 1}</span>
            {label}
          </li>
        ))}
      </ol>

      <div className="two-col">
        <div className="checkout-main">
          <form className="card checkout-form" onSubmit={handleSubmit} noValidate>
            <h2 className="section-title blue">Delivery address</h2>
            <div className="form-grid">
              {FIELDS.map((f) => (
                <div className="field" key={f.name}>
                  <label htmlFor={f.name}>{f.label}</label>
                  <input id={f.name} name={f.name} type={f.type} value={form[f.name]}
                    autoComplete={f.autoComplete} inputMode={f.inputMode}
                    onChange={handleChange} onBlur={handleBlur}
                    aria-invalid={touched[f.name] && !!errors[f.name]} />
                  {touched[f.name] && errors[f.name] && <span className="field-error">{errors[f.name]}</span>}
                </div>
              ))}
            </div>

            <h2 className="section-title blue">Payment</h2>
            <label className="pay-option">
              <input type="radio" checked readOnly /> Cash on Delivery
            </label>

            {error && <p className="msg-error">{error}</p>}
            <button className="btn btn-orange" type="submit" disabled={submitting}>
              {submitting ? "Placing order..." : `Place order · ${formatINR(cart.totalAmount)}`}
            </button>
          </form>

          <section className="card summary-card">
            <h2 className="section-title blue">Order summary</h2>
            {cart.items.map((item) => (
              <div className="summary-row" key={item.productId}>
                <img src={item.image} alt={item.name} />
                <div>
                  <p className="summary-name">{item.name}</p>
                  <p className="muted small">Qty: {item.quantity}</p>
                </div>
                <strong>{formatINR(item.subtotal)}</strong>
              </div>
            ))}
          </section>
        </div>

        <PriceDetails items={cart.items} total={cart.totalAmount} />
      </div>
    </div>
  );
}

export default Checkout;
