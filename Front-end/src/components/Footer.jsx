import { Link } from "react-router-dom";
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiShoppingBag, FiMail } from "react-icons/fi";
import { useToast } from "../context/ToastContext";

const COLUMNS = [
  { title: "Company", links: ["About Us", "Careers", "Press", "Contact Us"] },
  { title: "Customer Care", links: ["Payments", "Shipping", "Cancellation & Returns", "FAQ"] },
  { title: "Legal", links: ["Return Policy", "Terms of Use", "Security", "Privacy"] },
];

function Footer() {
  const { notify } = useToast();

  const subscribe = (e) => {
    e.preventDefault();
    e.currentTarget.reset();
    notify("Thanks for subscribing!");
  };

  return (
    <footer className="footer">
      <div className="container footer-news">
        <div>
          <h3>Join the MyShop Circle</h3>
          <p>Early access to new arrivals and members-only offers.</p>
        </div>
        <form className="news-form" onSubmit={subscribe}>
          <FiMail aria-hidden="true" />
          <input type="email" required placeholder="Your email address" aria-label="Email address" />
          <button type="submit" className="btn btn-orange btn-sm">Subscribe</button>
        </form>
      </div>

      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/home" className="brand brand-light" aria-label="MyShop home">
            <span className="brand-mark"><FiShoppingBag size={18} /></span>
            <span className="brand-name">MyShop</span>
          </Link>
          <p>Curated electronics, fashion and jewellery. Thoughtfully selected, carefully delivered.</p>
          <div className="social">
            <a href="#top" aria-label="Facebook"><FiFacebook /></a>
            <a href="#top" aria-label="Twitter"><FiTwitter /></a>
            <a href="#top" aria-label="Instagram"><FiInstagram /></a>
            <a href="#top" aria-label="YouTube"><FiYoutube /></a>
          </div>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4>{col.title}</h4>
            <ul>
              {col.links.map((l) => (
                <li key={l}><Link to="/home">{l}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} MyShop. All rights reserved.</span>
        <span className="pay-chips" aria-label="Accepted payments"><i>VISA</i><i>UPI</i><i>COD</i><i>RuPay</i></span>
      </div>
    </footer>
  );
}

export default Footer;
