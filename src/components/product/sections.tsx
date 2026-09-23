import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";
import { ImageSlot } from "@/components/ImageSlot";
import { useT } from "@/lib/i18n";
import { useRoutes } from "@/lib/routes";
import { trackWhatsAppClick } from "@/lib/analytics";
import type { SwatchGroup } from "@/lib/brochure/data";

/**
 * Product page sections, expressed in the site's own design system — the
 * same primitives the home page uses: the 1240px shell, `fluid-section-y`
 * rhythm, `eyebrow` / `headline` type, `ImageSlot` paper frames, `Reveal`
 * fade-ups and the clay accent.
 *
 * Two devices are carried over from the brochure mockups because they earn
 * their keep on a long page, restyled into these tokens: the 01–12 chapter
 * numbers in the eyebrow, and the dark ink bands on the process and
 * closing sections.
 */

export type Tone = "cream" | "band" | "ink";

const SHELL = "max-w-[1240px] mx-auto px-5 sm:px-6 lg:px-10";

export function Sec({
  id, tone = "cream", children,
}: {
  id?: string; tone?: Tone; children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative fluid-section-y",
        tone === "band" && "bg-[var(--color-cream-light)] border-y border-[var(--color-line)]",
        tone === "ink" && "bg-[var(--color-ink)] text-[var(--color-cream)]",
      )}
    >
      <div className={SHELL}>{children}</div>
    </section>
  );
}

/** Chapter number + label, in the home page's eyebrow treatment. */
export function Eyebrow({ n, children, isInk }: { n?: string; children: ReactNode; isInk?: boolean }) {
  return (
    <p className={cn("eyebrow", isInk && "!text-[var(--color-sand)]")}>
      {n && (
        <>
          <span className={isInk ? "text-[var(--color-clay-light)]" : "text-[var(--color-clay)]"}>{n}</span>
          <span className={cn("mx-2", isInk ? "text-white/30" : "text-[var(--color-line)]")}>/</span>
        </>
      )}
      {children}
    </p>
  );
}

/**
 * Section header — the home page's Collection/Fabrics pattern: eyebrow and
 * headline on the left, supporting paragraph right-aligned on wide screens.
 */
export function Head({
  n, eyebrow, titleA, titleB, dek, isInk = false,
}: {
  n?: string; eyebrow: string; titleA: string; titleB?: string; dek?: string; isInk?: boolean;
}) {
  return (
    <Reveal>
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-[clamp(1.5rem,1rem+2vw,3.5rem)]">
        <div>
          <Eyebrow n={n} isInk={isInk}>{eyebrow}</Eyebrow>
          <h2
            className={cn(
              "mt-3 lg:mt-4 headline fluid-h3 max-w-2xl",
              isInk ? "text-[var(--color-cream)]" : "text-[var(--color-ink)]",
            )}
          >
            {titleA}
            {titleB && (
              <span
                className={cn(
                  "italic font-light",
                  isInk ? "text-[var(--color-clay-light)]" : "text-[var(--color-clay-deep)]",
                )}
              >
                {" "}
                {titleB}
              </span>
            )}
          </h2>
        </div>
        {dek && (
          <p
            className={cn(
              "max-w-md fluid-body leading-relaxed",
              isInk ? "text-[var(--color-cream)]/75" : "text-[var(--color-ink-soft)]",
            )}
          >
            {dek}
          </p>
        )}
      </div>
    </Reveal>
  );
}

export function Btn({
  to, children, variant = "solid", isInk = false,
}: {
  to: string; children: ReactNode; variant?: "solid" | "ghost"; isInk?: boolean;
}) {
  const base =
    "inline-flex items-center gap-2 px-5 lg:px-6 py-2.5 lg:py-3 rounded-full text-[0.88rem] font-medium transition-colors";
  const solid = isInk
    ? "bg-[var(--color-cream)] text-[var(--color-ink)] hover:bg-[var(--color-clay-light)]"
    : "bg-[var(--color-ink)] text-[var(--color-cream)] hover:bg-[var(--color-clay-deep)]";
  const ghost = isInk
    ? "border border-white/25 text-[var(--color-cream)] hover:bg-[var(--color-cream)] hover:text-[var(--color-ink)]"
    : "border border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)]";
  return (
    <Link to={to} className={cn(base, variant === "solid" ? solid : ghost)}>
      {children}
    </Link>
  );
}

