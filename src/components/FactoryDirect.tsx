import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";
import { useT } from "@/lib/i18n";
import { useRoutes } from "@/lib/routes";

export function FactoryDirect() {
  const t = useT();
  const r = useRoutes();
  const traditional = [
    t.factory.nodes.mill,
    t.factory.nodes.distributor,
    t.factory.nodes.wholesaler,
    t.factory.nodes.retailer,
    t.factory.nodes.showroom,
    t.factory.nodes.you,
  ];
  const ours = [t.factory.nodes.mill, t.factory.nodes.kova, t.factory.nodes.you];

  return (
    <section
      id="factory-direct"
      className="relative border-y border-[var(--color-line)] bg-[var(--color-cream-light)] fluid-section-y overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 0%, rgba(255,233,179,0.35) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-[1240px] mx-auto px-5 sm:px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-10 lg:mb-20">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">{t.factory.eyebrow}</p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-3 lg:mt-5 headline fluid-h2 text-[var(--color-ink)]">
                {t.factory.titleA}
                <span className="block italic font-light text-[var(--color-clay-deep)]">
                  {t.factory.titleB}
                </span>
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={150}>
              <p className="fluid-body text-[var(--color-ink-soft)] max-w-md">
                {t.factory.body}
              </p>
              <div className="mt-5 lg:mt-7 flex flex-wrap items-center gap-2 lg:gap-3">
                <Link
                  to={r.contact}
                  className="inline-flex items-center gap-2 px-4 lg:px-5 py-2.5 rounded-full bg-[var(--color-ink)] text-[var(--color-cream)] text-[0.86rem] lg:text-[0.9rem] font-medium hover:bg-[var(--color-clay-deep)] transition-colors"
                >
                  {t.factory.ctaA}
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  to={r.configurator}
                  className="inline-flex items-center gap-2 px-4 lg:px-5 py-2.5 rounded-full text-[0.86rem] lg:text-[0.9rem] font-medium text-[var(--color-ink)] hover:text-[var(--color-clay-deep)] transition-colors"
                >
                  {t.factory.ctaB}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal>
          <div className="rounded-md border border-[var(--color-line)] bg-[var(--color-paper)] overflow-hidden">
            <div className="px-4 lg:px-10 py-5 lg:py-10 border-b border-[var(--color-line)]">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
                <div className="lg:w-56 shrink-0">
                  <p className="text-[0.7rem] lg:text-[0.74rem] tracking-widest uppercase text-[var(--color-muted)]">
                    {t.factory.chain1Label}
                  </p>
                  <p className="mt-0.5 lg:mt-1 font-serif text-[1.2rem] lg:text-[1.7rem] text-[var(--color-ink)] leading-tight">
                    {t.factory.chain1Title}
                  </p>
                </div>
                <Chain nodes={traditional} variant="traditional" />
              </div>
            </div>

            <div className="px-4 lg:px-10 py-5 lg:py-10 bg-[var(--color-cream-light)]">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
                <div className="lg:w-56 shrink-0">
                  <p className="text-[0.7rem] lg:text-[0.74rem] tracking-widest uppercase text-[var(--color-clay)]">
                    {t.factory.chain2Label}
                  </p>
                  <p className="mt-0.5 lg:mt-1 font-serif text-[1.2rem] lg:text-[1.7rem] text-[var(--color-ink)] leading-tight">
                    {t.factory.chain2Title}
                  </p>
                </div>
                <Chain nodes={ours} variant="ours" />
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <dl className="mt-8 lg:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-line)] border border-[var(--color-line)] rounded-md overflow-hidden">
            {t.factory.stats.map(([value, label]) => (
              <div key={label} className="bg-[var(--color-cream-light)] p-[clamp(1rem,0.5rem+1.5vw,2rem)]">
                <dt className="headline fluid-stat text-[var(--color-ink)]">
                  {value}
                </dt>
                <dd className="mt-[clamp(0.25rem,0.2rem+0.25vw,0.5rem)] text-[clamp(0.76rem,0.72rem+0.18vw,0.9rem)] leading-snug text-[var(--color-muted)] max-w-[24ch]">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal>
          <div className="mt-8 lg:mt-16 flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6 pt-6 lg:pt-8 border-t border-[var(--color-line)]">
            <p className="font-serif text-[clamp(1.1rem,0.9rem+1vw,1.7rem)] tracking-tight text-[var(--color-ink)] max-w-2xl leading-snug">
              {t.factory.closerA}
              <span className="italic font-light text-[var(--color-clay-deep)]"> {t.factory.closerB}</span>
            </p>
            <Link
              to={r.contact}
              className="inline-flex items-center gap-2 text-[0.88rem] lg:text-[0.92rem] font-medium text-[var(--color-ink)] hover:text-[var(--color-clay-deep)] transition-colors shrink-0"
            >
              {t.factory.closerCta}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Chain({
  nodes,
  variant,
}: {
  nodes: string[];
  variant: "traditional" | "ours";
}) {
  const isOurs = variant === "ours";
  return (
    <div className="flex-1 min-w-0">
      <div className="flex flex-wrap items-center gap-y-2 gap-x-1.5 sm:gap-x-3">
        {nodes.map((node, i) => {
          const isFirst = i === 0;
          const isLast = i === nodes.length - 1;
          const isMiddleman = !isOurs && !isFirst && !isLast;
          return (
            <div key={node + i} className="flex items-center gap-1.5 sm:gap-3">
              <div
                className={
                  "px-2.5 sm:px-3.5 py-1 sm:py-2 rounded-full border text-[0.74rem] sm:text-[0.86rem] whitespace-nowrap transition-colors " +
                  (isOurs
                    ? isFirst || isLast
                      ? "bg-[var(--color-cream)] border-[var(--color-line)] text-[var(--color-ink)]"
                      : "bg-[var(--color-ink)] border-[var(--color-ink)] text-[var(--color-cream)] font-medium"
                    : isMiddleman
                    ? "border-[var(--color-line)] text-[var(--color-muted)] line-through decoration-[var(--color-clay)] decoration-[1.5px]"
                    : "border-[var(--color-line)] text-[var(--color-ink)] bg-[var(--color-cream)]")
                }
              >
                {node}
              </div>
              {!isLast && (
                <span
                  aria-hidden
                  className={
                    "text-[0.85rem] sm:text-[0.95rem] " +
                    (isOurs ? "text-[var(--color-clay)]" : "text-[var(--color-line)]")
                  }
                >
                  →
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
