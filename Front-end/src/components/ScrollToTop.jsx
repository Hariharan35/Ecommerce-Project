import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Jump to the top whenever the route path changes (not for query-string changes)
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;