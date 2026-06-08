import { useLocation } from "react-router-dom";

/**
 * Brochure-aware route resolver.
 *
 * Returns the language-matched URL for every page in the site. Components
 * that used to point at `#anchor` IDs on the single-page home now call
 * `useRoutes()` and get `/contact` or `/bidai/hubungi` based on whichever
 * language the visitor is currently on — no per-component conditionals.
 */
export function useRoutes() {
  const { pathname } = useLocation();
  const ms = pathname.startsWith("/bidai");
  return {
    home: ms ? "/bidai" : "/",
    roller: ms ? "/bidai/roller" : "/roller",
    venetian: ms ? "/bidai/venetian" : "/venetian",
    vertisheer: ms ? "/bidai/vertisheer" : "/vertisheer",
    process: ms ? "/bidai/proses" : "/process",
    configurator: ms ? "/bidai/reka" : "/configurator",
    contact: ms ? "/bidai/hubungi" : "/contact",
    journal: ms ? "/bidai/jurnal" : "/blog",
  } as const;
}

/** Map a logical anchor-id ("contact", "configurator", …) to its page URL. */
export function useAnchorMap() {
  const r = useRoutes();
  return {
    contact: r.contact,
    configurator: r.configurator,
    collection: r.home,            // Collection lives on the home page
    "factory-direct": r.process,    // Factory-direct narrative moved to /process
    process: r.process,
    roller: r.roller,
    venetian: r.venetian,
    vertisheer: r.vertisheer,
  } as const;
}
