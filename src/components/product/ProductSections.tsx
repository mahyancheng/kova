import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Reveal } from "../Reveal";
import { useT } from "@/lib/i18n";
import { useRoutes } from "@/lib/routes";
import { trackWhatsAppClick } from "@/lib/analytics";

/**
 * Long-form brochure sections shared by the three product pages.
 *
 * Every section here is content-driven: the copy lives in i18n under
 * `productPages.<product>`, and each page composes the sections it needs
 * in the order the brochure runs. Nothing in this file invents design —
 * it reuses the site's existing shell width, eyebrow, serif headline with
 * an italic second half, hairline rules and clay accent, so a new section
 * reads as part of the same page as the spotlight above it.
 *
 * `n` is the section number shown in the eyebrow ("04 / Room by room").
 * It's passed in rather than computed so a page can reorder or skip a
 * section without the numbering drifting away from the design.
 */

const SHELL = "max-w-[1240px] mx-auto px-5 sm:px-6 lg:px-10";

export type Tone = "cream" | "paper" | "ink";

type Reason = { title: string; body: string; bullets: string[] };
type Head = { eyebrow: string; titleA: string; titleB: string; dek: string };
type RoomItem = { title: string; body: string[]; rec: string; best: string };
type Factor = { title: string; body: string };
type Step = { title: string; body: string; said: string; bullets: string[] };
type QA = { q: string; a: string };

function bg(tone: Tone) {
  return tone === "ink"
    ? "bg-[var(--color-ink)] text-[var(--color-cream)]"
    : tone === "paper"
      ? "bg-[var(--color-paper)]"
      : "bg-[var(--color-cream)]";
}

function Section({
  id,
  tone = "cream",
  className,
  children,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "fluid-section-y border-t",
        tone === "ink" ? "border-white/10" : "border-[var(--color-line)]",
        bg(tone),
        className,
      )}
    >
      <div className={SHELL}>{children}</div>
    </section>
  );
}

function Eyebrow({ n, label, isInk }: { n: string; label: string; isInk: boolean }) {
  return (
    <p className={cn("eyebrow", isInk && "!text-[var(--color-sand)]")}>
      <span className={isInk ? "text-[var(--color-clay-light)]" : "text-[var(--color-clay)]"}>
        {n}
      </span>
      <span className={cn("mx-2", isInk ? "text-white/30" : "text-[var(--color-line)]")}>/</span>
      {label}
    </p>
  );
}

function Title({
  titleA,
  titleB,
  isInk,
  className,
}: {
  titleA: string;
  titleB: string;
  isInk: boolean;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "mt-3 lg:mt-4 font-serif text-[clamp(1.55rem,1.1rem+1.8vw,2.4rem)] leading-[1.08] tracking-tighter",
        isInk ? "text-[var(--color-cream)]" : "text-[var(--color-ink)]",
        className,
      )}
    >
      {titleA}{" "}
      <span
        className={cn(
          "italic font-light",
          isInk ? "text-[var(--color-clay-light)]" : "text-[var(--color-clay-deep)]",
        )}
      >
        {titleB}
      </span>
    </h2>
  );
}

