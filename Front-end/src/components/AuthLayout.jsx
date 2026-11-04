import { FiShoppingBag, FiCheckCircle } from "react-icons/fi";

const PERKS = ["Track every order in real time", "Faster, safer checkout", "Exclusive member offers"];

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="container page">
      <div className="auth-card card">
        <aside className="auth-side">
          <span className="brand brand-light">
            <span className="brand-mark"><FiShoppingBag size={18} /></span>
            <span className="brand-name">MyShop</span>
          </span>
          <h2>{title}</h2>
          <p>{subtitle}</p>
          <ul className="auth-perks">
            {PERKS.map((perk) => (
              <li key={perk}><FiCheckCircle aria-hidden="true" /> {perk}</li>
            ))}
          </ul>
          <FiShoppingBag className="auth-illustration" aria-hidden="true" />
        </aside>
        <div className="auth-form">{children}</div>
      </div>
    </div>
  );
}

export default AuthLayout;
