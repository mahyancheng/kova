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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /**
   * On a home route (/ or /bidai), hash links (#contact) scroll natively
   * within the current page. Elsewhere, route to the language-matched
   * home with the hash, and let ScrollManager scroll once Home mounts.
   */
  const hashHref = (hash: string) => (onHome ? hash : `${homePath}${hash}`);

  return (
    <header
      className={
        "fixed top-0 inset-x-0 z-50 transition-all duration-500 " +
        (scrolled
          ? "bg-[var(--color-cream)]/85 backdrop-blur-md border-b border-[var(--color-line-soft)]"
          : "bg-transparent border-b border-transparent")
      }
    >
      <div className="max-w-[1240px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
        <Link to={homePath} className="flex items-center gap-2.5 group shrink-0">
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
            to="/blog"
            className={
              "text-[0.875rem] transition-colors whitespace-nowrap " +
              (pathname.startsWith("/blog")
                ? "text-[var(--color-clay)]"
                : "text-[var(--color-ink-soft)] hover:text-[var(--color-clay)]")
            }
          >
            {t.nav.journal}
          </Link>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <LanguageToggle />
          <Link
            to={hashHref("#contact")}
            className="hidden md:inline-flex items-center gap-1.5 text-[0.875rem] font-medium px-4 py-2 rounded-full border border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition-colors whitespace-nowrap"
          >
            {t.nav.quote}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
