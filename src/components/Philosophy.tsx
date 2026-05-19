import { useT } from "@/lib/i18n";

export function Philosophy() {
  const t = useT();
  return (
    <section className="border-y border-[var(--color-line)] bg-[var(--color-cream-light)]">
      <div className="max-w-[1240px] mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">{t.philosophy.eyebrow}</p>
          </div>
          <div className="lg:col-span-8">
            <p className="font-serif text-[1.7rem] sm:text-[2.1rem] lg:text-[2.5rem] leading-[1.18] tracking-tighter text-[var(--color-ink)]">
              {t.philosophy.statement}
            </p>
            <div className="mt-10 grid sm:grid-cols-3 gap-8">
              {t.philosophy.points.map((p) => (
                <div key={p.n}>
                  <span className="font-serif text-sm text-[var(--color-clay)]">{p.n}</span>
                  <h3 className="mt-2 font-serif text-[1.1rem] text-[var(--color-ink)]">{p.title}</h3>
                  <p className="mt-2 text-[0.92rem] leading-relaxed text-[var(--color-muted)]">
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
