import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ImageSlot } from "./ImageSlot";
import { Reveal } from "./Reveal";
import { useT } from "@/lib/i18n";

export type ProductSpotlightProps = {
  id: string;
  number: string;
  name: string;
  taglineA: string;
  taglineB: string;
  body: string[];
  features: { title: string; detail: string }[];
  perfectFor: string[];
  figureCaption: string;
  detailCaption: string;
  visualSrc?: string;
  Visual?: (props: { className?: string }) => ReactNode;
  detailSrc?: string;
  Detail?: (props: { className?: string }) => ReactNode;
  reverse?: boolean;
  tone?: "cream" | "paper" | "ink";
};

export function ProductSpotlight({
  id,
  number,
  name,
  taglineA,
  taglineB,
  body,
  features,
  perfectFor,
  figureCaption: _figureCaption,
  detailCaption,
  visualSrc,
  Visual,
  detailSrc,
  Detail,
  reverse,
  tone = "cream",
}: ProductSpotlightProps) {
  const t = useT();
  const c = t.productCommon;
  const isInk = tone === "ink";
  const sectionBg =
    tone === "ink"
      ? "bg-[var(--color-ink)] text-[var(--color-cream)]"
      : tone === "paper"
      ? "bg-[var(--color-paper)]"
      : "bg-[var(--color-cream)]";

  return (
    <section
      id={id}
      className={cn(
        "relative border-t",
        isInk ? "border-white/10" : "border-[var(--color-line)]",
        sectionBg,
      )}
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-6 lg:px-10 pt-10 lg:pt-20">
        <Reveal>
          <p className={cn("eyebrow", isInk && "!text-[var(--color-sand)]")}>
            <span className={isInk ? "text-[var(--color-clay-light)]" : "text-[var(--color-clay)]"}>{number}</span>
            <span className={cn("mx-2", isInk ? "text-white/30" : "text-[var(--color-line)]")}>/</span>
            {name}
          </p>
        </Reveal>
      </div>

      <div className="max-w-[1240px] mx-auto px-5 sm:px-6 lg:px-10 pt-4 lg:pt-10 pb-10 lg:pb-20">
        <div className={cn("grid lg:grid-cols-12 gap-5 lg:gap-12 items-end", reverse && "lg:[&>div:first-child]:order-2")}>
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className={cn("headline text-[2.15rem] sm:text-[3rem] lg:text-[4.5rem]", isInk ? "text-[var(--color-cream)]" : "text-[var(--color-ink)]")}>
                {taglineA}
                <span className={cn("block italic font-light", isInk ? "text-[var(--color-clay-light)]" : "text-[var(--color-clay-deep)]")}>
                  {taglineB}
                </span>
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={100}>
              <div className={cn("space-y-3 lg:space-y-4 text-[0.94rem] lg:text-[1.02rem] leading-[1.55] lg:leading-[1.65]", isInk ? "text-[var(--color-cream)]/80" : "text-[var(--color-ink-soft)]")}>
                {body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="mt-5 lg:mt-7 flex flex-wrap items-center gap-2 lg:gap-3">
                <a
                  href="#contact"
                  className={cn(
                    "inline-flex items-center gap-2 px-4 lg:px-5 py-2.5 rounded-full text-[0.86rem] lg:text-[0.9rem] font-medium transition-colors",
                    isInk
                      ? "bg-[var(--color-clay)] text-[var(--color-cream)] hover:bg-[var(--color-clay-deep)]"
                      : "bg-[var(--color-ink)] text-[var(--color-cream)] hover:bg-[var(--color-clay-deep)]",
                  )}
                >
                  {c.ctaA}
                  <span aria-hidden>→</span>
                </a>
                <a
                  href={`#${id}-spec`}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 lg:px-5 py-2.5 rounded-full text-[0.86rem] lg:text-[0.9rem] font-medium transition-colors",
                    isInk
                      ? "text-[var(--color-cream)] hover:text-[var(--color-clay)]"
                      : "text-[var(--color-ink)] hover:text-[var(--color-clay-deep)]",
                  )}
                >
                  {c.ctaB}
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10">
        <Reveal>
          <ImageSlot
            ratio="21/9"
            label={`${number} · ${name}`}
            tone={isInk ? "ink" : "sand"}
            src={visualSrc}
            alt={`${name}`}
          >
            {Visual ? <Visual className="w-full h-full" /> : undefined}
          </ImageSlot>
        </Reveal>
      </div>

      <div id={`${id}-spec`} className="max-w-[1240px] mx-auto px-5 sm:px-6 lg:px-10 py-12 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-16">
          <div className="lg:col-span-5 lg:sticky lg:top-28 self-start">
            <Reveal>
              <ImageSlot
                ratio="4/5"
                label={c.detailLabel}
                tone={isInk ? "ink" : "cream"}
                src={detailSrc}
                alt={`${name}`}
                caption={detailCaption}
              >
                {Detail ? <Detail className="w-full h-full" /> : undefined}
              </ImageSlot>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <p className={cn("eyebrow", isInk && "!text-[var(--color-sand)]")}>{c.whyEyebrow}</p>
              <h3 className={cn("mt-3 lg:mt-4 headline text-[1.55rem] sm:text-[2rem] lg:text-[2.6rem]", isInk ? "text-[var(--color-cream)]" : "text-[var(--color-ink)]")}>
                {c.whyTitle}
              </h3>
            </Reveal>

            <ol className="mt-7 lg:mt-10 space-y-6 lg:space-y-10">
              {features.map((f, i) => (
                <Reveal key={i} delay={i * 50}>
                  <li className={cn("relative pl-10 sm:pl-16", isInk ? "border-l border-white/10" : "border-l border-[var(--color-line)]")}>
                    <span
                      className={cn(
                        "absolute -left-px top-0.5 font-serif text-[0.82rem] lg:text-[0.9rem]",
                        isInk ? "text-[var(--color-clay-light)]" : "text-[var(--color-clay)]",
                      )}
                      style={{ paddingLeft: "1rem" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h4 className={cn("font-serif text-[1.1rem] sm:text-[1.3rem] lg:text-[1.55rem] leading-tight tracking-tight", isInk ? "text-[var(--color-cream)]" : "text-[var(--color-ink)]")}>
                      {f.title}
                    </h4>
                    <p className={cn("mt-2 text-[0.9rem] lg:text-[1rem] leading-[1.55] lg:leading-[1.7] max-w-prose", isInk ? "text-[var(--color-cream)]/70" : "text-[var(--color-muted)]")}>
                      {f.detail}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ol>

            <Reveal>
              <div className={cn("mt-9 lg:mt-14 pt-6 lg:pt-9 border-t", isInk ? "border-white/10" : "border-[var(--color-line)]")}>
                <p className={cn("eyebrow", isInk && "!text-[var(--color-sand)]")}>{c.perfectForLabel}</p>
                <ul className="mt-3 lg:mt-4 flex flex-wrap gap-1.5 lg:gap-2">
                  {perfectFor.map((p) => (
                    <li
                      key={p}
                      className={cn(
                        "px-3 lg:px-3.5 py-1 lg:py-1.5 rounded-full text-[0.8rem] lg:text-[0.86rem] transition-colors border",
                        isInk
                          ? "border-white/20 text-[var(--color-cream)]/85 hover:border-[var(--color-clay-light)] hover:text-[var(--color-clay-light)]"
                          : "border-[var(--color-line)] text-[var(--color-ink-soft)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]",
                      )}
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
