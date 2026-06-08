import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useT } from "@/lib/i18n";
import { LanguageToggle } from "./LanguageToggle";

export function Nav() {
  const t = useT();
  const { pathname } = useLocation();
  // Both / and /bidai render <Home/>, so they're both "on home" for
  // anchor purposes — section IDs exist on the current page.
  const onHome = pathname === "/" || pathname.startsWith("/bidai");
  const homePath = pathname.startsWith("/bidai") ? "/bidai" : "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  /**
   * On a home route (/ or /bidai), hash links (#contact) scroll natively
   * within the current page. Elsewhere, route to the language-matched
   * home with the hash, and let ScrollManager scroll once Home mounts.
   */
  const hashHref = (hash: string) => (onHome ? hash : `${homePath}${hash}`);
  const journalHref = pathname.startsWith("/bidai") ? "/bidai/jurnal" : "/blog";
  const onJournalRoute =
    pathname.startsWith("/blog") || pathname.startsWith("/bidai/jurnal");

  return (
    <>
      {/* Visually hidden until keyboard focus — lets screen-reader and
          keyboard users jump past the nav directly to the page content. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-[var(--color-ink)] focus:text-[var(--color-cream)] focus:px-4 focus:py-2 focus:rounded-full focus:text-[0.85rem] focus:outline-2 focus:outline-[var(--color-clay)]"
      >
        Skip to content
      </a>
      <header
        className={
          "fixed top-0 inset-x-0 z-50 transition-all duration-500 " +
          (scrolled || mobileOpen
            ? "bg-[var(--color-cream)]/95 backdrop-blur-md border-b border-[var(--color-line-soft)]"
            : "bg-transparent border-b border-transparent")
        }
      >
        <div className="max-w-[1240px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
          <Link
            to={homePath}
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5 group shrink-0"
          >
            <span className="inline-block h-7 w-7">
              <svg viewBox="0 0 32 32" className="h-full w-full">
                <rect
                  x="6"
                  y="5"
                  width="20"
                  height="22"
                  rx="1"
                  fill="none"
                  stroke="#1A1714"
                  strokeWidth="1.5"
                />
                <line x1="6" y1="11" x2="26" y2="11" stroke="#8B5A3C" strokeWidth="1.4" />
                <line x1="6" y1="16" x2="26" y2="16" stroke="#8B5A3C" strokeWidth="1.4" />
                <line x1="6" y1="21" x2="26" y2="21" stroke="#8B5A3C" strokeWidth="1.4" />
              </svg>
            </span>
            <span className="font-serif text-[1.05rem] tracking-tight text-[var(--color-ink)]">
              Kova<span className="text-[var(--color-clay)]">·</span>Sun Shade
            </span>
          </Link>

          {/* --- Desktop nav (lg+) --- */}
          <nav className="hidden lg:flex items-center gap-7 ml-auto mr-6">
            {t.nav.links.map((l) => (
              <Link
                key={l.href}
                to={hashHref(l.href)}
                className="text-[0.875rem] text-[var(--color-ink-soft)] hover:text-[var(--color-clay)] transition-colors whitespace-nowrap"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to={journalHref}
              className={
                "text-[0.875rem] transition-colors whitespace-nowrap " +
                (onJournalRoute
                  ? "text-[var(--color-clay)]"
                  : "text-[var(--color-ink-soft)] hover:text-[var(--color-clay)]")
              }
            >
              {t.nav.journal}
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <LanguageToggle />
            <Link
              to={hashHref("#contact")}
              className="hidden md:inline-flex items-center gap-1.5 text-[0.875rem] font-medium px-4 py-2 rounded-full border border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition-colors whitespace-nowrap"
            >
              {t.nav.quote}
              <span aria-hidden>→</span>
            </Link>

            {/* --- Mobile hamburger (< lg) --- */}
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center h-10 w-10 -mr-2 rounded-full hover:bg-[var(--color-ink)]/5 transition-colors text-[var(--color-ink)]"
            >
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                aria-hidden
              >
                {mobileOpen ? (
                  <>
                    <line x1="5" y1="5" x2="19" y2="19" />
                    <line x1="19" y1="5" x2="5" y2="19" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="17" x2="20" y2="17" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* --- Mobile drawer (< lg) --- */}
        <div
          id="mobile-menu"
          className={
            "lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out " +
            (mobileOpen ? "max-h-[100vh] opacity-100" : "max-h-0 opacity-0")
          }
        >
          <nav className="px-6 sm:px-8 py-5 flex flex-col gap-1 border-t border-[var(--color-line-soft)] bg-[var(--color-cream)]/98 backdrop-blur-md">
            {t.nav.links.map((l) => (
              <Link
                key={l.href}
                to={hashHref(l.href)}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-[1.05rem] font-serif text-[var(--color-ink)] border-b border-[var(--color-line-soft)] last:border-b-0 hover:text-[var(--color-clay-deep)] transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to={journalHref}
              onClick={() => setMobileOpen(false)}
              className={
                "py-3 text-[1.05rem] font-serif border-b border-[var(--color-line-soft)] transition-colors " +
                (onJournalRoute
                  ? "text-[var(--color-clay-deep)]"
                  : "text-[var(--color-ink)] hover:text-[var(--color-clay-deep)]")
              }
            >
              {t.nav.journal}
            </Link>

            <Link
              to={hashHref("#contact")}
              onClick={() => setMobileOpen(false)}
              className="mt-4 inline-flex items-center justify-center gap-1.5 text-[0.95rem] font-medium px-5 py-3 rounded-full bg-[var(--color-ink)] text-[var(--color-cream)] hover:bg-[var(--color-clay-deep)] transition-colors"
            >
              {t.nav.quote}
              <span aria-hidden>→</span>
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
