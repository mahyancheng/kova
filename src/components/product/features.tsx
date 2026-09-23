import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";
import { ImageSlot } from "@/components/ImageSlot";
import { Sec, Head, type Tone } from "./sections";
import {
  ROLLER_FABRIC_CARD_PHOTOS, VENETIAN_CLOCK_PHOTOS,
  VENETIAN_MATERIAL_PHOTOS, VERTISHEER_MODE_PHOTOS,
} from "@/lib/brochure/data";

/**
 * The one-off sections each product page carries — the roller's fabric
 * comparison, the venetian's four-hour clock and material cards, and the
 * vertisheer's three light modes — expressed in the site's own design
 * system, the same one the home page uses.
 *
 * Every window here is real product photography in an `ImageSlot` paper
 * frame; only the interactive previews stay drawn.
 */

const CARD = "h-full flex flex-col bg-[var(--color-paper)] border border-[var(--color-line)] rounded-md overflow-hidden";
const TAGS = "mt-auto pt-4 text-[0.68rem] tracking-[0.12em] uppercase text-[var(--color-muted)]";

/* ------------------------------------------------------------------ *
 * Roller — blackout / dim-out / sunscreen
 * ------------------------------------------------------------------ */

function Meter({ level }: { level: number }) {
  return (
    <span className="flex gap-[3px] mb-1.5" aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={cn(
            "block w-4 h-[5px] rounded-[2px]",
            i <= level
              ? level >= 5
                ? "bg-[var(--color-ink)]"
                : "bg-[var(--color-clay)]"
              : "bg-[var(--color-line)]",
          )}
        />
      ))}
    </span>
  );
}

const ROLLER_CARD_PHOTOS = [
  ROLLER_FABRIC_CARD_PHOTOS.blackout,
  ROLLER_FABRIC_CARD_PHOTOS.dimout,
  ROLLER_FABRIC_CARD_PHOTOS.sunscreen,
];

