import { useT } from "@/lib/i18n";

export function Spaces() {
  const t = useT();
  return (
    <section id="spaces" className="fluid-section-y border-t border-[var(--color-line)] bg-[var(--color-cream-light)]">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-[clamp(1.5rem,1rem+1.5vw,3rem)]">
          <div>
            <p className="eyebrow">{t.spaces.eyebrow}</p>
            <h2 className="mt-3 lg:mt-4 font-serif fluid-h3 tracking-tighter text-[var(--color-ink)] max-w-2xl">
              {t.spaces.title}
            </h2>
          </div>
          <p className="max-w-md fluid-body text-[var(--color-ink-soft)]">
            {t.spaces.intro}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-sm overflow-hidden">
          {t.spaces.items.map((s) => (
            <article
              key={s.title}
              className="group relative bg-[var(--color-cream-light)] hover:bg-[var(--color-paper)] transition-colors p-[clamp(1.25rem,0.8rem+1.2vw,2rem)]"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-serif text-[clamp(1.15rem,0.95rem+0.7vw,1.5rem)] leading-tight text-[var(--color-ink)]">
                  {s.title}
                </h3>
                <span className="text-[0.68rem] lg:text-[0.72rem] text-[var(--color-muted)] tracking-widest uppercase">
                  {t.spaces.pairLabel}
                </span>
              </div>
              <p className="mt-2 lg:mt-3 text-[0.88rem] lg:text-[0.95rem] leading-relaxed text-[var(--color-ink-soft)]">
                {s.note}
              </p>
              <p className="mt-4 lg:mt-6 pt-3 lg:pt-4 border-t border-[var(--color-line-soft)] text-[0.82rem] lg:text-[0.86rem] text-[var(--color-clay-deep)] font-medium">
                {s.pair}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
