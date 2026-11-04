import { FiTruck, FiShield, FiRefreshCw, FiHeadphones } from "react-icons/fi";

const ITEMS = [
  { icon: FiTruck, title: "Free Delivery", text: "On every order, nationwide" },
  { icon: FiShield, title: "Secure Payments", text: "Your data is always protected" },
  { icon: FiRefreshCw, title: "Easy Returns", text: "Hassle-free 7 day returns" },
  { icon: FiHeadphones, title: "Priority Support", text: "We are here to help, daily" },
];

function TrustBar() {
  return (
    <section className="trustbar" aria-label="Our promise">
      {ITEMS.map(({ icon: Icon, title, text }) => (
        <div className="trust-item" key={title}>
          <span className="trust-icon"><Icon size={22} /></span>
          <div>
            <strong>{title}</strong>
            <p>{text}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

export default TrustBar;
