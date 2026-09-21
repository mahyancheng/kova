import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useT } from "@/lib/i18n";
import { useRoutes } from "@/lib/routes";
import { useConfigurator } from "@/lib/configurator/context";
import { getFabricsForProduct, type OpacityId, type ProductId } from "@/lib/configurator/types";
import {
  ROLLER_DEMO_FABRICS, VENETIAN_FINISHES, VERTISHEER_DEMO_FABRICS,
  shade, type RollerOpacityId, type VenetianMaterialId,
} from "@/lib/brochure/data";
import { Sec, Eyebrow, Title } from "./Sections";
import { RollerDesignerPreview, VertiSheerDesignerPreview } from "./svg";

/**
 * The per-page interactive demos from the client's HTML mockups.
 *
 * Roller and VertiSheer draw pure SVG, so their previews are declarative
 * and render server-side. The Venetian stage is real CSS 3D (each slat is
 * a rotateX'd element, with light bloom, shafts and dust derived from the
 * actual slat gap), so it stays imperative inside an effect — the same
 * maths as the mockup, with React owning the control state.
 *
 * "Quote this" hands the chosen configuration to the existing quote flow
 * (ConfiguratorProvider → Contact prefill) rather than dead-ending, so
 * these demos still produce leads the way the shared Configurator did.
 */

/** Link a brochure swatch to the photographic catalogue used by the quote flow. */
function useQuoteThis() {
  const navigate = useNavigate();
  const r = useRoutes();
  const { setProduct, setFabric, setOpacity, submit } = useConfigurator();

  return useCallback(
    (product: ProductId, configuratorName: string | undefined, opacity?: OpacityId) => {
      setProduct(product);
      if (configuratorName) {
        const match = getFabricsForProduct(product).find((f) => f.name === configuratorName);
        if (match) setFabric(match);
      }
      if (opacity) setOpacity(opacity);
      submit();
      navigate(r.contact);
    },
    [navigate, r.contact, setProduct, setFabric, setOpacity, submit],
  );
}

/* ================================================================== *
 * Roller — type / opacity / fabric / drop
 * ================================================================== */

const ROLLER_OPACITY_TO_CONFIGURATOR: Record<RollerOpacityId, OpacityId> = {
  sunscreen: "sunscreen",
  dimout: "dim-out",
  blackout: "blackout",
};

