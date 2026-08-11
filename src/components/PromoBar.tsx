import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useT } from "@/lib/i18n";
import { useRoutes } from "@/lib/routes";

/** Fired whenever the bar's height changes (mount, text rewrap, dismissal). */
export const PROMO_RESIZE_EVENT = "kova:promo-resize";

export function PromoBar() {
  const t = useT();
  const r = useRoutes();
  const [closed, setClosed] = useState(false);
  const [ready, setReady] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReady(true);
    const stored = sessionStorage.getItem("kova-promo-closed");
    if (stored === "1") setClosed(true);
  }, []);

  /**
   * Publish our height as `--promo-h` so the fixed <Nav> can sit below us
   * instead of underneath us. The bar wraps to two or three lines on narrow
   * screens, so this is measured, not hardcoded.
   */
  const visible = ready && !closed;
  useEffect(() => {
    const root = document.documentElement;
    const publish = (px: number) => {
      root.style.setProperty("--promo-h", `${px}px`);
      window.dispatchEvent(new Event(PROMO_RESIZE_EVENT));
    };

    if (!visible) {
      publish(0);
      return;
    }
    const el = barRef.current;
    if (!el) return;

    const measure = () => publish(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      ro.disconnect();
      publish(0);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={barRef}
      className="relative z-[60] bg-[var(--color-ink)] text-[var(--color-cream)]"
    >
      <div className="max-w-[1240px] mx-auto px-6 lg:px-10 py-2.5 flex items-center justify-between gap-4">
        <p className="text-[0.82rem] sm:text-[0.86rem] tracking-tight">
          <span className="text-[var(--color-sand)]">{t.promo.tag}</span>{" "}
          <span className="font-medium">{t.promo.title}</span>
          <span className="hidden sm:inline text-[var(--color-cream)]/70">
            {t.promo.note}
          </span>
        </p>
        <div className="flex items-center gap-4 shrink-0">
          <Link
            to={r.process}
            className="text-[0.82rem] font-medium text-[var(--color-clay-light)] hover:text-[var(--color-cream)] transition-colors inline-flex items-center gap-1"
          >
            {t.promo.cta}
            <span aria-hidden>→</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              setClosed(true);
              sessionStorage.setItem("kova-promo-closed", "1");
            }}
            aria-label={t.promo.dismiss}
            className="text-[var(--color-cream)]/60 hover:text-[var(--color-cream)] transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