function Dek({ children, isInk, className }: { children: React.ReactNode; isInk: boolean; className?: string }) {
  return (
    <p
      className={cn(
        "mt-4 lg:mt-5 fluid-body max-w-[62ch]",
        isInk ? "text-[var(--color-cream)]/70" : "text-[var(--color-muted)]",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** Pipeline motif: word → word → word, in display type with clay arrows. */
function Pipeline({ items, isInk }: { items: string[]; isInk: boolean }) {
  return (
    <p className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-2 font-serif text-[clamp(0.95rem,0.88rem+0.5vw,1.2rem)] tracking-tighter">
      {items.map((item, i) => (
        <span key={item} className="inline-flex items-center gap-2.5">
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
          {item}
        </span>
      ))}
    </p>
  );
}

function PillLink({
  to,
  children,
  isInk,
  variant = "solid",
}: {
  to: string;
  children: React.ReactNode;
  isInk: boolean;
  variant?: "solid" | "ghost";
}) {
  const solid = isInk
    ? "bg-[var(--color-cream)] text-[var(--color-ink)] hover:bg-[var(--color-clay-light)]"
    : "bg-[var(--color-ink)] text-[var(--color-cream)] hover:bg-[var(--color-clay-deep)]";
  const ghost = isInk
    ? "border border-white/25 text-[var(--color-cream)] hover:bg-[var(--color-cream)] hover:text-[var(--color-ink)]"
    : "border border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-cream)]";
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[0.9rem] font-medium transition-colors",
        variant === "solid" ? solid : ghost,
      )}
    >
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------ *
 * Roller — blackout / dim-out / sunscreen comparison + fabric cards
 * ------------------------------------------------------------------ */

type FabricGuide = Head & {
  tableCaption: string;
  headers: string[];
  rows: {
    name: string;
    light: number;
    lightNote: string;
    privacy: number;
    privacyNote: string;
    best: string;
  }[];
  cards: { q: string; title: string; body: string[]; tags: string }[];
};

/** Five-bar meter — a filled bar per level, out of five. */
function Meter({ level }: { level: number }) {
  return (
    <span className="flex gap-[3px] mb-1.5" aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={cn(
            "block w-4 h-[5px] rounded-[2px]",
            i <= level ? "bg-[var(--color-clay)]" : "bg-[var(--color-line)]",
          )}
        />
      ))}
    </span>
  );
}

