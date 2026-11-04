import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getCart, addToCart, updateCartItem, removeCartItem } from "../services/api";

const CartContext = createContext(null);
const EMPTY = { items: [], totalAmount: 0 };

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [data, setData] = useState({ forUser: null, cart: EMPTY });

  // Re-fetch the cart from the API (used after add / order placement)
  const refresh = useCallback(async () => {
    try {
      setData({ forUser: user, cart: await getCart() });
    } catch {
      setData({ forUser: user, cart: EMPTY });
    }
  }, [user]);

  // Load the cart whenever the logged-in user changes
  useEffect(() => {
    if (!user) return;
    let ignore = false;
    getCart()
      .then((cart) => !ignore && setData({ forUser: user, cart }))
      .catch(() => !ignore && setData({ forUser: user, cart: EMPTY }));
    return () => { ignore = true; };
  }, [user]);

  // Logged out, or data belongs to a previous user: show an empty cart
  const cart = user && data.forUser === user ? data.cart : EMPTY;
  const loading = Boolean(user) && data.forUser !== user;

  const add = async (productId, quantity = 1) => {
    await addToCart(productId, quantity);
    await refresh();
  };
  const setQuantity = async (productId, quantity) =>
    setData({ forUser: user, cart: await updateCartItem(productId, quantity) });
  const remove = async (productId) =>
    setData({ forUser: user, cart: await removeCartItem(productId) });

  const count = cart.items.reduce((n, item) => n + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, count, loading, refresh, add, setQuantity, remove }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
