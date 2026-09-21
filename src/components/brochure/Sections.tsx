import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useRoutes } from "@/lib/routes";
import { trackWhatsAppClick } from "@/lib/analytics";
import { useT } from "@/lib/i18n";
import type { SwatchGroup } from "@/lib/brochure/data";

/**
 * Brochure page sections, ported from the client's supplied HTML mockups.
 *
 * The markup and class names are deliberately the mockups' own (`.sec`,
 * `.wrap`, `.split`, `.reasons`, `.room`, `.fact`, `.step`, `.sws`) and are
 * styled by styles/brochure.css. Text comes from i18n so both language
 * versions share one layout.
 */

type Tone = "ground" | "paper" | "ink";

export function Sec({
  id, tone = "ground", hero = false, children,
}: {
  id?: string; tone?: Tone; hero?: boolean; children: ReactNode;
}) {
  const cls = ["sec", tone === "paper" && "sec--paper", tone === "ink" && "sec--ink", hero && "hero"]
    .filter(Boolean)
    .join(" ");
  return (
    <section id={id} className={cls}>
      <div className="wrap">{children}</div>
    </section>
  );
}

export function Eyebrow({ n, children }: { n?: string; children: ReactNode }) {
  return (
    <p className="eyebrow">
      {n && (
        <>
          <b>{n}</b>
          <i>/</i>
        </>
      )}
      {children}
    </p>
  );
}

/** Two-part headline: upright first half, italic second half on its own line. */
export function Title({ a, b }: { a: string; b?: string }) {
  return (
    <h2>
      {a}
      {b && <span className="ital">{b}</span>}
    </h2>
  );
}

export function Pipeline({ items }: { items: string[] }) {
  return (
    <p className="pipeline">
      {items.map((item, i) => (
        <span key={item} style={{ display: "contents" }}>
          {i > 0 && <i aria-hidden="true">→</i>}
          <span>{item}</span>
        </span>
      ))}
    </p>
  );
}

export function Rule() {
  return <div className="rule" aria-hidden="true" />;
}

/* ------------------------------------------------------------------ *
 * 01 — hero
 * ------------------------------------------------------------------ */

export function Hero({
  n, eyebrow, h1, subhead, body, art, caption,
}: {
  n: string; eyebrow: string; h1: string; subhead: string;
  body: string[]; art: ReactNode; caption: string;
}) {
  const t = useT();
  const r = useRoutes();
  const c = t.productPages.common;
  return (
    <Sec hero>
      <Eyebrow n={n}>{eyebrow}</Eyebrow>
      <h1>{h1}</h1>
      <p className="subhead">{subhead}</p>
      <div style={{ marginTop: "clamp(20px,3vw,28px)" }}>
        {body.map((p, i) => (
          <p className="lede" key={p} style={i > 0 ? { marginTop: 14 } : undefined}>
            {p}
          </p>
        ))}
      </div>
      <div className="btns">
        <Link className="btn" to={r.contact}>
          {c.heroCtaA} <span className="ar" aria-hidden="true">→</span>
        </Link>
        <a className="btn btn--ghost" href="#price">
          {c.heroCtaB}
        </a>
      </div>
      <div className="heroart">
        <div className="win">{art}</div>
      </div>
      <p className="cap">{caption}</p>
    </Sec>
  );
}

/* ------------------------------------------------------------------ *
 * Why — split intro + reason list
 * ------------------------------------------------------------------ */

type Reason = { title: string; body: string; bullets: string[] };