export function RollerDesigner({ n }: { n: string }) {
  const t = useT();
  const d = t.productPages.roller.designer;
  const c = t.productPages.common;
  const quoteThis = useQuoteThis();

  const [type, setType] = useState<ProductId>("roller");
  const [op, setOp] = useState<RollerOpacityId>("dimout");
  const [fabIndex, setFabIndex] = useState(1);
  const [drop, setDrop] = useState(70);

  const fabrics = ROLLER_DEMO_FABRICS[op];
  const fab = fabrics[Math.min(fabIndex, fabrics.length - 1)]!;

  const pickOpacity = (next: RollerOpacityId) => {
    setOp(next);
    // Mirrors the mockup: dim-out defaults to its second swatch, others to the first.
    setFabIndex(next === "dimout" ? 1 : 0);
  };

  const typeLabels: Record<ProductId, string> = d.types;
  const opLabels: Record<RollerOpacityId, string> = d.opacities;

  return (
    <Sec id="design">
      <Eyebrow n={n}>{d.eyebrow}</Eyebrow>
      <div className="split" style={{ marginBottom: "clamp(24px,3.5vw,34px)" }}>
        <div>
          <Title a={d.titleA} b={d.titleB} />
        </div>
        <p className="dek" style={{ marginTop: 0 }}>
          {d.dek}
        </p>
      </div>

      <div className="cfg">
        <div className="panel">
          <p className="fldlab">{d.livePreview}</p>
          <div className="win">
            <RollerDesignerPreview
              type={type}
              opacity={op}
              hex={fab.hex}
              drop={drop}
              label={`${typeLabels[type]} · ${fab.name} · ${opLabels[op]}`}
            />
          </div>
          <p className="cap">{d.caption}</p>
        </div>

        <div className="panel">
          <div className="fld">
            <p className="fldlab" id="lab-type">{d.typeLabel}</p>
            <div className="opts" role="group" aria-labelledby="lab-type">
              {(["roller", "venetian", "vertisheer"] as ProductId[]).map((id) => (
                <button
                  key={id}
                  className="opt"
                  type="button"
                  aria-pressed={type === id}
                  onClick={() => setType(id)}
                >
                  {typeLabels[id]}
                </button>
              ))}
            </div>
          </div>

          <div className="fld">
            <p className="fldlab" id="lab-op">{d.opacityLabel}</p>
            <div className="opts" role="group" aria-labelledby="lab-op">
              {(["sunscreen", "dimout", "blackout"] as RollerOpacityId[]).map((id) => (
                <button
                  key={id}
                  className="opt"
                  type="button"
                  aria-pressed={op === id}
                  onClick={() => pickOpacity(id)}
                >
                  {opLabels[id]}
                </button>
              ))}
            </div>
          </div>

          <div className="fld">
            <p className="fldlab" id="lab-fab">{d.fabricLabel}</p>
            <div className="swrow" role="group" aria-labelledby="lab-fab">
              {fabrics.map((f, i) => (
                <button
                  key={f.name}
                  type="button"
                  className="swbtn"
                  style={{ background: f.hex }}
                  title={f.name}
                  aria-label={f.name}
                  aria-pressed={f.name === fab.name}
                  onClick={() => setFabIndex(i)}
                />
              ))}
            </div>
          </div>

          <div className="fld">
            <label className="fldlab" htmlFor="roller-drop">
              {d.dropLabel} — <span>{drop}</span>
              {d.dropSuffix}
            </label>
            <input
              className="slider"
              type="range"
              id="roller-drop"
              min={10}
              max={100}
              step={5}
              value={drop}
              onChange={(e) => setDrop(parseInt(e.target.value, 10))}
            />
          </div>

          <div className="readout">
            <b>{`${typeLabels[type]} · ${fab.name} · ${opLabels[op]}`}</b>
            <button
              type="button"
              className="btn"
              onClick={() => quoteThis(type, fab.configuratorName, ROLLER_OPACITY_TO_CONFIGURATOR[op])}
            >
              {c.quoteThis} <span className="ar" aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </Sec>
  );
}

/* ================================================================== *
 * VertiSheer — vane rotation + draw-across
 * ================================================================== */

