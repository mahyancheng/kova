import { useT } from "@/lib/i18n";

export function Process() {
  const t = useT();
  return (
    <section className="fluid-section-y border-t border-[var(--color-line)]">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-7 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="eyebrow">{t.process.eyebrow}</p>
            <h2 className="mt-3 lg:mt-4 font-serif text-[clamp(1.55rem,1.1rem+1.8vw,2.4rem)] leading-[1.08] tracking-tighter text-[var(--color-ink)]">
              {t.process.titleA} <span className="italic font-light text-[var(--color-clay-deep)]">{t.process.titleB}</span>
            </h2>
            <p className="mt-4 lg:mt-5 fluid-body text-[var(--color-ink-soft)] max-w-sm">
              {t.process.intro}
            </p>
          </div>
          <ol className="lg:col-span-8 grid sm:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-sm overflow-hidden">
            {t.process.steps.map((s) => (
              <li key={s.n} className="bg-[var(--color-cream)] p-[clamp(1.25rem,0.8rem+1.2vw,2rem)]">
                <span className="font-serif text-[clamp(0.78rem,0.74rem+0.18vw,0.9rem)] text-[var(--color-clay)]">{s.n}</span>
                <h3 className="mt-1.5 lg:mt-2 font-serif text-[clamp(1.1rem,0.9rem+0.7vw,1.4rem)] text-[var(--color-ink)] leading-tight">
                  {s.title}
                </h3>
                <p className="mt-2 lg:mt-3 text-[clamp(0.84rem,0.8rem+0.2vw,0.95rem)] leading-relaxed text-[var(--color-muted)]">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
