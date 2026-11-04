import { formatINR, getPricing } from "../utils/format";

function PriceDetails({ items, total }) {
  const count = items.reduce((n, i) => n + i.quantity, 0);
  const mrpTotal = items.reduce(
    (sum, i) => sum + getPricing({ _id: i.productId, price: i.price }).mrp * i.quantity,
    0
  );
  const discount = Math.max(mrpTotal - total, 0);

  return (
    <aside className="price-details card" aria-label="Price details">
      <h3>Price details</h3>
      <dl>
        <div><dt>Price ({count} {count === 1 ? "item" : "items"})</dt><dd>{formatINR(mrpTotal)}</dd></div>
        <div><dt>Discount</dt><dd className="green">− {formatINR(discount)}</dd></div>
        <div><dt>Delivery Charges</dt><dd className="green">FREE</dd></div>
        <div className="total"><dt>Total Amount</dt><dd>{formatINR(total)}</dd></div>
      </dl>
      <p className="savings">You will save {formatINR(discount)} on this order</p>
    </aside>
  );
}

export default PriceDetails;