export function VertiSheerDesigner({ n }: { n: string }) {
  const t = useT();
  const d = t.productPages.vertisheer.designer;
  const c = t.productPages.common;
  const quoteThis = useQuoteThis();

  const [fabIndex, setFabIndex] = useState(2); // Pivot Beige, as in the mockup
  const [angle, setAngle] = useState(50);
  const [cover, setCover] = useState(100);

  const fab = VERTISHEER_DEMO_FABRICS[fabIndex]!;
  const deg = Math.round(8 + (angle / 100) * 82);
  const note = angle <= 25 ? d.notes.sheer : angle <= 70 ? d.notes.partial : d.notes.privacy;
  const presets: { key: keyof typeof d.presets; a: number; on: boolean }[] = [
    { key: "sheer", a: 6, on: angle <= 25 },
    { key: "partial", a: 50, on: angle > 25 && angle <= 70 },
    { key: "privacy", a: 100, on: angle > 70 },
  ];

  return (
    <Sec id="demo">
      <Eyebrow n={n}>{d.eyebrow}</Eyebrow>
      <div className="split" style={{ marginBottom: "clamp(24px,3.5vw,36px)" }}>
        <div>
          <Title a={d.titleA} b={d.titleB} />
        </div>
        <p className="dek" style={{ marginTop: 0 }}>
          {d.dek}
        </p>
      </div>

      <div className="demo">
        <div className="panel">
          <p className="fldlab">{d.livePreview}</p>
          <div className="win">
            <VertiSheerDesignerPreview
              hex={fab.hex}
              angle={angle}
              cover={cover}
              label={`VertiSheer · ${fab.name} · ${deg}°`}
            />
          </div>
          <p className="cap">{d.caption}</p>
        </div>

        <div className="panel">
          <div className="fld">
            <label className="fldlab" htmlFor="vs-angle">
              {d.angleLabel} — <span>{deg}</span>°
            </label>
            <input
              className="slider"
              type="range"
              id="vs-angle"
              min={0}
              max={100}
              step={1}
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value, 10))}
            />
            <div className="opts" style={{ marginTop: 12 }}>
              {presets.map((p) => (
                <button
                  key={p.key}
                  className="opt"
                  type="button"
                  aria-pressed={p.on}
                  onClick={() => setAngle(p.a)}
                >
                  {d.presets[p.key]}
                </button>
              ))}
            </div>
            <p className="modenote">{note}</p>
          </div>

          <div className="fld">
            <label className="fldlab" htmlFor="vs-cover">
              {d.coverLabel} — <span>{cover}</span>
              {d.coverSuffix}
            </label>
            <input
              className="slider"
              type="range"
              id="vs-cover"
              min={15}
              max={100}
              step={5}
              value={cover}
              onChange={(e) => setCover(parseInt(e.target.value, 10))}
            />
          </div>

          <div className="fld">
            <p className="fldlab" id="lab-vsfab">{d.fabricLabel}</p>
            <div className="swrow" role="group" aria-labelledby="lab-vsfab">
              {VERTISHEER_DEMO_FABRICS.map((f, i) => (
                <button
                  key={f.name}
                  type="button"
                  className="swbtn"
                  style={{ background: f.hex }}
                  title={f.name}
                  aria-label={f.name}
                  aria-pressed={i === fabIndex}
                  onClick={() => setFabIndex(i)}
                />
              ))}
            </div>
          </div>

          <div className="readout">
            <b>{`VertiSheer · ${fab.name} · ${deg}°`}</b>
            <button type="button" className="btn" onClick={() => quoteThis("vertisheer", fab.configuratorName)}>
              {c.quoteThis} <span className="ar" aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </Sec>
  );
}

/* ================================================================== *
 * Venetian — real 3D slat stage
 * ================================================================== */

type SunId = "morning" | "midday" | "golden" | "dusk";

/** Daylight presets. `grade` is a CSS filter applied to the view layer. */
const SUN: Record<SunId, { grade: string; beam: string; strength: number; flare: string; warm: number; rake: number }> = {
  morning: { grade: "saturate(1.06) brightness(1.07) contrast(1.02) hue-rotate(-3deg)", beam: "255,247,228", strength: 0.62, flare: "14%,16%,34%", warm: 0.1, rake: -5 },
  midday: { grade: "saturate(.97) brightness(1.15) contrast(1.03)", beam: "255,251,238", strength: 0.78, flare: "50%,4%,30%", warm: 0.14, rake: -2 },
  golden: { grade: "saturate(1.28) brightness(1.04) sepia(.2) hue-rotate(-9deg)", beam: "255,214,152", strength: 1, flare: "78%,22%,40%", warm: 0.34, rake: -9 },
  dusk: { grade: "saturate(1.05) brightness(.74) sepia(.24) hue-rotate(-14deg)", beam: "240,176,118", strength: 0.42, flare: "86%,42%,38%", warm: 0.26, rake: -13 },
};

