import { Link } from "react-router-dom";

function PromoBanner() {
  return (
    <section className="promo" aria-label="Special offer">
      <div>
        <span className="eyebrow light">Limited time</span>
        <h2>The Season Sale is Live</h2>
        <p>Save up to 50% on selected electronics, fashion and fine jewellery.</p>
      </div>
      <Link to="/home?category=electronics" className="btn btn-orange">Shop the sale</Link>
    </section>
  );
}

export default PromoBanner;
