import { FiStar } from "react-icons/fi";
import { getRating } from "../utils/format";

function Rating({ productId, showCount = true }) {
  const { value, count } = getRating(productId);
  return (
    <span className="rating-wrap">
      <span className="rating-pill" aria-label={`Rated ${value} out of 5`}>
        {value} <FiStar size={11} fill="currentColor" />
      </span>
      {showCount && <span className="rating-count">({count.toLocaleString("en-IN")})</span>}
    </span>
  );
}

export default Rating;