/** word → word → word, in display type with a clay arrow. */
export function Pipeline({ items, isInk = false }: { items: string[]; isInk?: boolean }) {
  return (
    <p className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-2 font-serif text-[clamp(0.95rem,0.88rem+0.5vw,1.2rem)] tracking-tighter">
      {items.map((item, i) => (
        <span key={item} className="inline-flex items-center gap-2.5">
          {i > 0 && (
            <span
              aria-hidden
              className={cn("font-sans text-[0.78rem]", isInk ? "text-[var(--color-clay-light)]" : "text-[var(--color-clay)]")}
            >
              →
            </span>
          )}
          {item}
        </span>
      ))}
    </p>
  );
}

/* ------------------------------------------------------------------ *
 * 01 — hero (the home page's two-column hero, framed photo on the right)
 * ------------------------------------------------------------------ */

export function Hero({
  n, eyebrow, h1, subhead, body, photo, caption,
}: {
  n: string; eyebrow: string; h1: string; subhead: string; body: string[];
  photo: { src: string; srcSet?: string };
  caption: string;
}) {
  const t = useT();
  const r = useRoutes();
  const c = t.productPages.common;
  return (
    <section className="relative pt-[clamp(2.5rem,1.5rem+3vw,5rem)] pb-[clamp(2.5rem,1.5rem+3.5vw,5.5rem)]">
      <div className={SHELL}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_.95fr] gap-[clamp(2rem,1rem+3vw,4.5rem)] items-center">
          <div className="order-2 lg:order-1">
            <Reveal>
              <Eyebrow n={n}>{eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              {/* The page's single H1 — the product name, bold and upright. */}
              <h1 className="mt-3 lg:mt-4 headline fluid-h2 font-bold not-italic text-[var(--color-ink)]">
                {h1}
              </h1>
              <p className="mt-2 lg:mt-3 headline italic font-light text-[clamp(1.2rem,0.95rem+1.25vw,2rem)] leading-[1.15] text-[var(--color-clay-deep)]">
                {subhead}
              </p>
            </Reveal>
            <Reveal delay={150}>
              <div className="mt-5 lg:mt-6 space-y-3 lg:space-y-4 max-w-[58ch] fluid-body text-[var(--color-ink-soft)]">
                {body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Reveal>
            <Reveal delay={220}>
              <div className="mt-6 lg:mt-8 flex flex-wrap items-center gap-2 lg:gap-3">
                <Btn to={r.contact}>
                  {c.heroCtaA}
                  <span aria-hidden>→</span>
                </Btn>
                <a
                  href="#price"
                  className="inline-flex items-center gap-2 px-5 lg:px-6 py-2.5 lg:py-3 rounded-full border border-[var(--color-ink)] text-[0.88rem] font-medium text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)] transition-colors"
                >
                  {c.heroCtaB}
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120} className="order-1 lg:order-2">
            <figure className="m-0 bg-[var(--color-paper)] border border-[var(--color-line)] rounded-lg p-3.5 pb-0 shadow-[0_1px_2px_rgba(34,32,28,.04),0_12px_28px_-18px_rgba(34,32,28,.28)]">
              <ImageSlot
                ratio="5/4"
                tone="sand"
                priority
                src={photo.src}
                srcSet={photo.srcSet}
                sizes="(min-width: 1024px) 560px, 100vw"
                alt={caption}
              />
              <figcaption className="px-0.5 pt-3 pb-3.5 text-[0.68rem] tracking-[0.12em] uppercase text-[var(--color-muted)]">
                {caption}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Why — reasons list
 * ------------------------------------------------------------------ */

type Reason = { title: string; body: string; bullets: string[] };

export function Why({
  n, tone = "band", data, extra,
}: {
  n: string;
  tone?: Tone;
  data: { eyebrow: string; titleA: string; titleB: string; dek: string; items: Reason[]; pipeline?: string[] };
  extra?: ReactNode;
}) {
  return (
    <Sec tone={tone}>
      <Head n={n} eyebrow={data.eyebrow} titleA={data.titleA} titleB={data.titleB} dek={data.dek} />
      {data.pipeline && (
        <Reveal>
          <div className="-mt-[clamp(0.5rem,1vw,1.5rem)] mb-[clamp(1.5rem,1rem+1.5vw,2.5rem)]">
            <Pipeline items={data.pipeline} />
          </div>
        </Reveal>
      )}
      <ol className="grid lg:grid-cols-2 gap-x-10 gap-y-0">
        {data.items.map((item, i) => (
          <Reveal key={item.title} delay={(i % 2) * 60}>
            <li className="py-5 lg:py-6 border-t border-[var(--color-line)]">
              <h3 className="font-serif text-[clamp(1.05rem,0.95rem+0.5vw,1.3rem)] leading-snug tracking-tight text-[var(--color-ink)]">
                {item.title}
              </h3>
              <p className="mt-2 text-[clamp(0.88rem,0.84rem+0.2vw,0.98rem)] leading-relaxed text-[var(--color-muted)] max-w-prose">
                {item.body}
              </p>
              {item.bullets.length > 0 && (
                <ul className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
                  {item.bullets.map((b) => (
                    <li
                      key={b}
                      className="pl-4 relative text-[0.88rem] text-[var(--color-ink-soft)] before:absolute before:left-0 before:top-[0.62em] before:h-[3px] before:w-[3px] before:rounded-full before:bg-[var(--color-clay)]"
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
      {extra}
    </Sec>
  );
}

/* ------------------------------------------------------------------ *
 * Swatch / finish library — the home page's fabric tile treatment
 * ------------------------------------------------------------------ */

export function SwatchLibrary({
  n, tone = "band", data, groups,
}: {
  n: string;
  tone?: Tone;
  data: { eyebrow: string; titleA: string; titleB: string; dek: string };
  groups: SwatchGroup[];
}) {
  return (
    <Sec id="swatches" tone={tone}>
      <Head n={n} eyebrow={data.eyebrow} titleA={data.titleA} titleB={data.titleB} dek={data.dek} />
      {groups.map((group) => (
        <div key={group.label} className="mt-8 first:mt-0">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              {group.label}
              <span aria-hidden className="flex-1 h-px bg-[var(--color-line)]" />
            </p>
          </Reveal>
          <ul className="mt-4 lg:mt-5 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3 lg:gap-4">
            {group.items.map((s, i) => (
              <Reveal key={`${group.label}-${s.name}`} delay={i * 30}>
                <li>
                  <div
                    className="relative aspect-[4/5] rounded border border-[var(--color-line)] overflow-hidden"
                    style={{ backgroundColor: s.hex }}
                  >
                    {s.image ? (
                      <img
                        src={s.image}
                        alt={`${s.name} — ${s.sub}`}
                        loading="lazy"
                        decoding="async"
                        width={240}
                        height={300}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <span
                        aria-hidden
                        className="absolute inset-0"
                        style={{
                          backgroundImage:
                            "repeating-linear-gradient(0deg, rgba(0,0,0,0.10) 0 1px, transparent 1px 9px)",
                        }}
                      />
                    )}
                  </div>
                  <h3 className="mt-2 font-serif text-[0.78rem] leading-tight tracking-tight text-[var(--color-ink)]">
                    {s.name}
                  </h3>
                  <p className="mt-0.5 text-[0.56rem] tracking-wide uppercase text-[var(--color-clay-deep)]">
                    {s.sub}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      ))}
    </Sec>
  );
}

/* ------------------------------------------------------------------ *
 * Rooms
 * ------------------------------------------------------------------ */

type RoomItem = { title: string; body: string[]; rec: string; best: string };

export function Rooms({
  n, tone = "cream", data,
}: {
  n: string;
  tone?: Tone;
  data: { eyebrow: string; titleA: string; titleB: string; dek: string; items: RoomItem[] };
}) {
  const t = useT();
  const c = t.productPages.common;
  return (
    <Sec id="rooms" tone={tone}>
      <Head n={n} eyebrow={data.eyebrow} titleA={data.titleA} titleB={data.titleB} dek={data.dek} />
      <div>
        {data.items.map((room, i) => (
          <Reveal key={room.title} delay={i * 50}>
            <div className="grid lg:grid-cols-12 gap-3 lg:gap-8 py-6 lg:py-7 border-t border-[var(--color-line)] last:border-b">
              <h3 className="lg:col-span-3 font-serif text-[clamp(1.05rem,0.95rem+0.5vw,1.3rem)] leading-snug tracking-tight text-[var(--color-ink)]">
                {room.title}
              </h3>
              <div className="lg:col-span-6 space-y-2.5 text-[clamp(0.88rem,0.84rem+0.2vw,0.98rem)] leading-relaxed text-[var(--color-muted)]">
                {room.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <div className="lg:col-span-3 text-[0.88rem] text-[var(--color-ink)]">
                <p className="eyebrow">{c.recommendedLabel}</p>
                <p className="mt-1">{room.rec}</p>
                {room.best && (
                  <>
                    <p className="eyebrow mt-3">{c.bestForLabel}</p>
                    <p className="mt-1">{room.best}</p>
                  </>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Sec>
  );
}

/* ------------------------------------------------------------------ *
 * Price
 * ------------------------------------------------------------------ */

export function Price({
  n, tone = "band", data,
}: {
  n: string;
  tone?: Tone;
  data: {
    eyebrow: string; titleA: string; titleB: string; dek: string; cta: string;
    factors: { title: string; body: string }[];
    closerTitle: string; closerBody: string; closerPipeline?: string[];
  };
}) {
  const r = useRoutes();
  return (
    <Sec id="price" tone={tone}>
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        <div className="lg:col-span-5 lg:sticky lg:top-28 self-start">
          <Reveal>
            <Eyebrow n={n}>{data.eyebrow}</Eyebrow>
            <h2 className="mt-3 lg:mt-4 headline fluid-h3 text-[var(--color-ink)]">
              {data.titleA}
              <span className="italic font-light text-[var(--color-clay-deep)]"> {data.titleB}</span>
            </h2>
            <p className="mt-4 lg:mt-5 fluid-body text-[var(--color-ink-soft)] max-w-md leading-relaxed">
              {data.dek}
            </p>
            <div className="mt-6">
              <Btn to={r.contact}>
                {data.cta}
                <span aria-hidden>→</span>
              </Btn>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7 grid sm:grid-cols-2 gap-x-7 gap-y-6">
          {data.factors.map((f, i) => (
            <Reveal key={f.title} delay={i * 40}>
              <div className="pt-4 border-t border-[var(--color-line)]">
                <h3 className="font-serif text-[clamp(1.05rem,0.95rem+0.5vw,1.3rem)] leading-snug tracking-tight text-[var(--color-ink)]">{f.title}</h3>
                <p className="mt-1.5 text-[0.88rem] leading-relaxed text-[var(--color-muted)]">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal>
        <div className="mt-10 lg:mt-14 pt-8 lg:pt-10 border-t border-[var(--color-line)] grid lg:grid-cols-12 gap-5 lg:gap-16 items-start">
          <h3 className="lg:col-span-5 font-serif text-[clamp(1.05rem,0.95rem+0.5vw,1.3rem)] leading-snug tracking-tight text-[var(--color-ink)]">
            {data.closerTitle}
          </h3>
          <div className="lg:col-span-7">
            <p className="fluid-body text-[var(--color-ink-soft)] leading-relaxed">{data.closerBody}</p>
            {data.closerPipeline && <Pipeline items={data.closerPipeline} />}
          </div>
        </div>
      </Reveal>
    </Sec>
  );
}

/* ------------------------------------------------------------------ *
 * Made-to-measure steps (ink band)
 * ------------------------------------------------------------------ */

type Step = { title: string; body: string; said: string; bullets: string[] };

export function Steps({
  n, data,
}: {
  n: string;
  data: { eyebrow: string; titleA: string; titleB: string; dek: string; items: Step[] };
}) {
  const t = useT();
  const r = useRoutes();
  const c = t.productPages.common;
  return (
    <Sec id="process" tone="ink">
      <Head n={n} eyebrow={data.eyebrow} titleA={data.titleA} titleB={data.titleB} dek={data.dek} isInk />
      <div>
        {data.items.map((step, i) => (
          <Reveal key={step.title} delay={i * 50}>
            <div className="grid lg:grid-cols-12 gap-3 lg:gap-8 py-6 lg:py-7 border-t border-white/10 last:border-b">
              <p className="lg:col-span-1 font-serif text-[0.78rem] text-[var(--color-clay-light)] pt-1">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="lg:col-span-4 font-serif text-[clamp(1.05rem,0.95rem+0.5vw,1.3rem)] leading-snug tracking-tight text-[var(--color-cream)]">
                {step.title}
              </h3>
              <div className="lg:col-span-7">
                <p className="text-[clamp(0.88rem,0.84rem+0.2vw,0.98rem)] leading-relaxed text-[var(--color-cream)]/70">
                  {step.body}
                </p>
                {step.bullets.length > 0 && (
                  <ul className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
                    {step.bullets.map((b) => (
                      <li
                        key={b}
                        className="pl-4 relative text-[0.88rem] text-[var(--color-cream)]/65 before:absolute before:left-0 before:top-[0.62em] before:h-[3px] before:w-[3px] before:rounded-full before:bg-[var(--color-clay-light)]"
                      >
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                {step.said && (
                  <p className="mt-3 font-serif italic text-[0.98rem] leading-relaxed text-[var(--color-sand)]">
                    {step.said}
                  </p>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <div className="mt-8">
          <Btn to={r.contact} isInk>
            {c.stepsCta}
            <span aria-hidden>→</span>
          </Btn>
        </div>
      </Reveal>
    </Sec>
  );
}

/* ------------------------------------------------------------------ *
 * Motorisation
 * ------------------------------------------------------------------ */

export function Motorised({
  n, tone = "band", data,
}: {
  n: string;
  tone?: Tone;
  data: {
    eyebrow: string; titleA: string; titleB: string; dek: string; cta: string;
    lede: string; items: { title: string; body: string }[]; note: string;
  };
}) {
  const r = useRoutes();
  return (
    <Sec id="motorised" tone={tone}>
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow n={n}>{data.eyebrow}</Eyebrow>
            <h2 className="mt-3 lg:mt-4 headline fluid-h3 text-[var(--color-ink)]">
              {data.titleA}
              <span className="italic font-light text-[var(--color-clay-deep)]"> {data.titleB}</span>
            </h2>
            <p className="mt-4 lg:mt-5 fluid-body text-[var(--color-ink-soft)] max-w-md leading-relaxed">
              {data.dek}
            </p>
            <div className="mt-6">
              <Btn to={r.contact} variant="ghost">
                {data.cta}
              </Btn>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal>
            <p className="fluid-body text-[var(--color-ink-soft)] max-w-[60ch] leading-relaxed">{data.lede}</p>
          </Reveal>
          <div className="mt-6">
            {data.items.map((item, i) => (
              <Reveal key={item.title} delay={i * 40}>
                <div className="grid sm:grid-cols-12 gap-1 sm:gap-6 py-4 border-t border-[var(--color-line)] last:border-b">
                  <h3 className="sm:col-span-5 font-serif text-[clamp(1.05rem,0.95rem+0.5vw,1.3rem)] leading-snug tracking-tight text-[var(--color-ink)]">
                    {item.title}
                  </h3>
                  <p className="sm:col-span-7 text-[0.88rem] leading-relaxed text-[var(--color-muted)]">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-5 fluid-body text-[var(--color-muted)] max-w-[62ch] leading-relaxed">{data.note}</p>
          </Reveal>
        </div>
      </div>
    </Sec>
  );
}

/* ------------------------------------------------------------------ *
 * Care
 * ------------------------------------------------------------------ */

export function Care({
  n, tone = "cream", data,
}: {
  n: string;
  tone?: Tone;
  data: { eyebrow: string; titleA: string; titleB: string; dek: string; items: Reason[] };
}) {
  return (
    <Sec id="care" tone={tone}>
      <Head n={n} eyebrow={data.eyebrow} titleA={data.titleA} titleB={data.titleB} dek={data.dek} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {data.items.map((item, i) => (
          <Reveal key={item.title} delay={i * 50}>
            <div className="pl-5 border-l-2 border-[var(--color-line)]">
              <h3 className="font-serif text-[clamp(1.05rem,0.95rem+0.5vw,1.3rem)] leading-snug tracking-tight text-[var(--color-ink)]">
                {item.title}
              </h3>
              <p className="mt-2 text-[0.88rem] leading-relaxed text-[var(--color-muted)]">{item.body}</p>
              {item.bullets.length > 0 && (
                <ul className="mt-2.5 space-y-1">
                  {item.bullets.map((b) => (
                    <li
                      key={b}
                      className="pl-4 relative text-[0.88rem] text-[var(--color-ink-soft)] before:absolute before:left-0 before:top-[0.62em] before:h-[3px] before:w-[3px] before:rounded-full before:bg-[var(--color-clay)]"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </Sec>
  );
}

/* ------------------------------------------------------------------ *
 * FAQ — the home page's button toggle, plus FAQPage structured data
 * ------------------------------------------------------------------ */

export function Faq({
  n, tone = "band", data,
}: {
  n: string;
  tone?: Tone;
  data: { eyebrow: string; titleA: string; titleB: string; items: { q: string; a: string }[] };
}) {
  const [open, setOpen] = useState<number | null>(0);
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <Sec id="faq" tone={tone}>
      {/* Inline so the answers ship in the prerendered HTML; visible copy
          and schema read from the same array and cannot drift. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="grid lg:grid-cols-12 gap-7 lg:gap-16">
        <div className="lg:col-span-4">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <Eyebrow n={n}>{data.eyebrow}</Eyebrow>
              <h2 className="mt-3 lg:mt-4 headline fluid-h3 text-[var(--color-ink)]">
                {data.titleA}
                <span className="italic font-light text-[var(--color-clay-deep)]"> {data.titleB}</span>
              </h2>
            </div>
          </Reveal>
        </div>

        <ul className="lg:col-span-8 border-t border-[var(--color-line)]">
          {data.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 30}>
                <li className="border-b border-[var(--color-line)]">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-start justify-between gap-4 text-left py-5 lg:py-7 group"
                  >
                    <span className="font-serif text-[clamp(1.05rem,0.95rem+0.5vw,1.3rem)] leading-snug text-[var(--color-ink)] group-hover:text-[var(--color-clay-deep)] transition-colors">
                      {item.q}
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "shrink-0 mt-1.5 text-[var(--color-clay)] transition-transform",
                        isOpen && "rotate-45",
                      )}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-[max-height,opacity] duration-300 ease-out",
                      isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0",
                    )}
                  >
                    <p className="pb-5 lg:pb-7 pr-8 text-[clamp(0.92rem,0.88rem+0.2vw,1.02rem)] leading-relaxed text-[var(--color-ink-soft)] max-w-prose">
                      {item.a}
                    </p>
                  </div>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </Sec>
  );
}

/* ------------------------------------------------------------------ *
 * Closing band (ink)
 * ------------------------------------------------------------------ */

export function Closing({
  n, data, waMessage,
}: {
  n: string;
  data: {
    eyebrow: string; titleA: string; titleB: string; dek: string;
    pipeline: string[]; pullquote: string; note: string;
  };
  waMessage: string;
}) {
  const t = useT();
  const c = t.productPages.common;
  const waUrl = `https://wa.me/60179778289?text=${encodeURIComponent(waMessage)}`;
  return (
    <Sec id="quote" tone="ink">
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow n={n} isInk>{data.eyebrow}</Eyebrow>
            <h2 className="mt-3 lg:mt-4 headline fluid-h3 text-[var(--color-cream)]">
              {data.titleA}
              <span className="italic font-light text-[var(--color-clay-light)]"> {data.titleB}</span>
            </h2>
            <p className="mt-4 lg:mt-5 fluid-body text-[var(--color-cream)]/75 max-w-[62ch] leading-relaxed">
              {data.dek}
            </p>
            <Pipeline items={data.pipeline} isInk />
            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackWhatsAppClick}
                className="inline-flex items-center gap-2 px-5 lg:px-6 py-2.5 lg:py-3 rounded-full bg-[#25D366] text-[#08301A] text-[0.88rem] font-medium hover:opacity-90 transition-opacity"
              >
                {c.ctaWhatsApp}
              </a>
              <a
                href="mailto:info@kovasunshade.com"
                className="inline-flex items-center gap-2 px-5 lg:px-6 py-2.5 lg:py-3 rounded-full border border-white/25 text-[var(--color-cream)] text-[0.88rem] font-medium hover:bg-[var(--color-cream)] hover:text-[var(--color-ink)] transition-colors"
              >
                {c.ctaEmail}
              </a>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-5">
          <Reveal delay={80}>
            <p className="font-serif italic text-[clamp(1.25rem,1rem+1.2vw,1.85rem)] leading-tight tracking-tighter text-[var(--color-sand)]">
              {data.pullquote}
            </p>
            <p className="mt-4 lg:mt-5 fluid-body text-[var(--color-cream)]/70 leading-relaxed">{data.note}</p>
            <div className="mt-7 pt-6 border-t border-white/10 text-[0.88rem] leading-relaxed text-[var(--color-cream)]/70">
              <p>{c.studioLine}</p>
              <p>{c.hoursLine}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </Sec>
  );
}
