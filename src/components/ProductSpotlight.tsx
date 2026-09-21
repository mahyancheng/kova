import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ImageSlot } from "./ImageSlot";
import { Reveal } from "./Reveal";
import { useT } from "@/lib/i18n";
import { useRoutes } from "@/lib/routes";

export type ProductSpotlightProps = {
  id: string;
  number: string;
  name: string;
  /**
   * The page's real H1 — the product's plain name ("Roller Blinds Malaysia").
   * Set bold and upright; the italic tagline below it is a subhead, not a
   * heading, so each brochure page has exactly one H1 carrying its term.
   */
  h1: string;
  taglineA: string;
  taglineB: string;
  body: string[];
  features: { title: string; detail: string; bullets?: string[] }[];
  perfectFor: string[];
  /** Optional per-product overrides for the "why people choose it" block. */
  whyEyebrow?: string;
  whyTitleA?: string;
  whyTitleB?: string;
  whyDek?: string;
  whyPipeline?: string[];
  detailCaption: string;
  detailSrc?: string;
  Detail?: (props: { className?: string }) => ReactNode;
  reverse?: boolean;
  tone?: "cream" | "paper" | "ink";
  figureCaption?: string;
  priority?: boolean;
};

export function ProductSpotlight({
  id,
  number,
  name,
  h1,
  taglineA,
  taglineB,
  body,
  features,
  perfectFor,
  whyEyebrow,
  whyTitleA,
  whyTitleB,
  whyDek,
  whyPipeline,
  detailCaption,
  detailSrc,
  Detail,
  reverse,
  tone = "cream",
  priority = false, // 决定是否为首屏 LCP 核心组件
}: ProductSpotlightProps) {
  const t = useT();
  const r = useRoutes();
  const c = t.productCommon;
  const isInk = tone === "ink";
  const sectionBg =
    tone === "ink"
      ? "bg-[var(--color-ink)] text-[var(--color-cream)]"
      : tone === "paper"
        ? "bg-[var(--color-paper)]"
        : "bg-[var(--color-cream)]";

  /*
   * H1 = the product name, bold and upright (the term the page ranks for).
   * The italic line underneath is the tagline, demoted from <h1> to a
   * subhead so it still reads as display type without competing for the
   * page's single heading.
   */
  const Heading = (
    <>
      <h1
        className={cn(
          "headline fluid-h2 font-bold not-italic",
          isInk ? "text-[var(--color-cream)]" : "text-[var(--color-ink)]",
        )}
      >
        {h1}
      </h1>
      <p
        className={cn(
          "headline mt-2 lg:mt-3 italic font-light text-[clamp(1.25rem,0.95rem+1.6vw,2.4rem)] leading-[1.1]",
          isInk ? "text-[var(--color-clay-light)]" : "text-[var(--color-clay-deep)]",
        )}
      >
        {taglineB ? `${taglineA} ${taglineB}` : taglineA}
      </p>
    </>
  );

  // 🌟 将内部的大图抽离成一个复用的 JSX 块
  const ProductImage = (
    <ImageSlot
      ratio="4/5"
      tone={isInk ? "ink" : "cream"}
      src={detailSrc}
      alt={`${name}`}
      caption={detailCaption}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      width={960}
      height={1200}
    >
      {Detail ? <Detail className="w-full h-full" /> : undefined}
    </ImageSlot>
  );

  return (
    <section
      id={id}
      className={cn(
        "relative border-t",
        isInk ? "border-white/10" : "border-[var(--color-line)]",
        sectionBg,
      )}
    >
      <div className="max-w-[1240px] mx-auto px-5 sm:px-6 lg:px-10 pt-[clamp(2.5rem,1.5rem+4vw,5rem)]">
        <Reveal>
          <p className={cn("eyebrow", isInk && "!text-[var(--color-sand)]")}>
            <span className={isInk ? "text-[var(--color-clay-light)]" : "text-[var(--color-clay)]"}>{number}</span>
            <span className={cn("mx-2", isInk ? "text-white/30" : "text-[var(--color-line)]")}>/</span>
            {name}
          </p>
        </Reveal>
      </div>

      <div className="max-w-[1240px] mx-auto px-5 sm:px-6 lg:px-10 pt-[clamp(1rem,0.5rem+1.5vw,2.5rem)] pb-[clamp(1.5rem,1rem+2.5vw,3rem)]">
        <div className={cn("grid lg:grid-cols-12 gap-5 lg:gap-12 items-end", reverse && "lg:[&>div:first-child]:order-2")}>
          <div className="lg:col-span-7 -translate-y-1 lg:-translate-y-24">
            {/* 🌟 优化：如果是首屏，标题也使用纯 CSS 动画瞬间显示 */}
            {priority ? (
              <div className="animate-slide-up delay-100">{Heading}</div>
            ) : (
              <Reveal>{Heading}</Reveal>
            )}
          </div>

          <div className="lg:col-span-5">
            {/* 🌟 优化：如果是首屏，文字部分也使用纯 CSS 动画 */}
            {priority ? (
              <div className="animate-slide-up delay-200">
                <div className={cn("space-y-3 lg:space-y-4 fluid-body", isInk ? "text-[var(--color-cream)]/80" : "text-[var(--color-ink-soft)]")}>
                  {body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <div className="mt-5 lg:mt-7 flex flex-wrap items-center gap-2 lg:gap-3">
                  <Link
                    to={r.contact}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 lg:px-5 py-2.5 rounded-full text-[0.86rem] lg:text-[0.9rem] font-medium transition-colors",
                      isInk
                        ? "bg-[var(--color-clay)] text-[var(--color-cream)] hover:bg-[var(--color-clay-deep)]"
                        : "bg-[var(--color-ink)] text-[var(--color-cream)] hover:bg-[var(--color-clay-deep)]",
                    )}
                  >
                    {c.ctaA}
                    <span aria-hidden>→</span>
                  </Link>
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
              </div>
            ) : (
              <Reveal delay={100}>
                <div className={cn("space-y-3 lg:space-y-4 fluid-body", isInk ? "text-[var(--color-cream)]/80" : "text-[var(--color-ink-soft)]")}>
                  {body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <div className="mt-5 lg:mt-7 flex flex-wrap items-center gap-2 lg:gap-3">
                  <Link
                    to={r.contact}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 lg:px-5 py-2.5 rounded-full text-[0.86rem] lg:text-[0.9rem] font-medium transition-colors",
                      isInk
                        ? "bg-[var(--color-clay)] text-[var(--color-cream)] hover:bg-[var(--color-clay-deep)]"
                        : "bg-[var(--color-ink)] text-[var(--color-cream)] hover:bg-[var(--color-clay-deep)]",
                    )}
                  >
                    {c.ctaA}
                    <span aria-hidden>→</span>
                  </Link>
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
            )}
          </div>
        </div>
      </div>

      <div id={`${id}-spec`} className="max-w-[1240px] mx-auto px-5 sm:px-6 lg:px-10 pb-[clamp(2.5rem,1.5rem+4vw,6rem)]">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-16">
          <div className="lg:col-span-5 lg:sticky lg:top-28 self-start">
            {/* 🌟 核心修复！LCP 解绑：如果是首屏，只包裹一个瞬间加载的纯 CSS 动画 */}
            {priority ? (
              <div className="animate-slide-up delay-300">
                {ProductImage}
              </div>
            ) : (
              <Reveal>
                {ProductImage}
              </Reveal>
            )}
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <p className={cn("eyebrow", isInk && "!text-[var(--color-sand)]")}>
                {whyEyebrow ?? c.whyEyebrow}
              </p>
              <h2 className={cn("mt-3 lg:mt-4 headline fluid-h4", isInk ? "text-[var(--color-cream)]" : "text-[var(--color-ink)]")}>
                {whyTitleA ?? c.whyTitle}
                {whyTitleB && (
                  <span
                    className={cn(
                      "italic font-light",
                      isInk ? "text-[var(--color-clay-light)]" : "text-[var(--color-clay-deep)]",
                    )}
                  >
                    {" "}
                    {whyTitleB}
                  </span>
                )}
              </h2>
              {whyDek && (
                <p
                  className={cn(
                    "mt-4 fluid-body max-w-[62ch]",
                    isInk ? "text-[var(--color-cream)]/70" : "text-[var(--color-muted)]",
                  )}
                >
                  {whyDek}
                </p>
              )}
              {whyPipeline && (
                <p className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-2 font-serif text-[clamp(0.95rem,0.88rem+0.5vw,1.15rem)] tracking-tighter">
                  {whyPipeline.map((part, i) => (
                    <span key={part} className="inline-flex items-center gap-2.5">
                      {i > 0 && (
                        <span
                          aria-hidden
                          className={cn(
                            "font-sans text-[0.8rem]",
                            isInk ? "text-[var(--color-clay-light)]" : "text-[var(--color-clay)]",
                          )}
                        >
                          →
                        </span>
                      )}
                      {part}
                    </span>
                  ))}
                </p>
              )}
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
                    {f.bullets && f.bullets.length > 0 && (
                      <ul className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
                        {f.bullets.map((b) => (
                          <li
                            key={b}
                            className={cn(
                              "pl-4 relative text-[0.86rem] before:absolute before:left-0 before:top-[0.62em] before:h-[3px] before:w-[3px] before:rounded-full",
                              isInk
                                ? "text-[var(--color-cream)]/65 before:bg-[var(--color-clay-light)]"
                                : "text-[var(--color-ink-soft)] before:bg-[var(--color-clay)]",
                            )}
                          >
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
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