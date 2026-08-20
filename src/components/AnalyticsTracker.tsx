import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Fires GA4 and TikTok pixel page-view events on every SPA route change.
 * Both scripts are loaded once in index.html and only auto-fire on the
 * initial hard load, so React Router transitions need an explicit ping.
 */
export function AnalyticsTracker() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const pagePath = pathname + search;

    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: pagePath,
        page_location: window.location.href,
        page_title: document.title,
      });
    }

    if (typeof window.ttq?.page === "function") {
      window.ttq.page();
    }
  }, [pathname, search]);

  return null;
}
