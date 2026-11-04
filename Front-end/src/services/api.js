const BASE_URL = "http://localhost:2000/api";

// One helper for every API call. auth:true adds the login token automatically.
async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = localStorage.getItem("token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    // response had no JSON body
  }

  if (!response.ok) {
    // token missing or expired on a protected call: force a fresh login
    if (response.status === 401 && auth) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    throw new Error(data.error || data.message || "Something went wrong");
  }

  return data;
}

// ---------- AUTH ----------
export const loginUser = (userData) =>
  request("/auth/login", { method: "POST", body: userData });

export const signupUser = (userData) =>
  request("/auth/signup", { method: "POST", body: userData });

export const forgotPassword = (email) =>
  request("/auth/forgot-password", { method: "POST", body: { email } });

export const resetPassword = (data) =>
  request("/auth/reset-password", { method: "POST", body: data });

// ---------- PRODUCTS ----------
export const getProducts = ({ search = "", category = "", page = 1, limit } = {}) => {
  const params = new URLSearchParams({ page });
  if (limit) params.set("limit", limit);
  if (search) params.set("search", search);
  if (category) params.set("category", category);
  return request(`/products?${params}`);
};

// NEW: single product for the details page
export const getProductById = (id) => request(`/products/${id}`);

// ---------- CART ----------
export const getCart = () => request("/cart", { auth: true });

export const addToCart = (productId, quantity = 1) =>
  request("/cart", { method: "POST", body: { productId, quantity }, auth: true });

export const updateCartItem = (productId, quantity) =>
  request(`/cart/${productId}`, { method: "PATCH", body: { quantity }, auth: true });

export const removeCartItem = (productId) =>
  request(`/cart/${productId}`, { method: "DELETE", auth: true });

// ---------- ORDERS ----------
export const placeOrder = (shippingAddress) =>
  request("/orders", { method: "POST", body: { shippingAddress }, auth: true });

export const getMyOrders = () => request("/orders", { auth: true });

export const cancelOrder = (id) =>
  request(`/orders/${id}/cancel`, { method: "PATCH", auth: true });