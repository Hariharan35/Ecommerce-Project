import { createContext, useContext, useState } from "react";

const WishlistContext = createContext(null);
const KEY = "wishlist";

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
};

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(read);

  const toggle = (id) => {
    setIds((current) => {
      const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <WishlistContext.Provider value={{ has: (id) => ids.includes(id), toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => useContext(WishlistContext);