function StageScene() {
  return (
    <div className="scene" aria-hidden="true">
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="vsky2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9FBFD0" /><stop offset=".34" stopColor="#C3D3D4" />
            <stop offset=".62" stopColor="#E4DCC8" /><stop offset="1" stopColor="#EBD3AC" />
          </linearGradient>
          <radialGradient id="vsun2" cx=".68" cy=".2" r=".42">
            <stop offset="0" stopColor="#FFF6DF" stopOpacity=".95" /><stop offset="1" stopColor="#FFF1D2" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="vhaze2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#D9DDD4" stopOpacity="0" /><stop offset="1" stopColor="#D9DDD4" stopOpacity=".75" />
          </linearGradient>
          <filter id="vfar" x="-6%" y="-6%" width="112%" height="112%"><feGaussianBlur stdDeviation="1.5" /></filter>
          <filter id="vmid" x="-6%" y="-6%" width="112%" height="112%"><feGaussianBlur stdDeviation="2.6" /></filter>
          <filter id="vnear" x="-8%" y="-8%" width="116%" height="116%"><feGaussianBlur stdDeviation="5" /></filter>
        </defs>
        <rect width="800" height="600" fill="url(#vsky2)" />
        <rect width="800" height="600" fill="url(#vsun2)" />
        <g filter="url(#vfar)">
          <g fill="#8FA4AE" opacity=".46">
            <rect x="58" y="252" width="52" height="188" /><rect x="118" y="298" width="36" height="142" />
            <rect x="182" y="212" width="62" height="228" /><rect x="252" y="274" width="42" height="166" />
            <rect x="306" y="248" width="30" height="192" /><rect x="540" y="236" width="56" height="204" />
            <rect x="606" y="292" width="38" height="148" /><rect x="664" y="258" width="58" height="182" />
            <rect x="732" y="300" width="34" height="140" />
          </g>
          <g fill="#6E8592" opacity=".3">
            <rect x="196" y="190" width="14" height="24" /><rect x="676" y="238" width="13" height="22" />
            <rect x="182" y="212" width="62" height="5" /><rect x="540" y="236" width="56" height="5" />
          </g>
          <g fill="#FFFFFF" opacity=".16">
            <rect x="182" y="226" width="62" height="3" /><rect x="182" y="252" width="62" height="3" />
            <rect x="182" y="278" width="62" height="3" /><rect x="664" y="272" width="58" height="3" />
            <rect x="664" y="298" width="58" height="3" />
          </g>
        </g>
        <rect y="300" width="800" height="164" fill="url(#vhaze2)" />
        <g filter="url(#vmid)">
          <path d="M0 462c46-8 66-42 104-42s52 26 92 22 60-34 104-34 68 32 112 30 70-30 116-28 74 34 122 32 78-26 150-24v142H0z" fill="#7C9166" opacity=".72" />
          <path d="M0 504c60-6 92-28 150-26s96 26 158 24 96-26 156-22 98 26 158 22 110-22 178-18v116H0z" fill="#63794F" opacity=".68" />
        </g>
        <g filter="url(#vnear)" opacity=".82">
          <path d="M-30 600c30-118 96-196 196-232-64 72-104 152-124 232z" fill="#46603C" />
          <path d="M-30 600c8-72 44-126 104-156-38 50-62 102-70 156z" fill="#3B5334" opacity=".8" />
          <path d="M812 78c-96 16-166 60-208 128 78-48 152-68 222-62z" fill="#4E6845" opacity=".8" />
        </g>
      </svg>
    </div>
  );
}

