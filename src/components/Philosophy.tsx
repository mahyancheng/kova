import { useT } from "@/lib/i18n";

export function Philosophy() {
  const t = useT();
  return (
    <section className="border-y border-[var(--color-line)] bg-[var(--color-cream-light)]">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-6 lg:px-10 py-12 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">{t.philosophy.eyebrow}</p>
          </div>
          <div className="lg:col-span-8">
            <p className="font-serif text-[1.35rem] sm:text-[1.85rem] lg:text-[2.4rem] leading-[1.2] lg:leading-[1.18] tracking-tighter text-[var(--color-ink)]">
              {t.philosophy.statement}
            </p>
            <div className="mt-7 lg:mt-10 grid sm:grid-cols-3 gap-5 lg:gap-8">
              {t.philosophy.points.map((p) => (
                <div key={p.n}>
                  <span className="font-serif text-[0.85rem] text-[var(--color-clay)]">{p.n}</span>
                  <h3 className="mt-1.5 font-serif text-[1rem] lg:text-[1.1rem] text-[var(--color-ink)]">{p.title}</h3>
                  <p className="mt-1.5 text-[0.86rem] lg:text-[0.92rem] leading-relaxed text-[var(--color-muted)]">
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
