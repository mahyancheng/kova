import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";
import { useT } from "@/lib/i18n";
import { useRoutes } from "@/lib/routes";

/**
 * Landing hero — split layout.
 *
 * Follows the supplied "A · Split layout" and "A · Mobile" design
 * references, rebuilt in the site's own tokens rather than copied: copy
 * left, photograph right carrying the three product chips, and a trust row
 * under the buttons. Mobile reorders to a full-bleed photo band above the
 * copy, stacked full-width buttons, and the trust points collapsed onto one
 * dotted line.
 *
 * The H1 is one element split into a head term (`titleA`) and an italic
 * tail (`titleB`), so the term reads large while the modifier still counts
 * as heading text.
 */

const ICONS = [
  // tag — pricing
  <>
    <path d="M20 12V8H6a2 2 0 0 1 0-4h12v4" />
    <path d="M4 6v12a2 2 0 0 0 2 2h14v-4" />
    <circle cx="17" cy="14" r="1.5" />
  </>,
  // rule — measurement
  <>
    <path d="M21.3 15.3 8.7 2.7a1 1 0 0 0-1.4 0L2.7 7.3a1 1 0 0 0 0 1.4l12.6 12.6a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4Z" />
    <path d="m7.5 10.5 2 2" />
    <path d="m10.5 7.5 2 2" />
    <path d="m13.5 13.5 2 2" />
  </>,
  // check — made to measure
  <path d="M20 6 9 17l-5-5" />,
];

export function Hero() {
  const t = useT();
  const r = useRoutes();
  const chips = t.collection.items;

  return (
    // Nav is `fixed` and h-24 (96px) at every breakpoint, so it doesn't push
    // <main> down on its own — the first section on the page has to clear
    // it with its own top padding. This used to bottom out at 28px, well
    // under the header's height, so the eyebrow line sat almost flush
    // against the nav bar.
    <section id="top" className="relative pt-[clamp(7rem,6rem+3vw,9rem)] pb-[clamp(2.5rem,1.5rem+3.5vw,5.5rem)]">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(1.5rem,1rem+3vw,4rem)] items-stretch">
          {/* Copy — second on mobile, where the photograph leads */}
          <div className="order-2 lg:order-1 flex flex-col justify-center gap-[clamp(1rem,0.7rem+1vw,1.75rem)]">
            <Reveal>
              {/* Desktop: workshop line with a rule. Mobile: the line-up. */}
              <p className="hidden lg:flex items-center gap-2.5 text-[0.8rem] font-semibold tracking-[0.12em] uppercase text-[var(--color-clay-deep)]">
                <span aria-hidden className="inline-block w-7 h-px bg-[var(--color-clay-deep)]" />
                {t.hero.eyebrow}
              </p>
              <p className="lg:hidden text-[0.69rem] font-semibold tracking-[0.12em] uppercase text-[var(--color-clay-deep)]">
                {t.hero.eyebrowMobile}
              </p>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="headline font-medium text-[clamp(2.25rem,1.2rem+3.4vw,4.25rem)] leading-[1.04] tracking-[-0.025em] text-[var(--color-ink)]">
                {t.hero.titleA}
                <br className="hidden lg:inline" />{" "}
                <span className="italic font-normal text-[var(--color-clay-deep)]">{t.hero.titleB}</span>
              </h1>
            </Reveal>

            <Reveal delay={150}>
              <p className="max-w-[520px] text-[clamp(1rem,0.95rem+0.25vw,1.19rem)] leading-[1.6] text-[var(--color-ink-soft)]">
                {t.hero.body}
              </p>
            </Reveal>

            <Reveal delay={220}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3">
                <Link
                  to={r.contact}
                  className="inline-flex items-center justify-center sm:justify-start gap-2.5 h-13 sm:h-14 px-7 rounded-full bg-[var(--color-clay)] text-[var(--color-cream)] text-[1rem] font-semibold hover:bg-[var(--color-clay-deep)] transition-colors"
                >
                  {t.hero.ctaA}
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  to={r.contact}
                  className="inline-flex items-center justify-center sm:justify-start h-13 sm:h-14 px-6 rounded-full border-[1.5px] border-[var(--color-ink)] text-[1rem] font-semibold text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition-colors"
                >
                  {t.hero.ctaB}
                </Link>
              </div>
            </Reveal>

            <Reveal delay={300}>
              {/* Desktop: icon row. Mobile: one centred dotted line. */}
              <ul className="hidden lg:flex flex-wrap gap-x-7 gap-y-3 pt-5 border-t border-[var(--color-line)] text-[0.875rem] font-medium text-[var(--color-ink-soft)]">
                {t.hero.trust.map((item, i) => (
                  <li key={item} className="flex items-center gap-2">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--color-clay-deep)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                      className="shrink-0"
                    >
                      {ICONS[i] ?? ICONS[2]}
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="lg:hidden pt-3.5 border-t border-[var(--color-line)] text-center text-[0.82rem] font-medium leading-[1.6] text-[var(--color-ink-soft)]">
                {t.hero.trust.map((item, i) => (
                  <span key={item}>
                    {i > 0 && <span className="text-[var(--color-clay)]"> · </span>}
                    {item}
                  </span>
                ))}
              </p>
            </Reveal>
          </div>

          {/* Photograph — first on mobile, full-bleed there */}
          <Reveal delay={120} className="order-1 lg:order-2">
            <figure className="m-0 h-full flex flex-col gap-3.5">
              <div className="relative -mx-5 sm:-mx-6 lg:mx-0 h-[250px] lg:h-auto lg:grow overflow-hidden rounded-none lg:rounded-md bg-[var(--color-cream-dark)]">
                <img
                  src="/showcase/hero-living.webp"
                  srcSet="/showcase/hero-living-640.webp 640w, /showcase/hero-living-800.webp 800w, /showcase/hero-living-1024.webp 1024w, /showcase/hero-living.webp 1400w"
                  sizes="(min-width: 1024px) 560px, 100vw"
                  alt={t.hero.figureAlt}
                  loading="eager"
                  fetchPriority="high"
                  decoding="sync"
                  width={1400}
                  height={1050}
                  className="absolute inset-0 w-full h-full object-cover object-[58%_50%] lg:object-[58%_50%]"
                />
                {/* Product chips — desktop only, as in the reference */}
                <div className="hidden lg:flex absolute left-5 bottom-5 gap-2">
                  {chips.map((chip, i) => (
                    <Link
                      key={chip.id}
                      to={`${r.home === "/bidai" ? "/bidai" : ""}/${chip.id}`}
                      className="inline-flex items-center gap-2 h-11 px-4 rounded-full bg-[var(--color-cream)]/95 backdrop-blur-sm text-[0.875rem] font-medium text-[var(--color-ink)] hover:bg-[var(--color-cream)] transition-colors"
                    >
                      <span className="font-serif italic text-[var(--color-clay-deep)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {chip.name}
                    </Link>
                  ))}
                </div>
              </div>
              <figcaption className="hidden lg:block font-serif italic text-[0.82rem] text-[var(--color-muted)]">
                {t.hero.figureLabel}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