export function ProductFabricTable({
  n,
  tone = "cream",
  data,
}: {
  n: string;
  tone?: Tone;
  data: FabricGuide;
}) {
  const isInk = tone === "ink";
  return (
    <Section id="fabric" tone={tone}>
      <div className="grid lg:grid-cols-12 gap-6 lg:gap-16 items-start">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow n={n} label={data.eyebrow} isInk={isInk} />
            <Title titleA={data.titleA} titleB={data.titleB} isInk={isInk} />
          </Reveal>
        </div>
        <div className="lg:col-span-7">
          <Reveal>
            <Dek isInk={isInk} className="mt-0">
              {data.dek}
            </Dek>
          </Reveal>
        </div>
      </div>

      <Reveal>
        <div className="mt-9 lg:mt-12 overflow-x-auto rounded-[6px] border border-[var(--color-line)] bg-[var(--color-paper)]">
          <table className="w-full min-w-[560px] border-collapse text-[0.9rem]">
            <caption className="sr-only">{data.tableCaption}</caption>
            <thead>
              <tr>
                {data.headers.map((h) => (
                  <th
                    key={h}
                    scope="col"
                    className="text-left align-top px-4 py-3.5 bg-[var(--color-cream-light)] border-b border-[var(--color-line)] eyebrow"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, i) => (
                <tr key={row.name}>
                  <th
                    scope="row"
                    className={cn(
                      "text-left align-top px-4 py-4 font-serif text-[1.05rem] font-normal tracking-tighter whitespace-nowrap text-[var(--color-ink)]",
                      i < data.rows.length - 1 && "border-b border-[var(--color-line-soft)]",
                    )}
                  >
                    {row.name}
                  </th>
                  <td
                    className={cn(
                      "align-top px-4 py-4 text-[var(--color-ink-soft)]",
                      i < data.rows.length - 1 && "border-b border-[var(--color-line-soft)]",
                    )}
                  >
                    <Meter level={row.light} />
                    {row.lightNote}
                  </td>
                  <td
                    className={cn(
                      "align-top px-4 py-4 text-[var(--color-ink-soft)]",
                      i < data.rows.length - 1 && "border-b border-[var(--color-line-soft)]",
                    )}
                  >
                    <Meter level={row.privacy} />
                    {row.privacyNote}
                  </td>
                  <td
                    className={cn(
                      "align-top px-4 py-4 text-[var(--color-ink-soft)]",
                      i < data.rows.length - 1 && "border-b border-[var(--color-line-soft)]",
                    )}
                  >
                    {row.best}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <div className="mt-8 lg:mt-12 grid md:grid-cols-3 gap-5 lg:gap-7">
        {data.cards.map((card, i) => (
          <Reveal key={card.title} delay={i * 60}>
            <article className="h-full flex flex-col rounded-[6px] border border-[var(--color-line)] bg-[var(--color-paper)] p-6">
              <p className="font-serif italic text-[0.98rem] text-[var(--color-clay-deep)]">
                {card.q}
              </p>
              <h3 className="mt-2 font-serif text-[1.2rem] leading-tight tracking-tighter text-[var(--color-ink)]">
                {card.title}
              </h3>
              <div className="mt-3 space-y-2.5 text-[0.9rem] leading-relaxed text-[var(--color-muted)]">
                {card.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <p className="mt-auto pt-4 mt-5 border-t border-[var(--color-line-soft)] text-[0.72rem] tracking-[0.08em] uppercase text-[var(--color-muted)]">
                {card.tags}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ *
 * Venetian — one window through four hours of the day
 * ------------------------------------------------------------------ */

export function ProductClock({
  data,
  tone = "paper",
}: {
  data: { label: string; items: { time: string; note: string }[] };
  tone?: Tone;
}) {
  const isInk = tone === "ink";
  return (
    <Section tone={tone}>
      <Reveal>
        <p className={cn("eyebrow", isInk && "!text-[var(--color-sand)]")}>{data.label}</p>
      </Reveal>
      <div className="mt-6 lg:mt-8 grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-7">
        {data.items.map((item, i) => (
          <Reveal key={item.time} delay={i * 60}>
            <div className="pt-4 border-t border-[var(--color-line)]">
              <p className="font-serif text-[1.15rem] tracking-tighter text-[var(--color-ink)]">
                {item.time}
              </p>
              <p className="mt-1.5 text-[0.86rem] leading-snug text-[var(--color-muted)]">
                {item.note}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ *
 * Venetian — aluminium vs timber
 * ------------------------------------------------------------------ */

type Materials = Head & {
  cards: { title: string; body: string; bullets: string[]; tags: string }[];
  picks: { title: string; body: string }[];
  note: string;
};

export function ProductMaterials({
  n,
  tone = "cream",
  data,
}: {
  n: string;
  tone?: Tone;
  data: Materials;
}) {
  const isInk = tone === "ink";
  return (
    <Section id="materials" tone={tone}>
      <div className="grid lg:grid-cols-12 gap-6 lg:gap-16 items-start">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow n={n} label={data.eyebrow} isInk={isInk} />
            <Title titleA={data.titleA} titleB={data.titleB} isInk={isInk} />
          </Reveal>
        </div>
        <div className="lg:col-span-7">
          <Reveal>
            <Dek isInk={isInk} className="mt-0">
              {data.dek}
            </Dek>
          </Reveal>
        </div>
      </div>

      <div className="mt-9 lg:mt-12 grid md:grid-cols-2 gap-5 lg:gap-7">
        {data.cards.map((card, i) => (
          <Reveal key={card.title} delay={i * 60}>
            <article className="h-full flex flex-col rounded-[6px] border border-[var(--color-line)] bg-[var(--color-paper)] p-6 lg:p-7">
              <h3 className="font-serif text-[1.25rem] leading-tight tracking-tighter text-[var(--color-ink)]">
                {card.title}
              </h3>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-[var(--color-muted)]">
                {card.body}
              </p>
              <ul className="mt-4 space-y-1.5">
                {card.bullets.map((b) => (
                  <li
                    key={b}
                    className="pl-4 relative text-[0.88rem] text-[var(--color-ink-soft)] before:absolute before:left-0 before:top-[0.62em] before:h-[3px] before:w-[3px] before:rounded-full before:bg-[var(--color-clay)]"
                  >
                    {b}
                  </li>
                ))}
              </ul>
              <p className="mt-auto pt-5 text-[0.72rem] tracking-[0.08em] uppercase text-[var(--color-muted)]">
                {card.tags}
              </p>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="mt-6 lg:mt-8 grid md:grid-cols-2 gap-5 lg:gap-7">
        {data.picks.map((pick, i) => (
          <Reveal key={pick.title} delay={i * 60}>
            <div className="rounded-[6px] border border-[var(--color-line)] border-l-[3px] border-l-[var(--color-clay)] bg-[var(--color-cream-light)] p-5 lg:p-6">
              <h3 className="font-serif text-[1.05rem] tracking-tighter text-[var(--color-ink)]">
                {pick.title}
              </h3>
              <p className="mt-1.5 text-[0.9rem] text-[var(--color-muted)]">{pick.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <Dek isInk={isInk}>{data.note}</Dek>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------------ *
 * VertiSheer — three settings, one system
 * ------------------------------------------------------------------ */

type Modes = Head & {
  cards: { title: string; body: string[]; tags: string }[];
  callout: { title: string; body: string; formula: string[] };
};

export function ProductModes({
  n,
  tone = "cream",
  data,
}: {
  n: string;
  tone?: Tone;
  data: Modes;
}) {
  const isInk = tone === "ink";
  return (
    <Section id="modes" tone={tone}>
      <div className="grid lg:grid-cols-12 gap-6 lg:gap-16 items-start">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow n={n} label={data.eyebrow} isInk={isInk} />
            <Title titleA={data.titleA} titleB={data.titleB} isInk={isInk} />
          </Reveal>
        </div>
        <div className="lg:col-span-7">
          <Reveal>
            <Dek isInk={isInk} className="mt-0">
              {data.dek}
            </Dek>
          </Reveal>
        </div>
      </div>

      <div className="mt-9 lg:mt-12 grid md:grid-cols-3 gap-5 lg:gap-7">
        {data.cards.map((card, i) => (
          <Reveal key={card.title} delay={i * 60}>
            <article className="h-full flex flex-col rounded-[6px] border border-[var(--color-line)] bg-[var(--color-paper)] p-6">
              <h3 className="font-serif text-[1.2rem] leading-tight tracking-tighter text-[var(--color-ink)]">
                {card.title}
              </h3>
              <div className="mt-3 space-y-2.5 text-[0.9rem] leading-relaxed text-[var(--color-muted)]">
                {card.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <p className="mt-auto pt-5 text-[0.72rem] tracking-[0.08em] uppercase text-[var(--color-muted)]">
                {card.tags}
              </p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-8 lg:mt-12 rounded-[6px] border border-[var(--color-line)] border-l-[3px] border-l-[var(--color-clay)] bg-[var(--color-paper)] p-6 lg:p-8">
          <h3 className="font-serif text-[1.25rem] tracking-tighter text-[var(--color-ink)]">
            {data.callout.title}
          </h3>
          <p className="mt-2.5 fluid-body max-w-[62ch] text-[var(--color-muted)]">
            {data.callout.body}
          </p>
          <p className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-2 font-serif text-[clamp(1rem,0.9rem+0.6vw,1.3rem)] tracking-tighter text-[var(--color-ink)]">
            {data.callout.formula.map((part, i) => (
              <span key={part} className="inline-flex items-center gap-2.5">
                {i > 0 && (
                  <span aria-hidden className="font-sans text-[0.8rem] text-[var(--color-clay)]">
                    +
                  </span>
                )}
                {part}
              </span>
            ))}
          </p>
        </div>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------------ *
 * Room-by-room guidance
 * ------------------------------------------------------------------ */

export function ProductRooms({
  n,
  tone = "cream",
  data,
}: {
  n: string;
  tone?: Tone;
  data: Head & { items: RoomItem[] };
}) {
  const t = useT();
  const c = t.productPages.common;
  const isInk = tone === "ink";
  return (
    <Section id="rooms" tone={tone}>
      <div className="grid lg:grid-cols-12 gap-6 lg:gap-16 items-start">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow n={n} label={data.eyebrow} isInk={isInk} />
            <Title titleA={data.titleA} titleB={data.titleB} isInk={isInk} />
          </Reveal>
        </div>
        <div className="lg:col-span-7">
          <Reveal>
            <Dek isInk={isInk} className="mt-0">
              {data.dek}
            </Dek>
          </Reveal>
        </div>
      </div>

      <div className="mt-9 lg:mt-12">
        {data.items.map((room, i) => (
          <Reveal key={room.title} delay={i * 50}>
            <div
              className={cn(
                "grid lg:grid-cols-12 gap-3 lg:gap-8 py-6 lg:py-7 border-t border-[var(--color-line-soft)]",
                i === data.items.length - 1 && "border-b",
              )}
            >
              <h3 className="lg:col-span-3 font-serif text-[1.2rem] leading-tight tracking-tighter text-[var(--color-ink)]">
                {room.title}
              </h3>
              <div className="lg:col-span-6 space-y-2.5 text-[0.92rem] leading-relaxed text-[var(--color-muted)]">
                {room.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <div className="lg:col-span-3 text-[0.84rem] text-[var(--color-ink)]">
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
    </Section>
  );
}

/* ------------------------------------------------------------------ *
 * What moves the price
 * ------------------------------------------------------------------ */

export function ProductPricing({
  n,
  tone = "cream",
  data,
}: {
  n: string;
  tone?: Tone;
  data: Head & {
    cta: string;
    factors: Factor[];
    closerTitle: string;
    closerBody: string;
    closerPipeline?: string[];
  };
}) {
  const r = useRoutes();
  const isInk = tone === "ink";
  return (
    <Section id="price" tone={tone}>
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        <div className="lg:col-span-5 lg:sticky lg:top-28 self-start">
          <Reveal>
            <Eyebrow n={n} label={data.eyebrow} isInk={isInk} />
            <Title titleA={data.titleA} titleB={data.titleB} isInk={isInk} />
            <Dek isInk={isInk}>{data.dek}</Dek>
            <div className="mt-6">
              <PillLink to={r.contact} isInk={isInk}>
                {data.cta}
                <span aria-hidden>→</span>
              </PillLink>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7 grid sm:grid-cols-2 gap-x-7 gap-y-6">
          {data.factors.map((f, i) => (
            <Reveal key={f.title} delay={i * 40}>
              <div className="pt-4 border-t border-[var(--color-line-soft)]">
                <h3 className="font-serif text-[1.05rem] tracking-tighter text-[var(--color-ink)]">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-[0.88rem] leading-relaxed text-[var(--color-muted)]">
                  {f.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal>
        <div className="mt-10 lg:mt-14 pt-8 lg:pt-10 border-t border-[var(--color-line)] grid lg:grid-cols-12 gap-5 lg:gap-16 items-start">
          <h3 className="lg:col-span-5 font-serif text-[clamp(1.2rem,1rem+1vw,1.65rem)] leading-tight tracking-tighter text-[var(--color-ink)]">
            {data.closerTitle}
          </h3>
          <div className="lg:col-span-7">
            <Dek isInk={isInk} className="mt-0">
              {data.closerBody}
            </Dek>
            {data.closerPipeline && <Pipeline items={data.closerPipeline} isInk={isInk} />}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------------ *
 * Made to measure — the five steps (always on ink)
 * ------------------------------------------------------------------ */

export function ProductSteps({ n, data }: { n: string; data: Head & { items: Step[] } }) {
  const t = useT();
  const r = useRoutes();
  const c = t.productPages.common;
  return (
    <Section id="process" tone="ink">
      <div className="grid lg:grid-cols-12 gap-6 lg:gap-16 items-start">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow n={n} label={data.eyebrow} isInk />
            <Title titleA={data.titleA} titleB={data.titleB} isInk />
          </Reveal>
        </div>
        <div className="lg:col-span-7">
          <Reveal>
            <Dek isInk className="mt-0">
              {data.dek}
            </Dek>
          </Reveal>
        </div>
      </div>

      <div className="mt-9 lg:mt-12">
        {data.items.map((step, i) => (
          <Reveal key={step.title} delay={i * 50}>
            <div
              className={cn(
                "grid lg:grid-cols-12 gap-3 lg:gap-8 py-6 lg:py-7 border-t border-white/10",
                i === data.items.length - 1 && "border-b",
              )}
            >
              <p className="lg:col-span-1 text-[0.72rem] tracking-[0.16em] text-[var(--color-clay-light)] pt-1">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="lg:col-span-4 font-serif text-[1.2rem] leading-tight tracking-tighter text-[var(--color-cream)]">
                {step.title}
              </h3>
              <div className="lg:col-span-7">
                <p className="text-[0.92rem] leading-relaxed text-[var(--color-cream)]/70">
                  {step.body}
                </p>
                {step.bullets.length > 0 && (
                  <ul className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
                    {step.bullets.map((b) => (
                      <li
                        key={b}
                        className="pl-4 relative text-[0.86rem] text-[var(--color-cream)]/65 before:absolute before:left-0 before:top-[0.62em] before:h-[3px] before:w-[3px] before:rounded-full before:bg-[var(--color-clay-light)]"
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
          <PillLink to={r.contact} isInk>
            {c.stepsCta}
            <span aria-hidden>→</span>
          </PillLink>
        </div>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------------ *
 * Motorisation — when it actually earns its place
 * ------------------------------------------------------------------ */

export function ProductMotorised({
  n,
  tone = "paper",
  data,
}: {
  n: string;
  tone?: Tone;
  data: Head & { cta: string; lede: string; items: Factor[]; note: string };
}) {
  const r = useRoutes();
  const isInk = tone === "ink";
  return (
    <Section id="motorised" tone={tone}>
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow n={n} label={data.eyebrow} isInk={isInk} />
            <Title titleA={data.titleA} titleB={data.titleB} isInk={isInk} />
            <Dek isInk={isInk}>{data.dek}</Dek>
            <div className="mt-6">
              <PillLink to={r.contact} isInk={isInk} variant="ghost">
                {data.cta}
              </PillLink>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal>
            <p className="fluid-body text-[var(--color-ink-soft)] max-w-[60ch]">{data.lede}</p>
          </Reveal>
          <div className="mt-6">
            {data.items.map((item, i) => (
              <Reveal key={item.title} delay={i * 40}>
                <div
                  className={cn(
                    "grid sm:grid-cols-12 gap-1 sm:gap-6 py-4 border-t border-[var(--color-line-soft)]",
                    i === data.items.length - 1 && "border-b",
                  )}
                >
                  <h3 className="sm:col-span-5 font-serif text-[1.02rem] leading-snug tracking-tighter text-[var(--color-ink)]">
                    {item.title}
                  </h3>
                  <p className="sm:col-span-7 text-[0.88rem] leading-relaxed text-[var(--color-muted)]">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <Dek isInk={isInk}>{data.note}</Dek>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ *
 * Cleaning & maintenance
 * ------------------------------------------------------------------ */

export function ProductCare({
  n,
  tone = "cream",
  data,
}: {
  n: string;
  tone?: Tone;
  data: Head & { items: Reason[] };
}) {
  const isInk = tone === "ink";
  return (
    <Section id="care" tone={tone}>
      <div className="grid lg:grid-cols-12 gap-6 lg:gap-16 items-start">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow n={n} label={data.eyebrow} isInk={isInk} />
            <Title titleA={data.titleA} titleB={data.titleB} isInk={isInk} />
          </Reveal>
        </div>
        <div className="lg:col-span-7">
          <Reveal>
            <Dek isInk={isInk} className="mt-0">
              {data.dek}
            </Dek>
          </Reveal>
        </div>
      </div>

      <div className="mt-9 lg:mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {data.items.map((item, i) => (
          <Reveal key={item.title} delay={i * 50}>
            <div className="pl-5 border-l-2 border-[var(--color-line)]">
              <h3 className="font-serif text-[1.02rem] leading-snug tracking-tighter text-[var(--color-ink)]">
                {item.title}
              </h3>
              <p className="mt-2 text-[0.88rem] leading-relaxed text-[var(--color-muted)]">
                {item.body}
              </p>
              {item.bullets.length > 0 && (
                <ul className="mt-2.5 space-y-1">
                  {item.bullets.map((b) => (
                    <li
                      key={b}
                      className="pl-4 relative text-[0.84rem] text-[var(--color-ink-soft)] before:absolute before:left-0 before:top-[0.62em] before:h-[3px] before:w-[3px] before:rounded-full before:bg-[var(--color-clay)]"
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
    </Section>
  );
}

/* ------------------------------------------------------------------ *
 * Per-product FAQ (+ FAQPage structured data)
 * ------------------------------------------------------------------ */

/**
 * Unlike the site-wide <FaqSection />, the JSON-LD here is rendered inline
 * rather than injected from an effect, so it exists in the prerendered
 * HTML that vite-react-ssg writes at build time. Visible copy and schema
 * come from the same i18n array, so they can't drift apart — Google
 * requires the answer on the page to match the marked-up one.
 */
export function ProductFaq({
  n,
  tone = "paper",
  data,
}: {
  n: string;
  tone?: Tone;
  data: { eyebrow: string; titleA: string; titleB: string; items: QA[] };
}) {
  const isInk = tone === "ink";
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
    <Section id="faq" tone={tone}>
      <script
        type="application/ld+json"
        // Rendered at build time so the answers ship in the static HTML.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="grid lg:grid-cols-12 gap-7 lg:gap-16">
        <div className="lg:col-span-4">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <Eyebrow n={n} label={data.eyebrow} isInk={isInk} />
              <Title titleA={data.titleA} titleB={data.titleB} isInk={isInk} />
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-8 border-t border-[var(--color-line)]">
          {data.items.map((item, i) => (
            <Reveal key={item.q} delay={i * 30}>
              <details className="group border-b border-[var(--color-line)]">
                <summary className="flex items-start justify-between gap-4 cursor-pointer list-none py-5 lg:py-6 [&::-webkit-details-marker]:hidden">
                  <span className="font-serif text-[clamp(1.02rem,0.95rem+0.4vw,1.24rem)] leading-snug text-[var(--color-ink)] group-hover:text-[var(--color-clay-deep)] transition-colors">
                    {item.q}
                  </span>
                  <span
                    aria-hidden
                    className="shrink-0 mt-1 text-[var(--color-clay)] transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-5 lg:pb-6 pr-8 text-[0.95rem] leading-relaxed text-[var(--color-muted)] max-w-[66ch]">
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ *
 * Closing band — free measurement & quote (always on ink)
 * ------------------------------------------------------------------ */

export function ProductClosing({
  n,
  data,
  waMessage,
}: {
  n: string;
  data: {
    eyebrow: string;
    titleA: string;
    titleB: string;
    dek: string;
    pipeline: string[];
    pullquote: string;
    note: string;
  };
  /** Prefilled WhatsApp text so the enquiry arrives naming the product. */
  waMessage: string;
}) {
  const t = useT();
  const c = t.productPages.common;
  const waUrl = `https://wa.me/60179778289?text=${encodeURIComponent(waMessage)}`;

  return (
    <Section id="quote" tone="ink">
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow n={n} label={data.eyebrow} isInk />
            <Title titleA={data.titleA} titleB={data.titleB} isInk />
            <Dek isInk>{data.dek}</Dek>
            <Pipeline items={data.pipeline} isInk />
            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={trackWhatsAppClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-[#08301A] text-[0.9rem] font-medium hover:opacity-90 transition-opacity"
              >
                {c.ctaWhatsApp}
              </a>
              <a
                href="mailto:info@kovasunshade.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/25 text-[var(--color-cream)] text-[0.9rem] font-medium hover:bg-[var(--color-cream)] hover:text-[var(--color-ink)] transition-colors"
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
            <Dek isInk>{data.note}</Dek>
            <div className="mt-7 pt-6 border-t border-white/10 text-[0.88rem] leading-relaxed text-[var(--color-cream)]/70">
              <p>{c.studioLine}</p>
              <p>{c.hoursLine}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
