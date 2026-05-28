import { HeroVisual } from "./visuals/HeroVisual";
import { ImageSlot } from "./ImageSlot";
import { Reveal } from "./Reveal";
import { useT } from "@/lib/i18n";

export function Hero() {
  const t = useT();
  return (
    <section id="top" className="relative pt-[clamp(3rem,2rem+4vw,7rem)] pb-[clamp(2rem,1rem+3.5vw,5rem)]">
      <div className="max-w-[1380px] mx-auto px-5 sm:px-6 lg:px-10">
        <div className="text-center max-w-5xl mx-auto pt-4 lg:pt-12">
          <Reveal>
            <a
              href="#factory-direct"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-line)] bg-[var(--color-paper)] text-[0.74rem] sm:text-[0.78rem] tracking-tight text-[var(--color-ink-soft)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] transition-colors"
            >
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-clay)]" />
              {t.hero.chip}
              <span aria-hidden className="text-[var(--color-clay)]">→</span>
            </a>
          </Reveal>
          <Reveal delay={60}>
            <p className="eyebrow mt-4 lg:mt-5">{t.hero.eyebrow}</p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-4 lg:mt-6 headline fluid-h1 text-[var(--color-ink)]">
              {t.hero.titleA}
              <span className="italic font-light text-[var(--color-clay-deep)]"> {t.hero.titleB}</span>
            </h1>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-5 lg:mt-7 max-w-2xl mx-auto fluid-body text-[var(--color-ink-soft)]">
              {t.hero.body}
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div className="mt-6 lg:mt-9 flex flex-wrap items-center justify-center gap-2 lg:gap-3">
              <a
                href="#collection"
                className="inline-flex items-center gap-2 px-5 lg:px-6 py-2.5 lg:py-3 rounded-full bg-[var(--color-ink)] text-[var(--color-cream)] text-[0.9rem] lg:text-[0.95rem] font-medium hover:bg-[var(--color-clay-deep)] transition-colors"
              >
                {t.hero.ctaA}
                <span aria-hidden>→</span>
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 lg:px-6 py-2.5 lg:py-3 rounded-full text-[0.9rem] lg:text-[0.95rem] font-medium text-[var(--color-ink)] hover:text-[var(--color-clay-deep)] transition-colors"
              >
                {t.hero.ctaB}
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={300}>
          <div className="mt-10 lg:mt-20 relative">
            <ImageSlot
              ratio="21/9"
              label={t.hero.figureLabel}
              tone="sand"
              src="/showcase/hero-living.jpg"
              alt={t.hero.figureLabel}
            >
              <HeroVisual className="w-full h-full" />
            </ImageSlot>
          </div>
        </Reveal>

        <Reveal delay={400}>
          <dl className="mt-[clamp(2.5rem,1rem+5vw,7rem)] grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-md overflow-hidden">
            {t.hero.stats.map(([n, body]) => (
              <div key={n} className="bg-[var(--color-cream-light)] p-[clamp(1rem,0.5rem+1.5vw,2rem)]">
                <dt className="headline fluid-stat text-[var(--color-ink)]">{n}</dt>
                <dd className="mt-[clamp(0.35rem,0.25rem+0.3vw,0.6rem)] text-[clamp(0.78rem,0.74rem+0.2vw,0.92rem)] leading-snug text-[var(--color-muted)] max-w-[18ch]">
                  {body}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
