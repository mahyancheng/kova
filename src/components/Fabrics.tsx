import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";
import { useT } from "@/lib/i18n";

export function Fabrics() {
  const t = useT();
  const swatches = t.fabrics.swatches;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  return (
    <section className="relative fluid-section-y bg-[var(--color-cream-light)] border-y border-[var(--color-line)] overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-[clamp(1.5rem,1rem+1.5vw,3rem)]">
            <div>
              <p className="eyebrow">{t.fabrics.eyebrow}</p>
              <h2 className="mt-3 lg:mt-4 headline fluid-h3 text-[var(--color-ink)] max-w-2xl">
                {t.fabrics.titleA}
                <span className="italic font-light text-[var(--color-clay-deep)]"> {t.fabrics.titleB}</span>
              </h2>
            </div>
            <p className="max-w-md fluid-body text-[var(--color-ink-soft)]">
              {t.fabrics.intro}
            </p>
          </div>
        </Reveal>
      </div>

      <div ref={scrollRef} className="snap-x-strong no-scrollbar overflow-x-auto">
        <div className="flex gap-5 lg:gap-7 px-6 lg:px-10 pb-3">
          {swatches.map((s) => (
            <article
              key={s.name}
              className="snap-start shrink-0 w-[260px] sm:w-[300px] lg:w-[340px] group"
            >
              <div
                className="relative aspect-[4/5] rounded-md border border-[var(--color-line)] overflow-hidden"
                style={{ backgroundColor: s.hex }}
              >
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 4px), repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0 1px, transparent 1px 4px)",
                  }}
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(120% 60% at 50% 0%, rgba(255,233,179,0.35) 0%, transparent 70%)",
                  }}
                />
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-[var(--color-cream)]/85 backdrop-blur-sm text-[var(--color-ink)] text-[0.68rem] tracking-widest uppercase px-2.5 py-1 rounded-full">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: s.hex, border: "1px solid rgba(0,0,0,0.15)" }}
                  />
                  {s.type}
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="font-serif text-[1.25rem] text-[var(--color-ink)] tracking-tight">
                  {s.name}
                </h3>
                <span className="text-[0.78rem] text-[var(--color-muted)]">{s.hex.toUpperCase()}</span>
              </div>
              <p className="mt-1 text-[0.86rem] text-[var(--color-muted)]">{s.opacity}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-6 lg:px-10 mt-8 flex items-center gap-6">
        <div className="flex-1 h-px bg-[var(--color-line)] relative overflow-hidden">
          <span
            className="absolute inset-y-0 left-0 bg-[var(--color-ink)] transition-[width] duration-200"
            style={{ width: `${Math.max(8, progress * 100)}%`, height: "2px" }}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label={t.fabrics.prev}
            className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-[var(--color-line)] hover:border-[var(--color-ink)] hover:bg-[var(--color-cream)] transition-colors"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label={t.fabrics.next}
            className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-[var(--color-line)] hover:border-[var(--color-ink)] hover:bg-[var(--color-cream)] transition-colors"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