export function RollerFabricGuide({
  n, tone = "cream", data,
}: {
  n: string;
  tone?: Tone;
  data: {
    eyebrow: string; titleA: string; titleB: string; dek: string;
    tableCaption: string; headers: string[];
    rows: { name: string; light: number; lightNote: string; privacy: number; privacyNote: string; best: string }[];
    cards: { q: string; title: string; body: string[]; tags: string }[];
  };
}) {
  const cell = "text-left align-top px-4 py-4 border-b border-[var(--color-line)]";
  return (
    <Sec id="fabric" tone={tone}>
      <Head n={n} eyebrow={data.eyebrow} titleA={data.titleA} titleB={data.titleB} dek={data.dek} />

      <Reveal>
        <div className="overflow-x-auto rounded-md border border-[var(--color-line)] bg-[var(--color-paper)]">
          <table className="w-full min-w-[560px] border-collapse text-[0.88rem]">
            <caption className="sr-only">{data.tableCaption}</caption>
            <thead>
              <tr>
                {data.headers.map((h) => (
                  <th key={h} scope="col" className={cn(cell, "eyebrow bg-[var(--color-cream-light)]")}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, i) => (
                <tr key={row.name} className={i === data.rows.length - 1 ? "[&>*]:border-b-0" : undefined}>
                  <th
                    scope="row"
                    className={cn(cell, "font-serif text-[1.05rem] font-normal tracking-tight whitespace-nowrap text-[var(--color-ink)]")}
                  >
                    {row.name}
                  </th>
                  <td className={cn(cell, "text-[var(--color-ink-soft)]")}>
                    <Meter level={row.light} />
                    {row.lightNote}
                  </td>
                  <td className={cn(cell, "text-[var(--color-ink-soft)]")}>
                    <Meter level={row.privacy} />
                    {row.privacyNote}
                  </td>
                  <td className={cn(cell, "text-[var(--color-ink-soft)]")}>{row.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <div className="mt-8 lg:mt-12 grid md:grid-cols-3 gap-4 lg:gap-6">
        {data.cards.map((card, i) => (
          <Reveal key={card.title} delay={i * 80}>
            <article className={CARD}>
              <ImageSlot ratio="4/3" tone="sand" src={ROLLER_CARD_PHOTOS[i] ?? ROLLER_CARD_PHOTOS[1]} alt={card.title} />
              <div className="p-5 lg:p-6 flex flex-col grow">
                <p className="font-serif italic text-[0.88rem] text-[var(--color-clay-deep)]">{card.q}</p>
                <h3 className="mt-2 font-serif text-[clamp(1.05rem,0.95rem+0.5vw,1.3rem)] leading-snug tracking-tight text-[var(--color-ink)]">
                  {card.title}
                </h3>
                <div className="mt-2.5 space-y-2.5 text-[0.88rem] leading-relaxed text-[var(--color-muted)]">
                  {card.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                <p className={TAGS}>{card.tags}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Sec>
  );
}

/* ------------------------------------------------------------------ *
 * Venetian — one window, four hours of the day
 * ------------------------------------------------------------------ */

export function VenetianClock({
  data,
}: {
  data: { label: string; items: { time: string; note: string }[] };
}) {
  return (
    <div className="mt-[clamp(2rem,1.5rem+2vw,3.5rem)] pt-[clamp(1.5rem,1rem+1.5vw,2.5rem)] border-t border-[var(--color-line)]">
      <Reveal>
        <p className="eyebrow">{data.label}</p>
      </Reveal>
      <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {data.items.map((item, i) => (
          <Reveal key={item.time} delay={i * 80}>
            <figure className="m-0">
              <ImageSlot
                ratio="5/4"
                tone="sand"
                src={VENETIAN_CLOCK_PHOTOS[i] ?? VENETIAN_CLOCK_PHOTOS[0]}
                alt={`${item.time} — ${item.note}`}
              />
              <figcaption className="mt-2.5">
                <b className="block font-serif text-[0.98rem] font-normal tracking-tight text-[var(--color-ink)]">
                  {item.time}
                </b>
                <span className="mt-0.5 block text-[0.78rem] leading-snug text-[var(--color-muted)]">{item.note}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Venetian — aluminium vs timber
 * ------------------------------------------------------------------ */

export function VenetianMaterials({
  n, tone = "band", data,
}: {
  n: string;
  tone?: Tone;
  data: {
    eyebrow: string; titleA: string; titleB: string; dek: string;
    cards: { title: string; body: string; bullets: string[]; tags: string }[];
    picks: { title: string; body: string }[];
    note: string;
  };
}) {
  return (
    <Sec id="materials" tone={tone}>
      <Head n={n} eyebrow={data.eyebrow} titleA={data.titleA} titleB={data.titleB} dek={data.dek} />

      <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
        {data.cards.map((card, i) => (
          <Reveal key={card.title} delay={i * 80}>
            <article className={CARD}>
              <ImageSlot
                ratio="4/3"
                tone="sand"
                src={i === 1 ? VENETIAN_MATERIAL_PHOTOS.wood : VENETIAN_MATERIAL_PHOTOS.alu}
                alt={card.title}
              />
              <div className="p-5 lg:p-7 flex flex-col grow">
                <h3 className="font-serif text-[clamp(1.05rem,0.95rem+0.5vw,1.3rem)] leading-snug tracking-tight text-[var(--color-ink)]">
                  {card.title}
                </h3>
                <p className="mt-2.5 text-[0.88rem] leading-relaxed text-[var(--color-muted)]">{card.body}</p>
                <ul className="mt-3.5 space-y-1.5">
                  {card.bullets.map((b) => (
                    <li
                      key={b}
                      className="pl-4 relative text-[0.88rem] text-[var(--color-ink-soft)] before:absolute before:left-0 before:top-[0.62em] before:h-[3px] before:w-[3px] before:rounded-full before:bg-[var(--color-clay)]"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
                <p className={TAGS}>{card.tags}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="mt-6 lg:mt-8 grid md:grid-cols-2 gap-4 lg:gap-6">
        {data.picks.map((p, i) => (
          <Reveal key={p.title} delay={i * 80}>
            <div className="h-full rounded-md border border-[var(--color-line)] border-l-2 border-l-[var(--color-clay)] bg-[var(--color-paper)] p-5 lg:p-6">
              <h3 className="font-serif text-[clamp(1.05rem,0.95rem+0.5vw,1.3rem)] leading-snug tracking-tight text-[var(--color-ink)]">{p.title}</h3>
              <p className="mt-2 font-serif text-[1.02rem] leading-snug tracking-tight text-[var(--color-ink-soft)]">
                {p.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p className="mt-6 fluid-body text-[var(--color-muted)] max-w-[62ch] leading-relaxed">{data.note}</p>
      </Reveal>
    </Sec>
  );
}

/* ------------------------------------------------------------------ *
 * VertiSheer — three settings, one system
 * ------------------------------------------------------------------ */

export function VertiSheerModes({
  n, tone = "band", data,
}: {
  n: string;
  tone?: Tone;
  data: {
    eyebrow: string; titleA: string; titleB: string; dek: string;
    cards: { title: string; body: string[]; tags: string }[];
    callout: { title: string; body: string; formula: string[] };
  };
}) {
  return (
    <Sec id="modes" tone={tone}>
      <Head n={n} eyebrow={data.eyebrow} titleA={data.titleA} titleB={data.titleB} dek={data.dek} />

      <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
        {data.cards.map((card, i) => (
          <Reveal key={card.title} delay={i * 80}>
            <article className={CARD}>
              <ImageSlot
                ratio="4/3"
                tone="sand"
                src={VERTISHEER_MODE_PHOTOS[i] ?? VERTISHEER_MODE_PHOTOS[0]}
                alt={card.title}
              />
              <div className="p-5 lg:p-6 flex flex-col grow">
                <h3 className="font-serif text-[clamp(1.05rem,0.95rem+0.5vw,1.3rem)] leading-snug tracking-tight text-[var(--color-ink)]">
                  {card.title}
                </h3>
                <div className="mt-2.5 space-y-2.5 text-[0.88rem] leading-relaxed text-[var(--color-muted)]">
                  {card.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                <p className={TAGS}>{card.tags}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-8 lg:mt-12 rounded-md border border-[var(--color-line)] border-l-2 border-l-[var(--color-clay)] bg-[var(--color-paper)] p-6 lg:p-8">
          <h3 className="font-serif text-[clamp(1.05rem,0.95rem+0.5vw,1.3rem)] leading-snug tracking-tight text-[var(--color-ink)]">
            {data.callout.title}
          </h3>
          <p className="mt-2.5 fluid-body text-[var(--color-muted)] max-w-[62ch] leading-relaxed">
            {data.callout.body}
          </p>
          <p className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-2 font-serif text-[clamp(1rem,0.9rem+0.6vw,1.3rem)] tracking-tight text-[var(--color-ink)]">
            {data.callout.formula.map((part, i) => (
              <span key={part} className="inline-flex items-center gap-2.5">
                {i > 0 && <span aria-hidden className="font-sans text-[0.78rem] text-[var(--color-clay)]">+</span>}
                {part}
              </span>
            ))}
          </p>
        </div>
      </Reveal>
    </Sec>
  );
}
