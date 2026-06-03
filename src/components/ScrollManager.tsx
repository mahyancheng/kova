import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Restores expected scroll behaviour across SPA route changes:
 *  - hash navigation (e.g. `/#contact`) scrolls smoothly to the target
 *    after the new route mounts;
 *  - plain pathname changes scroll the window to the top so each page
 *    starts at the masthead instead of inheriting the previous scroll.
 *
 * React Router 7 does not handle either of these out of the box.
 */
export function ScrollManager() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      // Wait one frame so the destination element exists in the DOM
      // (the new route just mounted) before scrolling.
      const raf = requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return () => cancelAnimationFrame(raf);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [hash, pathname]);

  return null;
}
