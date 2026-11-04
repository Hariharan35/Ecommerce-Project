const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const formatINR = (value) => inr.format(Number(value) || 0);

// Deterministic 32-bit hash so the same product always gets the same fake values.
const hash = (str = "") => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

// TODO(backend): replace with real `rating`, `reviewCount` and `mrp` fields on the Product model.
export const getRating = (id) => {
  const h = hash(id);
  return {
    value: (3.6 + (h % 14) / 10).toFixed(1), // 3.6 - 4.9
    count: 120 + (h % 9800),
  };
};

export const getPricing = (product) => {
  const h = hash(product._id);
  const discount = 10 + (h % 41); // 10% - 50% off
  const mrp = Math.round(product.price / (1 - discount / 100));
  return { mrp, discount };
};

export const CATEGORIES = [
  { value: "electronics", label: "Electronics" },
  { value: "men's clothing", label: "Men's Fashion" },
  { value: "women's clothing", label: "Women's Fashion" },
  { value: "jewelery", label: "Jewellery" },
];

export const categoryLabel = (value) =>
  CATEGORIES.find((c) => c.value === value)?.label || value;
