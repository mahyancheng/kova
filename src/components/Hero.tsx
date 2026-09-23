import { Link } from "react-router-dom";
import { ImageSlot } from "./ImageSlot";
import { Reveal } from "./Reveal";
import { useT } from "@/lib/i18n";
import { useRoutes } from "@/lib/routes";

/**
 * Landing hero — two-column: copy left, framed photograph right.
 *
 * Carries the copy from the supplied hero references, but rendered with the
 * site's own primitives rather than the reference's bespoke values: the
 * `eyebrow` utility, `headline fluid-h2` with an italic clay tail, the
 * standard ink pill buttons, and the same paper-framed `ImageSlot` with an
 * uppercase figcaption that Philosophy and the product pages use. The
 * reference's one-off devices — a clay-filled CTA, overlay chips on the
 * photo, a full-bleed mobile band, 1.5px borders and custom tracking —
 * are deliberately not reproduced; they existed nowhere else on the site.
 *
 * The H1 is one element split into a head term (`titleA`) and an italic
 * tail (`titleB`), so the term reads large while the modifier still counts
 * as heading text.
 */
export function Hero() {
  const t = useT();
  const r = useRoutes();

  return (
    <section id="top" className="relative pt-[clamp(2.5rem,1.5rem+3vw,5rem)] pb-[clamp(2.5rem,1.5rem+3.5vw,5.5rem)]">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_.95fr] gap-[clamp(2rem,1rem+3vw,4.5rem)] items-center">
          {/* Copy — second on mobile so the photograph leads on small screens */}
          <div className="order-2 lg:order-1">
            <Reveal>
              {/* Same eyebrow treatment as every other section; the reference's
                  workshop line on desktop, the product line-up on mobile. */}
              <p className="eyebrow hidden lg:block">{t.hero.eyebrow}</p>
              <p className="eyebrow lg:hidden">{t.hero.eyebrowMobile}</p>
            </Reveal>

            <Reveal delay={80}>
              {/* Same H1 treatment as the product pages: bold and upright,
                  with the italic tail on the line below. */}
              <h1 className="mt-3 lg:mt-4 headline fluid-h2 font-bold not-italic text-[var(--color-ink)]">
                {t.hero.titleA}
                <span className="block mt-1 lg:mt-2 italic font-light text-[var(--color-clay-deep)]">
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
                  to={r.contact}
                  className="inline-flex items-center gap-2 px-5 lg:px-6 py-2.5 lg:py-3 rounded-full bg-[var(--color-ink)] text-[var(--color-cream)] text-[0.88rem] font-medium hover:bg-[var(--color-clay-deep)] transition-colors"
                >
                  {t.hero.ctaA}
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  to={r.contact}
                  className="inline-flex items-center gap-2 px-5 lg:px-6 py-2.5 lg:py-3 rounded-full border border-[var(--color-ink)] text-[0.88rem] font-medium text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition-colors"
                >
                  {t.hero.ctaB}
                </Link>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <ul className="mt-8 lg:mt-10 pt-5 lg:pt-6 border-t border-[var(--color-line)] flex flex-wrap gap-x-[clamp(1.25rem,0.5rem+2vw,2.75rem)] gap-y-2.5 text-[0.88rem] leading-snug text-[var(--color-muted)]">
                {t.hero.trust.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span aria-hidden className="h-1 w-1 rounded-full bg-[var(--color-clay)] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Photograph — first on mobile, in the site's paper frame */}
          <Reveal delay={120} className="order-1 lg:order-2">
            <figure className="m-0 bg-[var(--color-paper)] border border-[var(--color-line)] rounded-lg p-3.5 pb-0 shadow-[0_1px_2px_rgba(34,32,28,.04),0_12px_28px_-18px_rgba(34,32,28,.28)]">
              <ImageSlot
                ratio="5/4"
                tone="sand"
                priority
                src="/showcase/hero-living.webp"
                srcSet="/showcase/hero-living-640.webp 640w, /showcase/hero-living-800.webp 800w, /showcase/hero-living-1024.webp 1024w, /showcase/hero-living.webp 1400w"
                sizes="(min-width: 1024px) 560px, 100vw"
                alt={t.hero.figureAlt}
                width={1400}
                height={1120}
              />
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
