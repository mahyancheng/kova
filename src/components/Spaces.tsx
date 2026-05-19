import { useT } from "@/lib/i18n";

export function Spaces() {
  const t = useT();
  return (
    <section id="spaces" className="py-20 lg:py-28 border-t border-[var(--color-line)] bg-[var(--color-cream-light)]">
      <div className="max-w-[1240px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <div>
            <p className="eyebrow">{t.spaces.eyebrow}</p>
            <h2 className="mt-4 font-serif text-[2.2rem] sm:text-[2.8rem] lg:text-[3.2rem] leading-[1.05] tracking-tighter text-[var(--color-ink)] max-w-2xl">
              {t.spaces.title}
            </h2>
          </div>
          <p className="max-w-md text-[var(--color-ink-soft)] leading-relaxed">
            {t.spaces.intro}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-sm overflow-hidden">
          {t.spaces.items.map((s) => (
            <article
              key={s.title}
              className="group relative bg-[var(--color-cream-light)] hover:bg-[var(--color-paper)] transition-colors p-7 lg:p-9"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-serif text-[1.4rem] leading-tight text-[var(--color-ink)]">
                  {s.title}
                </h3>
                <span className="text-[0.72rem] text-[var(--color-muted)] tracking-widest uppercase">
                  {t.spaces.pairLabel}
                </span>
              </div>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-[var(--color-ink-soft)]">
                {s.note}
              </p>
              <p className="mt-6 pt-4 border-t border-[var(--color-line-soft)] text-[0.86rem] text-[var(--color-clay-deep)] font-medium">
                {s.pair}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
