import { Sec, Eyebrow, Title, Rule } from "./Sections";
import { RollerFabricPreview, VenetianMiniWindow, VertiSheerModePreview } from "./svg";

/**
 * The one-off sections each product page carries, ported from its mockup:
 * the roller's fabric comparison, the venetian's four-hour clock and
 * material cards, and the vertisheer's three light modes.
 */

/* ------------------------------------------------------------------ *
 * Roller — blackout / dim-out / sunscreen
 * ------------------------------------------------------------------ */

function Meter({ level }: { level: number }) {
  return (
    <span className={`meter${level >= 5 ? " meter--hi" : ""}`} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => (
        <i key={i} className={i <= level ? "on" : undefined} />
      ))}
    </span>
  );
}

const ROLLER_CARD_VARIANTS = ["blackout", "dimout", "sunscreen"] as const;

export function RollerFabricGuide({
  n, data,
}: {
  n: string;
  data: {
    eyebrow: string; titleA: string; titleB: string; dek: string;
    tableCaption: string; headers: string[];
    rows: { name: string; light: number; lightNote: string; privacy: number; privacyNote: string; best: string }[];
    cards: { q: string; title: string; body: string[]; tags: string }[];
  };
}) {
  return (
    <Sec id="fabric">
      <Eyebrow n={n}>{data.eyebrow}</Eyebrow>
      <div className="split" style={{ marginBottom: "clamp(28px,4vw,40px)" }}>
        <div>
          <Title a={data.titleA} b={data.titleB} />
        </div>
        <p className="dek" style={{ marginTop: 0 }}>
          {data.dek}
        </p>
      </div>

      <div className="tablewrap">
        <table>
          <caption className="sr-only">{data.tableCaption}</caption>
          <thead>
            <tr>
              {data.headers.map((h) => (
                <th scope="col" key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <tr key={row.name}>
                <th scope="row">{row.name}</th>
                <td>
                  <Meter level={row.light} />
                  {row.lightNote}
                </td>
                <td>
                  <Meter level={row.privacy} />
                  {row.privacyNote}
                </td>
                <td>{row.best}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Rule />

      <div className="grid g3">
        {data.cards.map((card, i) => (
          <article className="fab" key={card.title}>
            <div className="win">
              <RollerFabricPreview variant={ROLLER_CARD_VARIANTS[i] ?? "dimout"} label={card.title} />
            </div>
            <div className="body">
              <p className="q">{card.q}</p>
              <h3>{card.title}</h3>
              {card.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p className="tags">{card.tags}</p>
            </div>
          </article>
        ))}
      </div>
    </Sec>
  );
}

/* ------------------------------------------------------------------ *
 * Venetian — one window, four hours of the day
 * ------------------------------------------------------------------ */

/** Tilt + dim per hour, matching the mockup's four miniWin() calls. */
const CLOCK_FRAMES = [
  { tilt: 100, dim: 0 },
  { tilt: 68, dim: 0.05 },
  { tilt: 34, dim: 0.11 },
  { tilt: 0, dim: 0.2 },
];

export function VenetianClock({
  data,
}: {
  data: { label: string; items: { time: string; note: string }[] };
}) {
  return (
    <>
      <Rule />
      <p className="eyebrow" style={{ marginBottom: 18 }}>{data.label}</p>
      <div className="clock">
        {data.items.map((item, i) => {
          const frame = CLOCK_FRAMES[i] ?? CLOCK_FRAMES[0]!;
          return (
            <div className="hour" key={item.time}>
              <VenetianMiniWindow
                w={250}
                h={200}
                col="#B8BBBD"
                tilt={frame.tilt}
                pitch={13}
                dim={frame.dim}
                label={`${item.time} — ${item.note}`}
              />
              <div className="t">
                <b>{item.time}</b>
                <span>{item.note}</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ *
 * Venetian — aluminium vs timber
 * ------------------------------------------------------------------ */

export function VenetianMaterials({
  n, data,
}: {
  n: string;
  data: {
    eyebrow: string; titleA: string; titleB: string; dek: string;
    cards: { title: string; body: string; bullets: string[]; tags: string }[];
    picks: { title: string; body: string }[];
    note: string;
  };
}) {
  return (
    <Sec id="materials" tone="paper">
      <Eyebrow n={n}>{data.eyebrow}</Eyebrow>
      <div className="split" style={{ marginBottom: "clamp(28px,4vw,40px)" }}>
        <div>
          <Title a={data.titleA} b={data.titleB} />
        </div>
        <p className="dek" style={{ marginTop: 0 }}>
          {data.dek}
        </p>
      </div>

      <div className="grid g2">
        {data.cards.map((card, i) => {
          const wood = i === 1;
          return (
            <article className="mat" key={card.title}>
              <div className="win">
                <VenetianMiniWindow
                  w={400}
                  h={300}
                  col={wood ? "#7A4B2C" : "#B8BBBD"}
                  tilt={60}
                  pitch={wood ? 26 : 13}
                  wood={wood}
                  dim={wood ? 0.06 : 0.04}
                  label={card.title}
                />
              </div>
              <div className="body">
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <ul>
                  {card.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <p className="tags">{card.tags}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="pick">
        {data.picks.map((p) => (
          <div className="pickcard" key={p.title}>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </div>
        ))}
      </div>
      <p className="dek">{data.note}</p>
    </Sec>
  );
}

/* ------------------------------------------------------------------ *
 * VertiSheer — three settings, one system
 * ------------------------------------------------------------------ */

const MODE_ANGLES = [6, 50, 100];

export function VertiSheerModes({
  n, data,
}: {
  n: string;
  data: {
    eyebrow: string; titleA: string; titleB: string; dek: string;
    cards: { title: string; body: string[]; tags: string }[];
    callout: { title: string; body: string; formula: string[] };
  };
}) {
  return (
    <Sec id="modes" tone="paper">
      <Eyebrow n={n}>{data.eyebrow}</Eyebrow>
      <div className="split" style={{ marginBottom: "clamp(28px,4vw,40px)" }}>
        <div>
          <Title a={data.titleA} b={data.titleB} />
        </div>
        <p className="dek" style={{ marginTop: 0 }}>
          {data.dek}
        </p>
      </div>

      <div className="grid g3">
        {data.cards.map((card, i) => (
          <article className="mode" key={card.title}>
            <div className="win">
              <VertiSheerModePreview angle={MODE_ANGLES[i] ?? 50} label={card.title} />
            </div>
            <div className="body">
              <h3>{card.title}</h3>
              {card.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p className="tags">{card.tags}</p>
            </div>
          </article>
        ))}
      </div>

      <Rule />

      <div className="callout">
        <h3>{data.callout.title}</h3>
        <p>{data.callout.body}</p>
        <p className="formula">
          {data.callout.formula.map((part, i) => (
            <span key={part} style={{ display: "contents" }}>
              {i > 0 && <i aria-hidden="true">+</i>}
              <span>{part}</span>
            </span>
          ))}
        </p>
      </div>
    </Sec>
  );
}
