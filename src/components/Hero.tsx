import { Link } from "react-router-dom";
import { HeroVisual } from "./visuals/HeroVisual";
import { ImageSlot } from "./ImageSlot";
import { Reveal } from "./Reveal";
import { useT } from "@/lib/i18n";
import { useRoutes } from "@/lib/routes";

/**
 * Landing hero — two-column: copy left, framed blind right.
 *
 * The H1 is deliberately split into a large keyword lead (`titleA`) and a
 * smaller qualifying tail (`titleB`) inside a *single* h1, so the target term
 * dominates visually while the modifiers still count as heading text.
 *
 * The dark factory-direct strip from the design is already on the page as
 * <PromoBar />, so there's no chip here repeating it a third time.
 */
export function Hero() {
  const t = useT();
  const r = useRoutes();
  return (
    <section id="top" className="relative pt-[clamp(2.5rem,1.5rem+3vw,5rem)] pb-[clamp(2.5rem,1.5rem+3.5vw,5.5rem)]">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_.95fr] gap-[clamp(2rem,1rem+3vw,4.5rem)] items-center">
          {/* Copy — second on mobile so the product leads on small screens */}
          <div className="order-2 lg:order-1">
            <Reveal>
              <p className="eyebrow">{t.hero.eyebrow}</p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-3 lg:mt-4 headline text-[var(--color-ink)]">
                <span className="block text-[clamp(2.4rem,1.4rem+3.8vw,4.6rem)] leading-[0.95]">
                  {t.hero.titleA}
                </span>
                <span className="block mt-2 lg:mt-3 text-[clamp(1.2rem,0.95rem+1.25vw,2rem)] leading-[1.15] font-light text-[var(--color-ink-soft)]">
                  {t.hero.titleB}
                </span>
              </h1>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-5 lg:mt-6 max-w-[58ch] fluid-body text-[var(--color-ink-soft)]">
                {t.hero.body}
              </p>
            </Reveal>
            <Reveal delay={220}>
              <div className="mt-6 lg:mt-8 flex flex-wrap items-center gap-2 lg:gap-3">
                <Link
                  to={r.configurator}
                  className="inline-flex items-center gap-2 px-5 lg:px-6 py-2.5 lg:py-3 rounded-full bg-[var(--color-ink)] text-[var(--color-cream)] text-[0.9rem] lg:text-[0.95rem] font-medium hover:bg-[var(--color-clay-deep)] transition-colors"
                >
                  {t.hero.ctaA}
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  to={r.contact}
                  className="inline-flex items-center gap-2 px-5 lg:px-6 py-2.5 lg:py-3 rounded-full border border-[var(--color-ink)] text-[0.9rem] lg:text-[0.95rem] font-medium text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition-colors"
                >
                  {t.hero.ctaB}
                </Link>
              </div>
            </Reveal>
            <Reveal delay={300}>
              <dl className="mt-8 lg:mt-10 pt-5 lg:pt-6 border-t border-[var(--color-line)] flex flex-wrap gap-x-[clamp(1.25rem,0.5rem+2vw,2.75rem)] gap-y-4">
                {t.hero.trust.map(([n, body]) => (
                  <div key={n}>
                    <dt className="headline text-[clamp(1.05rem,0.95rem+0.4vw,1.3rem)] font-medium text-[var(--color-ink)]">
                      {n}
                    </dt>
                    <dd className="mt-0.5 text-[0.85rem] leading-snug text-[var(--color-muted)]">
                      {body}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* Product — first on mobile */}
          <Reveal delay={120} className="order-1 lg:order-2">
            <figure className="m-0 bg-[var(--color-paper)] border border-[var(--color-line)] rounded-lg p-3.5 pb-0 shadow-[0_1px_2px_rgba(34,32,28,.04),0_12px_28px_-18px_rgba(34,32,28,.28)]">
              <ImageSlot
                ratio="5/4"
                tone="sand"
                priority
                src="/showcase/hero-roller.webp"
                alt={t.hero.figureAlt}
              >
                <HeroVisual className="w-full h-full" />
              </ImageSlot>
              <figcaption className="px-0.5 pt-3 pb-3.5 text-[0.68rem] tracking-[0.12em] uppercase text-[var(--color-muted)]">
                {t.hero.figureLabel}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