export function VenetianStage({ n }: { n: string }) {
  const t = useT();
  const d = t.productPages.venetian.designer;
  const c = t.productPages.common;
  const quoteThis = useQuoteThis();

  const [mat, setMat] = useState<VenetianMaterialId>("alu");
  const [finIndex, setFinIndex] = useState(0);
  const [tilt, setTilt] = useState(55);
  const [drop, setDrop] = useState(100);
  const [sun, setSun] = useState<SunId>("golden");
  const [hintGone, setHintGone] = useState(false);

  const finishes = VENETIAN_FINISHES[mat];
  const fin = finishes[Math.min(finIndex, finishes.length - 1)]!;

  const stage = useRef<HTMLDivElement>(null);
  const slatbox = useRef<HTMLDivElement>(null);
  const headrail = useRef<HTMLDivElement>(null);
  const btmrail = useRef<HTMLDivElement>(null);
  const cordL = useRef<HTMLDivElement>(null);
  const cordR = useRef<HTMLDivElement>(null);
  const daylight = useRef<HTMLDivElement>(null);
  const bloom = useRef<HTMLDivElement>(null);
  const shafts = useRef<HTMLDivElement>(null);
  const motes = useRef<HTMLDivElement>(null);
  const flare = useRef<HTMLDivElement>(null);
  const warmth = useRef<HTMLDivElement>(null);
  const built = useRef(0);
  const slatEls = useRef<{ el: HTMLDivElement; lit: HTMLElement }[]>([]);

  const deg = 6 + (tilt / 100) * 78; // 6° closed → 84° edge-on
  const shown = Math.round(90 - deg);

  /* dust in the light — built once */
  useEffect(() => {
    const host = motes.current;
    if (!host || host.childElementCount > 0) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    for (let i = 0; i < 22; i++) {
      const m = document.createElement("span");
      m.className = "mote";
      const sz = (Math.random() * 2.2 + 1).toFixed(2);
      m.style.width = `${sz}px`;
      m.style.height = `${sz}px`;
      m.style.left = `${(Math.random() * 100).toFixed(1)}%`;
      m.style.top = `${(Math.random() * 90 + 8).toFixed(1)}%`;
      m.style.animationDuration = `${(Math.random() * 13 + 9).toFixed(1)}s`;
      m.style.animationDelay = `${(-Math.random() * 20).toFixed(1)}s`;
      m.style.opacity = (Math.random() * 0.5 + 0.4).toFixed(2);
      host.appendChild(m);
    }
  }, []);

  /* paint — the mockup's paint(), re-run whenever a control changes */
  const paint = useCallback(() => {
    const st = stage.current, box = slatbox.current;
    if (!st || !box) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    const H = st.clientHeight || 420;
    const wood = mat === "wood";
    const headH = Math.max(8, H * 0.055);
    const slatH = H * (wood ? 0.092 : 0.055);
    const pitch = slatH * 0.88;
    const top = headH, bottom = H * 0.955;
    const count = Math.max(4, Math.floor((bottom - top) / pitch));

    if (built.current !== count) {
      box.innerHTML = "";
      slatEls.current = [];
      for (let i = 0; i < count; i++) {
        const el = document.createElement("div");
        el.className = "slat";
        el.style.transitionDelay = `${Math.min(i, 26) * 13}ms`;
        const lit = document.createElement("i");
        el.appendChild(lit);
        box.appendChild(el);
        slatEls.current.push({ el, lit });
      }
      built.current = count;
    }

    const col = fin.hex;
    const open = tilt / 100;
    const face =
      `linear-gradient(to bottom,${shade(col, 1.16)} 0%,${shade(col, 1.03)} 16%,` +
      `${shade(col, 0.82)} 54%,${shade(col, 0.64)} 87%,${shade(col, 0.9)} 100%)`;
    const grain = wood
      ? ",repeating-linear-gradient(to bottom,rgba(60,38,20,.13) 0 1px,rgba(255,255,255,0) 1px 4px)"
      : "";

    const lowered = Math.max(1, Math.round((count * drop) / 100));
    const stacked = count - lowered;
    const stackPitch = slatH * 0.17;
    const runTop = top + stacked * stackPitch;
    const litOp = 0.18 + 0.6 * Math.sin((deg / 90) * Math.PI);

    for (let i = 0; i < count; i++) {
      const s = slatEls.current[i];
      if (!s) continue;
      const stackedSlat = i < stacked;
      const y = stackedSlat ? top + i * stackPitch : runTop + (i - stacked) * pitch;
      s.el.style.height = `${slatH}px`;
      s.el.style.top = `${y}px`;
      s.el.style.transform = `rotateX(${stackedSlat ? 80 : deg}deg)`;
      s.el.style.background = wood ? face + grain : face;
      s.el.style.backgroundBlendMode = wood ? "multiply" : "normal";
      s.lit.style.opacity = (stackedSlat ? 0.12 : litOp).toFixed(3);
    }

    const railTop = runTop + lowered * pitch;
    if (headrail.current) {
      headrail.current.style.height = `${headH}px`;
      headrail.current.style.background = `linear-gradient(to bottom,${shade(col, 0.95)},${shade(col, 0.7)})`;
    }
    if (btmrail.current) {
      btmrail.current.style.height = `${Math.max(5, slatH * 0.6)}px`;
      btmrail.current.style.top = `${railTop}px`;
      btmrail.current.style.background = `linear-gradient(to bottom,${shade(col, 0.88)},${shade(col, 0.6)})`;
    }
    if (cordL.current) { cordL.current.style.left = "22%"; cordL.current.style.height = `${railTop}px`; }
    if (cordR.current) { cordR.current.style.left = "78%"; cordR.current.style.height = `${railTop}px`; }

    /* sunlight — derived from the real gap between foreshortened slats */
    const S = SUN[sun];
    const projH = slatH * Math.cos((deg * Math.PI) / 180);
    const gap = Math.max(0, pitch - projH);
    const gapFrac = gap / pitch;
    const bandTop = runTop + slatH / 2 + projH / 2;
    const runLen = lowered * pitch;

    const sceneEl = st.querySelector<HTMLElement>(".scene");
    if (sceneEl) sceneEl.style.filter = S.grade;

    if (bloom.current) {
      bloom.current.style.top = `${bandTop}px`;
      bloom.current.style.height = `${runLen}px`;
      bloom.current.style.background =
        `repeating-linear-gradient(to bottom,rgba(${S.beam},.95) 0px,rgba(${S.beam},.95) ${gap.toFixed(1)}px,` +
        `rgba(${S.beam},0) ${gap.toFixed(1)}px,rgba(${S.beam},0) ${pitch.toFixed(1)}px)`;
      bloom.current.style.opacity = (gap <= 0 ? 0 : S.strength * (0.3 + 0.62 * Math.sin(gapFrac * Math.PI))).toFixed(3);
    }
    if (shafts.current) {
      shafts.current.style.top = `${bandTop}px`;
      shafts.current.style.height = `${runLen + H * 0.34}px`;
      shafts.current.style.background =
        `repeating-linear-gradient(to bottom,rgba(${S.beam},.6) 0px,rgba(${S.beam},.6) ${Math.max(1, gap * 0.8).toFixed(1)}px,` +
        `rgba(${S.beam},0) ${Math.max(1.4, gap * 1.5).toFixed(1)}px,rgba(${S.beam},0) ${pitch.toFixed(1)}px)`;
      shafts.current.style.transform = `rotate(${S.rake}deg)`;
      shafts.current.style.opacity = Math.max(
        0,
        S.strength * 0.6 * Math.sin(Math.min(1, gapFrac * 1.22) * Math.PI),
      ).toFixed(3);
    }
    if (flare.current) {
      const fp = S.flare.split(",");
      flare.current.style.left = fp[0]!;
      flare.current.style.top = fp[1]!;
      flare.current.style.width = fp[2]!;
      flare.current.style.height = fp[2]!;
      flare.current.style.marginLeft = `-${parseFloat(fp[2]!) / 2}%`;
      flare.current.style.background = `radial-gradient(circle,rgba(${S.beam},.95) 0%,rgba(${S.beam},.4) 30%,rgba(${S.beam},0) 70%)`;
      flare.current.style.opacity = (S.strength * 0.9).toFixed(3);
    }
    if (warmth.current) {
      warmth.current.style.boxShadow = `inset 0 0 46px 8px rgba(255,208,140,${(S.warm * (0.35 + 0.65 * open)).toFixed(3)})`;
    }
    if (motes.current) {
      motes.current.style.opacity = (reduce ? 0 : Math.min(0.75, S.strength * gapFrac * 0.9)).toFixed(3);
    }
    if (daylight.current) {
      daylight.current.style.opacity = ((0.1 + open * 0.56) * (0.45 + S.strength * 0.55)).toFixed(3);
    }
  }, [mat, fin.hex, tilt, drop, sun, deg]);

  useEffect(() => { paint(); }, [paint]);

  /* re-measure on resize */
  useEffect(() => {
    const st = stage.current;
    if (!st) return;
    const onResize = () => { built.current = 0; paint(); };
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(onResize);
      ro.observe(st);
      return () => ro.disconnect();
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [paint]);

  /* autoplay the tilt once the stage scrolls into view */
  const timers = useRef<number[]>([]);
  const stopPlay = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);
  const play = useCallback(() => {
    stopPlay();
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setTilt(55); return; }
    ([[450, 100], [1750, 48], [3050, 0], [4350, 55]] as const).forEach(([delay, value]) => {
      timers.current.push(window.setTimeout(() => setTilt(value), delay));
    });
  }, [stopPlay]);

  const userTook = useCallback(() => { stopPlay(); setHintGone(true); }, [stopPlay]);

  useEffect(() => {
    const st = stage.current;
    if (!st) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.IntersectionObserver) { play(); return () => stopPlay(); }
    let seen = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !seen) { seen = true; play(); io.disconnect(); }
      },
      { threshold: 0.35 },
    );
    io.observe(st);
    return () => { io.disconnect(); stopPlay(); };
  }, [play, stopPlay]);

  /* drag to tilt */
  const dragging = useRef(false);
  const lastY = useRef(0);
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    lastY.current = e.clientY;
    userTook();
    stage.current?.classList.add("dragging");
    try { stage.current?.setPointerCapture(e.pointerId); } catch { /* not supported */ }
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dy = e.clientY - lastY.current;
    lastY.current = e.clientY;
    setTilt((prev) => Math.max(0, Math.min(100, Math.round(prev - dy * 0.55))));
  };
  const endDrag = () => {
    dragging.current = false;
    stage.current?.classList.remove("dragging");
  };

  const note = tilt <= 20 ? d.notes.closed : tilt <= 80 ? d.notes.filtered : d.notes.open;
  const presets: { key: keyof typeof d.presets; t: number; on: boolean }[] = [
    { key: "open", t: 100, on: tilt > 80 },
    { key: "filtered", t: 55, on: tilt > 20 && tilt <= 80 },
    { key: "closed", t: 0, on: tilt <= 20 },
  ];

  return (
    <Sec id="demo">
      <Eyebrow n={n}>{d.eyebrow}</Eyebrow>
      <div className="split" style={{ marginBottom: "clamp(24px,3.5vw,36px)" }}>
        <div>
          <Title a={d.titleA} b={d.titleB} />
        </div>
        <p className="dek" style={{ marginTop: 0 }}>
          {d.dek}
        </p>
      </div>

      <div className="demo">
        <div className="panel">
          <div className="stagehead">
            <p className="fldlab" style={{ margin: 0 }}>{d.livePreview}</p>
            <p className={`draghint${hintGone ? " gone" : ""}`}>{d.dragHint}</p>
          </div>

          <div
            className="stage"
            ref={stage}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={endDrag}
          >
            <StageScene />
            <div className="flare" ref={flare} />
            <div className="daylight" ref={daylight} />
            <div className="blind">
              <div className="headrail" ref={headrail} />
              <div className="slatbox" ref={slatbox} />
              <div className="btmrail" ref={btmrail} />
              <div className="cord" ref={cordL} />
              <div className="cord" ref={cordR} />
            </div>
            <div className="bloom" ref={bloom} />
            <div className="shafts" ref={shafts} />
            <div className="motes" ref={motes} />
            <div className="vig" />
            <div className="frame" />
            <div className="warmth" ref={warmth} />
          </div>

          <div className="stagebar">
            <button className="ghostbtn" type="button" onClick={() => { setHintGone(true); play(); }}>
              {d.replay}
            </button>
          </div>
          <p className="cap">{d.caption}</p>
        </div>

        <div className="panel">
          <div className="fld">
            <p className="fldlab" id="lab-mat">{d.materialLabel}</p>
            <div className="opts" role="group" aria-labelledby="lab-mat">
              {(["alu", "wood"] as VenetianMaterialId[]).map((id) => (
                <button
                  key={id}
                  className="opt"
                  type="button"
                  aria-pressed={mat === id}
                  onClick={() => {
                    setMat(id);
                    setFinIndex(id === "wood" ? 3 : 0);
                    userTook();
                  }}
                >
                  {d.materials[id]}
                  <small>{d.materialSubs[id]}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="fld">
            <p className="fldlab" id="lab-sun">{d.daylightLabel}</p>
            <div className="opts" role="group" aria-labelledby="lab-sun">
              {(["morning", "midday", "golden", "dusk"] as SunId[]).map((id) => (
                <button
                  key={id}
                  className="opt"
                  type="button"
                  aria-pressed={sun === id}
                  onClick={() => { setSun(id); userTook(); }}
                >
                  {d.daylights[id]}
                </button>
              ))}
            </div>
          </div>

          <div className="fld">
            <label className="fldlab" htmlFor="ven-tilt">
              {d.tiltLabel} — <span>{shown}</span>°
            </label>
            <input
              className="slider"
              type="range"
              id="ven-tilt"
              min={0}
              max={100}
              step={1}
              value={tilt}
              onChange={(e) => { userTook(); setTilt(parseInt(e.target.value, 10)); }}
            />
            <div className="opts" style={{ marginTop: 12 }}>
              {presets.map((p) => (
                <button
                  key={p.key}
                  className="opt"
                  type="button"
                  aria-pressed={p.on}
                  onClick={() => { userTook(); setTilt(p.t); }}
                >
                  {d.presets[p.key]}
                </button>
              ))}
            </div>
            <p className="modenote">{note}</p>
          </div>

          <div className="fld">
            <label className="fldlab" htmlFor="ven-drop">
              {d.dropLabel} — <span>{drop}</span>
              {d.dropSuffix}
            </label>
            <input
              className="slider"
              type="range"
              id="ven-drop"
              min={15}
              max={100}
              step={5}
              value={drop}
              onChange={(e) => { userTook(); setDrop(parseInt(e.target.value, 10)); }}
            />
          </div>

          <div className="fld">
            <p className="fldlab" id="lab-fin">{d.finishLabel}</p>
            <div className="swrow" role="group" aria-labelledby="lab-fin">
              {finishes.map((f, i) => (
                <button
                  key={f.name}
                  type="button"
                  className="swbtn"
                  style={{ background: f.hex }}
                  title={f.name}
                  aria-label={f.name}
                  aria-pressed={i === finIndex}
                  onClick={() => { setFinIndex(i); userTook(); }}
                />
              ))}
            </div>
          </div>

          <div className="readout">
            <b>{`${d.materials[mat]} · ${fin.name} · ${shown}°`}</b>
            <button
              type="button"
              className="btn"
              onClick={() => quoteThis("venetian", "configuratorName" in fin ? fin.configuratorName : undefined)}
            >
              {c.quoteThis} <span className="ar" aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </Sec>
  );
}