export function Why({
  n, tone = "paper", data, extra,
}: {
  n: string;
  tone?: Tone;
  data: { eyebrow: string; titleA: string; titleB: string; dek: string; items: Reason[]; pipeline?: string[] };
  /** Rendered after the split — the venetian page's four-hour clock strip. */
  extra?: ReactNode;
}) {
  return (
    <Sec tone={tone}>
      <Eyebrow n={n}>{data.eyebrow}</Eyebrow>
      <div className="split">
        <div>
          <Title a={data.titleA} b={data.titleB} />
          <p className="dek">{data.dek}</p>
          {data.pipeline && <Pipeline items={data.pipeline} />}
        </div>
        <ul className="reasons">
          {data.items.map((item) => (
            <li key={item.title}>
              <h3>{item.title}</h3>
              {item.bullets.length > 0 ? (
                <div>
                  <p>{item.body}</p>
                  <ul>
                    {item.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>{item.body}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
      {extra}
    </Sec>
  );
}

/* ------------------------------------------------------------------ *
 * Swatch / finish library
 * ------------------------------------------------------------------ */

export function SwatchLibrary({
  n, tone = "paper", data, groups,
}: {
  n: string;
  tone?: Tone;
  data: { eyebrow: string; titleA: string; titleB: string; dek: string };
  groups: SwatchGroup[];
}) {
  return (
    <Sec id="swatches" tone={tone}>
      <Eyebrow n={n}>{data.eyebrow}</Eyebrow>
      <div className="split">
        <div>
          <Title a={data.titleA} b={data.titleB} />
        </div>
        <p className="dek" style={{ marginTop: 0 }}>
          {data.dek}
        </p>
      </div>
      {groups.map((group) => (
        <div key={group.label}>
          <p className="collname">{group.label}</p>
          <ul className="sws">
            {group.items.map((s) => (
              <li className="sw" key={`${group.label}-${s.name}`}>
                <span className={`dot dot--${group.dot}`} style={{ background: s.hex }} />
                <small>
                  {s.name}
                  <br />
                  <em>{s.sub}</em>
                </small>
              </li>
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
  n, tone = "ground", data,
}: {
  n: string;
  tone?: Tone;
  data: { eyebrow: string; titleA: string; titleB: string; dek: string; items: RoomItem[] };
}) {
  const t = useT();
  const c = t.productPages.common;
  return (
    <Sec id="rooms" tone={tone}>
      <Eyebrow n={n}>{data.eyebrow}</Eyebrow>
      <div className="split" style={{ marginBottom: "clamp(20px,3vw,30px)" }}>
        <div>
          <Title a={data.titleA} b={data.titleB} />
        </div>
        <p className="dek" style={{ marginTop: 0 }}>
          {data.dek}
        </p>
      </div>
      {data.items.map((room) => (
        <div className="room" key={room.title}>
          <h3>{room.title}</h3>
          <div>
            {room.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="rec">
            <b>{c.recommendedLabel}</b>
            {room.rec}
            {room.best && (
              <>
                <br />
                <br />
                <b>{c.bestForLabel}</b>
                {room.best}
              </>
            )}
          </p>
        </div>
      ))}
    </Sec>
  );
}

/* ------------------------------------------------------------------ *
 * Price
 * ------------------------------------------------------------------ */

export function Price({
  n, tone = "paper", data,
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
      <Eyebrow n={n}>{data.eyebrow}</Eyebrow>
      <div className="split">
        <div className="stick">
          <Title a={data.titleA} b={data.titleB} />
          <p className="dek">{data.dek}</p>
          <div className="btns">
            <Link className="btn" to={r.contact}>
              {data.cta} <span className="ar" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="grid g2" style={{ gap: "clamp(18px,2.6vw,26px)" }}>
          {data.factors.map((f) => (
            <div className="fact" key={f.title}>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </div>

      <Rule />

      <div className="split">
        <div>
          <h3 style={{ fontSize: "clamp(1.3rem,2.4vw,1.7rem)" }}>{data.closerTitle}</h3>
        </div>
        <div>
          <p className="dek" style={{ marginTop: 0 }}>
            {data.closerBody}
          </p>
          {data.closerPipeline && <Pipeline items={data.closerPipeline} />}
        </div>
      </div>
    </Sec>
  );
}

/* ------------------------------------------------------------------ *
 * Made-to-measure steps (always on ink)
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
      <Eyebrow n={n}>{data.eyebrow}</Eyebrow>
      <div className="split" style={{ marginBottom: "clamp(24px,3.5vw,36px)" }}>
        <div>
          <Title a={data.titleA} b={data.titleB} />
        </div>
        <p className="dek" style={{ marginTop: 0 }}>
          {data.dek}
        </p>
      </div>

      <div className="steps">
        {data.items.map((step, i) => (
          <div className="step" key={step.title}>
            <p className="n">{String(i + 1).padStart(2, "0")}</p>
            <h3>{step.title}</h3>
            <div>
              <p>{step.body}</p>
              {step.bullets.length > 0 && (
                <ul>
                  {step.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
              {step.said && <span className="said">{step.said}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="btns">
        <Link className="btn" to={r.contact}>
          {c.stepsCta} <span className="ar" aria-hidden="true">→</span>
        </Link>
      </div>
    </Sec>
  );
}

/* ------------------------------------------------------------------ *
 * Motorisation
 * ------------------------------------------------------------------ */

export function Motorised({
  n, tone = "paper", data,
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
      <Eyebrow n={n}>{data.eyebrow}</Eyebrow>
      <div className="split">
        <div>
          <Title a={data.titleA} b={data.titleB} />
          <p className="dek">{data.dek}</p>
          <div className="btns">
            <Link className="btn btn--ghost" to={r.contact}>
              {data.cta}
            </Link>
          </div>
        </div>
        <div>
          <p className="lede" style={{ marginBottom: 20 }}>
            {data.lede}
          </p>
          <ul className="reasons" style={{ borderTop: 0 }}>
            {data.items.map((item) => (
              <li key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ul>
          <p className="dek">{data.note}</p>
        </div>
      </div>
    </Sec>
  );
}

/* ------------------------------------------------------------------ *
 * Care
 * ------------------------------------------------------------------ */

export function Care({
  n, tone = "ground", data,
}: {
  n: string;
  tone?: Tone;
  data: { eyebrow: string; titleA: string; titleB: string; dek: string; items: Reason[] };
}) {
  return (
    <Sec id="care" tone={tone}>
      <Eyebrow n={n}>{data.eyebrow}</Eyebrow>
      <div className="split" style={{ marginBottom: "clamp(20px,3vw,30px)" }}>
        <div>
          <Title a={data.titleA} b={data.titleB} />
        </div>
        <p className="dek" style={{ marginTop: 0 }}>
          {data.dek}
        </p>
      </div>
      <div className="grid g4">
        {data.items.map((item) => (
          <div className="care" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            {item.bullets.length > 0 && (
              <ul>
                {item.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </Sec>
  );
}

/* ------------------------------------------------------------------ *
 * FAQ (+ FAQPage structured data)
 * ------------------------------------------------------------------ */

/**
 * The JSON-LD is rendered inline rather than injected from an effect, so
 * the answers ship in the prerendered HTML. Visible copy and schema read
 * from the same array and cannot drift.
 */
export function Faq({
  n, tone = "paper", data,
}: {
  n: string;
  tone?: Tone;
  data: { eyebrow: string; titleA: string; titleB: string; items: { q: string; a: string }[] };
}) {
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Eyebrow n={n}>{data.eyebrow}</Eyebrow>
      <div className="split">
        <div className="stick">
          <Title a={data.titleA} b={data.titleB} />
        </div>
        <div className="faq">
          {data.items.map((item, i) => (
            <details key={item.q} open={i === 0}>
              <summary>{item.q}</summary>
              <div className="ans">
                <p>{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </Sec>
  );
}

/* ------------------------------------------------------------------ *
 * Closing quote band (always on ink)
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
      <Eyebrow n={n}>{data.eyebrow}</Eyebrow>
      <div className="split">
        <div>
          <Title a={data.titleA} b={data.titleB} />
          <p className="dek">{data.dek}</p>
          <Pipeline items={data.pipeline} />
          <div className="btns">
            <a
              className="btn btn--wa"
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackWhatsAppClick}
            >
              {c.ctaWhatsApp}
            </a>
            <a className="btn btn--ghost" href="mailto:info@kovasunshade.com">
              {c.ctaEmail}
            </a>
          </div>
        </div>
        <div>
          <p
            style={{
              color: "#DCD5C7",
              fontFamily: "var(--display)",
              fontStyle: "italic",
              fontSize: "clamp(1.3rem,2.6vw,1.9rem)",
              lineHeight: 1.2,
              letterSpacing: "-.03em",
              margin: 0,
            }}
          >
            {data.pullquote}
          </p>
          <p className="dek" style={{ marginTop: 18 }}>
            {data.note}
          </p>
          <div className="rule" aria-hidden="true" style={{ marginBlock: 26 }} />
          <p className="dek" style={{ margin: 0 }}>
            {c.studioLine}
            <br />
            {c.hoursLine}
          </p>
        </div>
      </div>
    </Sec>
  );
}
