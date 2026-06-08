import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useT } from "@/lib/i18n";
import { useRoutes } from "@/lib/routes";

export function StickyQuote() {
  const t = useT();
  const r = useRoutes();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("kova-sticky-dismissed") === "1") {
      setDismissed(true);
      return;
    }
    const onScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.9;
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 240;
      setVisible(past && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (dismissed) return null;

  return (
    <div
      className={
        "fixed z-[55] bottom-5 left-1/2 -translate-x-1/2 transition-all duration-500 " +
        (visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-6 pointer-events-none")
      }
    >
      <div className="flex items-center gap-1 bg-[var(--color-ink)] text-[var(--color-cream)] rounded-full pl-1.5 pr-1.5 py-1.5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)] border border-white/5">
        {/* Design yours — secondary, outlined with brand sparkle */}
        <Link
          to={r.configurator}
          className="group inline-flex items-center gap-1.5 sm:gap-2 text-[var(--color-cream)] hover:text-[var(--color-clay-light)] bg-white/[0.04] hover:bg-[var(--color-clay)]/15 border border-[var(--color-cream)]/30 hover:border-[var(--color-clay-light)] text-[0.86rem] font-medium rounded-full px-3.5 sm:px-4 py-2 transition-colors whitespace-nowrap"
        >
          <span
            aria-hidden
            className="text-[var(--color-clay-light)] group-hover:rotate-180 transition-transform duration-500 inline-block"
          >
            ✺
          </span>
          {t.sticky.designCta}
        </Link>

        {/* Get a quote — primary, clay filled */}
        <Link
          to={r.contact}
          className="inline-flex items-center gap-1.5 bg-[var(--color-clay)] hover:bg-[var(--color-clay-deep)] text-[var(--color-cream)] text-[0.86rem] font-medium rounded-full px-3.5 sm:px-4 py-2 transition-colors whitespace-nowrap"
        >
          {t.sticky.cta}
          <span aria-hidden>→</span>
        </Link>

        <button
          type="button"
          onClick={() => {
            setDismissed(true);
            sessionStorage.setItem("kova-sticky-dismissed", "1");
          }}
          aria-label={t.sticky.dismiss}
          className="ml-0.5 h-7 w-7 inline-flex items-center justify-center rounded-full text-[var(--color-cream)]/60 hover:text-[var(--color-cream)] hover:bg-white/5 transition-colors text-base shrink-0"
        >
          ×
        </button>
      </div>
    </div>
  );
}
