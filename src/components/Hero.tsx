import { HeroVisual } from "./visuals/HeroVisual";
import { ImageSlot } from "./ImageSlot";
import { Reveal } from "./Reveal";
import { useT } from "@/lib/i18n";

export function Hero() {
  const t = useT();
  return (
    <section id="top" className="relative pt-20 lg:pt-28 pb-12 lg:pb-20">
      <div className="max-w-[1380px] mx-auto px-6 lg:px-10">
        <div className="text-center max-w-5xl mx-auto pt-8 lg:pt-12">
          <Reveal>
            <a
              href="#factory-direct"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--color-line)] bg-[var(--color-paper)] text-[0.78rem] tracking-tight text-[var(--color-ink-soft)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] transition-colors"
            >
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-clay)]" />
              {t.hero.chip}
              <span aria-hidden className="text-[var(--color-clay)]">→</span>
            </a>
          </Reveal>
          <Reveal delay={60}>
            <p className="eyebrow mt-5">{t.hero.eyebrow}</p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 headline text-[3.4rem] sm:text-[4.6rem] lg:text-[6.4rem] xl:text-[7.4rem] text-[var(--color-ink)]">
              {t.hero.titleA}
              <span className="italic font-light text-[var(--color-clay-deep)]"> {t.hero.titleB}</span>
            </h1>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-7 max-w-2xl mx-auto text-[1.1rem] sm:text-[1.2rem] leading-[1.55] text-[var(--color-ink-soft)]">
              {t.hero.body}
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#collection"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-ink)] text-[var(--color-cream)] text-[0.95rem] font-medium hover:bg-[var(--color-clay-deep)] transition-colors"
              >
                {t.hero.ctaA}
                <span aria-hidden>→</span>
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[0.95rem] font-medium text-[var(--color-ink)] hover:text-[var(--color-clay-deep)] transition-colors"
              >
                {t.hero.ctaB}
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={300}>
          <div className="mt-14 lg:mt-20 relative">
            <ImageSlot ratio="21/9" label={t.hero.figureLabel} tone="sand">
              <HeroVisual className="w-full h-full" />
            </ImageSlot>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-[var(--color-cream)] border border-[var(--color-line)] text-[0.72rem] tracking-widest uppercase text-[var(--color-muted)]">
              {t.hero.photoHint}
            </div>
          </div>
        </Reveal>

        <Reveal delay={400}>
          <dl className="mt-20 lg:mt-28 grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-md overflow-hidden">
            {t.hero.stats.map(([n, body]) => (
              <div key={n} className="bg-[var(--color-cream-light)] p-7 lg:p-8">
                <dt className="headline text-[2.6rem] lg:text-[3.2rem] text-[var(--color-ink)]">{n}</dt>
                <dd className="mt-2 text-[0.92rem] leading-snug text-[var(--color-muted)] max-w-[18ch]">
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
