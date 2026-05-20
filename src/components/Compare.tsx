import { Reveal } from "./Reveal";
import { useT } from "@/lib/i18n";

const colWidths =
  "grid-cols-[140px_minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)] sm:grid-cols-[160px_minmax(180px,1fr)_minmax(180px,1fr)_minmax(180px,1fr)] lg:grid-cols-4";

export function Compare() {
  const t = useT();
  return (
    <section id="compare" className="py-12 lg:py-24 border-t border-[var(--color-line)]">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-7 lg:mb-12">
            <div>
              <p className="eyebrow">{t.compare.eyebrow}</p>
              <h2 className="mt-3 lg:mt-4 headline text-[1.85rem] sm:text-[2.4rem] lg:text-[3.2rem] text-[var(--color-ink)] max-w-2xl">
                {t.compare.title}
              </h2>
            </div>
            <p className="max-w-sm text-[0.95rem] lg:text-[1rem] text-[var(--color-ink-soft)] leading-relaxed">
              {t.compare.intro}
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="relative">
            <div
              aria-hidden
              className="lg:hidden pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[var(--color-cream)] to-transparent z-10 rounded-r-md"
            />
            <div className="overflow-x-auto no-scrollbar rounded-md border border-[var(--color-line)] bg-[var(--color-paper)]">
              <div className="min-w-[680px] lg:min-w-0">
                <div className={`grid ${colWidths} bg-[var(--color-cream-light)] border-b border-[var(--color-line)]`}>
                  {t.compare.headers.map((h, i) => (
                    <div
                      key={h}
                      className={
                        "px-5 lg:px-7 py-5 " +
                        (i === 0
                          ? "text-[0.78rem] tracking-widest uppercase text-[var(--color-muted)]"
                          : "border-l border-[var(--color-line)] font-serif tracking-tight text-[1.05rem] sm:text-[1.15rem] text-[var(--color-ink)]")
                      }
                    >
                      {h}
                    </div>
                  ))}
                </div>
                {t.compare.rows.map((row, i) => (
                  <div
                    key={row.label}
                    className={
                      `grid ${colWidths} ` +
                      (i < t.compare.rows.length - 1 ? "border-b border-[var(--color-line)] " : "") +
                      (i % 2 === 0 ? "bg-[var(--color-paper)]" : "bg-[var(--color-cream-light)]")
                    }
                  >
                    <div className="px-5 lg:px-7 py-5 text-[0.86rem] sm:text-[0.9rem] text-[var(--color-muted)]">
                      {row.label}
                    </div>
                    {row.values.map((v, j) => {
                      const accent = (row as { clay?: number[] }).clay?.includes(j);
                      return (
                        <div
                          key={j}
                          className={
                            "px-5 lg:px-7 py-5 text-[0.92rem] sm:text-[0.95rem] leading-snug border-l border-[var(--color-line)] break-words hyphens-auto " +
                            (accent ? "text-[var(--color-clay-deep)] font-medium" : "text-[var(--color-ink)]")
                          }
                        >
                          {v}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <p className="lg:hidden mt-3 text-[0.74rem] tracking-widest uppercase text-[var(--color-muted)] text-right">
              {t.compare.swipeHint}
            </p>
          </div>
        </Reveal>

        <Reveal>
          <p className="mt-6 text-[0.86rem] text-[var(--color-muted)] max-w-2xl">
            {t.compare.footer}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
