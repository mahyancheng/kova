import { ImageSlot } from "./ImageSlot";
import { useT } from "@/lib/i18n";

export function Philosophy() {
  const t = useT();
  return (
    <section className="border-y border-[var(--color-line)] bg-[var(--color-cream-light)]">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-6 lg:px-10 fluid-section-y">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">{t.philosophy.eyebrow}</p>
            {/* Same paper frame as the hero. Portrait crop: the subject is
                floor-to-ceiling vertical vanes, which suit a tall frame, and
                it fills the column beside the statement. */}
            <figure className="mt-6 lg:mt-8 m-0 bg-[var(--color-paper)] border border-[var(--color-line)] rounded-lg p-3.5 pb-0 shadow-[0_1px_2px_rgba(34,32,28,.04),0_12px_28px_-18px_rgba(34,32,28,.28)]">
              <ImageSlot
                ratio="4/5"
                tone="sand"
                src="/showcase/philosophy-vertisheer.webp"
                alt={t.philosophy.figureAlt}
              />
              <figcaption className="px-0.5 pt-3 pb-3.5 text-[0.68rem] tracking-[0.12em] uppercase text-[var(--color-muted)]">
                {t.philosophy.figureLabel}
              </figcaption>
            </figure>
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
