import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useT } from "@/lib/i18n";
import { useRoutes } from "@/lib/routes";
import { LanguageToggle } from "./LanguageToggle";
import { PROMO_RESIZE_EVENT } from "./PromoBar";

export function Nav() {
  const t = useT();
  const { pathname } = useLocation();
  const r = useRoutes();
  const homePath = r.home;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  /** Brochure menu items, in display order. */
  const menu: Array<{ href: string; label: string }> = [
    { href: r.roller, label: t.products.roller.name },
    { href: r.venetian, label: t.products.venetian.name },
    { href: r.vertisheer, label: "VertiSheer" },
    { href: r.process, label: t.process.eyebrow },
    { href: r.configurator, label: t.configurator.eyebrow },
  ];
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  /**
   * The header is fixed, but the PromoBar sits above it in normal flow. Park
   * the header directly below the bar and let it ride up to the top edge as
   * the bar scrolls away — otherwise the bar (z-60) paints over it at rest.
   * Written straight to the node so scrolling doesn't re-render the tree.
   */
  useEffect(() => {
    let promoH = 0;
    const readPromoH = () => {
      promoH =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--promo-h"),
        ) || 0;
    };
    const place = () => {
      const el = headerRef.current;
      if (el) el.style.top = `${Math.max(0, promoH - window.scrollY)}px`;
    };
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      place();
    };
    const onPromoChange = () => {
      readPromoH();
      place();
    };

    onPromoChange();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onPromoChange);
    window.addEventListener(PROMO_RESIZE_EVENT, onPromoChange);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onPromoChange);
      window.removeEventListener(PROMO_RESIZE_EVENT, onPromoChange);
    };
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

  const journalHref = r.journal;
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
        ref={headerRef}
        style={{ top: "var(--promo-h, 0px)" }}
        className={
          "fixed inset-x-0 z-50 transition-colors duration-500 " +
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
            {menu.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className={
                  "text-[0.875rem] transition-colors whitespace-nowrap " +
                  (isActive(l.href)
                    ? "text-[var(--color-clay)]"
                    : "text-[var(--color-ink-soft)] hover:text-[var(--color-clay)]")
                }
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
              to={r.contact}
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
            {menu.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                onClick={() => setMobileOpen(false)}
                className={
                  "py-3 text-[1.05rem] font-serif border-b border-[var(--color-line-soft)] last:border-b-0 transition-colors " +
                  (isActive(l.href)
                    ? "text-[var(--color-clay-deep)]"
                    : "text-[var(--color-ink)] hover:text-[var(--color-clay-deep)]")
                }
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
              to={r.contact}
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
