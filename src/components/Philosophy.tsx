import { useT } from "@/lib/i18n";

export function Philosophy() {
  const t = useT();
  return (
    <section className="border-y border-[var(--color-line)] bg-[var(--color-cream-light)]">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-6 lg:px-10 fluid-section-y">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">{t.philosophy.eyebrow}</p>
          </div>
          <div className="lg:col-span-8">
            <p className="font-serif text-[clamp(1.3rem,0.9rem+2.2vw,2.4rem)] leading-[1.18] tracking-tighter text-[var(--color-ink)]">
              {t.philosophy.statement}
            </p>
            <div className="mt-[clamp(1.5rem,1rem+1.5vw,2.5rem)] grid sm:grid-cols-3 gap-5 lg:gap-8">
              {t.philosophy.points.map((p) => (
                <div key={p.n}>
                  <span className="font-serif text-[0.85rem] text-[var(--color-clay)]">{p.n}</span>
                  <h3 className="mt-1.5 font-serif text-[clamp(0.98rem,0.92rem+0.3vw,1.15rem)] text-[var(--color-ink)]">{p.title}</h3>
                  <p className="mt-1.5 text-[clamp(0.84rem,0.8rem+0.2vw,0.95rem)] leading-relaxed text-[var(--color-muted)]">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
