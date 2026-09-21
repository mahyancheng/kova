import { useId, type ReactElement } from "react";
import { shade } from "@/lib/brochure/data";

/**
 * SVG window renderers, ported from the drawing functions in the client's
 * HTML mockups (`slats()`, `vanes()`, `miniWin()`, `card()` and the static
 * hero artwork).
 *
 * The originals built SVG imperatively with createElementNS into a <g>.
 * Here the same maths returns declarative JSX instead, so the artwork is
 * part of the React tree and ships in the prerendered HTML — no effect has
 * to run before a visitor (or a crawler) sees the window.
 *
 * Geometry is kept identical to the mockups, including the constants
 * (80° slat sweep, 1.07 pitch overlap, 2.6px stack spacing, 8–90° vane
 * sweep). Changing them changes the drawing, so they are deliberately not
 * "tidied" into named options.
 */

/* ------------------------------------------------------------------ *
 * Venetian slats
 * ------------------------------------------------------------------ */

export type SlatOpts = {
  x0: number; y0: number; W: number; H: number;
  col: string;
  /** 0 = closed, 100 = fully open (edge-on). */
  tilt: number;
  /** 15–100, how far the blind is lowered. */
  drop: number;
  pitch: number;
  wood?: boolean;
};

export function slatRects({ x0, y0, W, H, col, tilt, drop, pitch, wood }: SlatOpts): ReactElement[] {
  const out: ReactElement[] = [];
  const a = (tilt / 100) * 80 * (Math.PI / 180);
  const h = Math.max(1.6, pitch * 1.07 * Math.cos(a));
  const total = Math.floor(H / pitch);
  const lowered = Math.max(1, Math.round((total * drop) / 100));
  const stacked = total - lowered;
  const stackH = stacked * 2.6;
  const yTop = y0 + stackH;
  const band = (H * drop) / 100 - stackH;
  const step = lowered > 1 ? band / lowered : band;

  // stacked slats bunched under the headrail
  for (let s = 0; s < stacked; s++) {
    out.push(<rect key={`s${s}`} x={x0} y={y0 + s * 2.6} width={W} height={2.2} fill={shade(col, 0.93)} />);
  }
  // lowered slats — face, top highlight, bottom shadow, optional grain
  for (let i = 0; i < lowered; i++) {
    const cy = yTop + step * (i + 0.5);
    const hh = Math.min(h, step * 1.08);
    const y = cy - hh / 2;
    out.push(<rect key={`f${i}`} x={x0} y={y} width={W} height={hh} fill={col} />);
    out.push(
      <rect key={`l${i}`} x={x0} y={y} width={W} height={Math.max(0.8, hh * 0.26)} fill="#FFFFFF" fillOpacity=".22" />,
    );
    out.push(
      <rect
        key={`d${i}`}
        x={x0}
        y={y + hh - Math.max(0.8, hh * 0.2)}
        width={W}
        height={Math.max(0.8, hh * 0.2)}
        fill="#000000"
        fillOpacity=".14"
      />,
    );
    if (wood && hh > 9) {
      out.push(<rect key={`g${i}`} x={x0} y={y + hh * 0.5} width={W} height={0.9} fill="#000000" fillOpacity=".09" />);
    }
  }
  // lift cords + bottom rail
  out.push(<rect key="c1" x={x0 + W * 0.22} y={y0} width={1.6} height={stackH + band} fill="#000000" fillOpacity=".16" />);
  out.push(<rect key="c2" x={x0 + W * 0.78} y={y0} width={1.6} height={stackH + band} fill="#000000" fillOpacity=".16" />);
  out.push(
    <rect key="rail" x={x0} y={y0 + stackH + band} width={W} height={Math.max(4, pitch * 0.34)} fill={shade(col, 0.8)} />,
  );
  return out;
}

/* ------------------------------------------------------------------ *
 * VertiSheer vanes
 * ------------------------------------------------------------------ */

export type VaneOpts = {
  x0: number; y0: number; W: number; H: number;
  col: string;
  /** 0 = edge-on/open, 100 = flat/closed. */
  a: number;
  /** 15–100, how far the system is drawn across the opening. */
  cov: number;
  n: number;
};

export function vaneRects({ x0, y0, W, H, col, a, cov, n }: VaneOpts): ReactElement[] {
  const out: ReactElement[] = [];
  const theta = (8 + (a / 100) * 82) * (Math.PI / 180);
  const pitch = W / n;
  const full = pitch * 1.04;
  const w = Math.max(2, full * Math.sin(theta));
  const deployed = Math.max(1, Math.round((n * cov) / 100));
  const stacked = n - deployed;
  const stackW = stacked * 7;
  const span = W - stackW;
  const step = deployed > 1 ? span / deployed : span;

  // stacked bundle at the left
  for (let s = 0; s < stacked; s++) {
    out.push(<rect key={`s${s}`} x={x0 + s * 7} y={y0} width={9} height={H} fill={shade(col, 0.9)} fillOpacity=".95" />);
    out.push(<rect key={`sh${s}`} x={x0 + s * 7} y={y0} width={2.5} height={H} fill="#FFFFFF" fillOpacity=".18" />);
  }
  // deployed vanes
  for (let i = 0; i < deployed; i++) {
    const cx = x0 + stackW + step * (i + 0.5);
    const vw = Math.min(w, step * 1.06);
    out.push(<rect key={`v${i}`} x={cx - vw / 2} y={y0} width={vw} height={H} fill={col} fillOpacity=".94" />);
    out.push(
      <rect key={`vl${i}`} x={cx - vw / 2} y={y0} width={Math.max(1, vw * 0.2)} height={H} fill="#FFFFFF" fillOpacity=".16" />,
    );
    out.push(
      <rect
        key={`vd${i}`}
        x={cx + vw / 2 - Math.max(1, vw * 0.14)}
        y={y0}
        width={Math.max(1, vw * 0.14)}
        height={H}
        fill="#000000"
        fillOpacity=".08"
      />,
    );
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * Shared mini-window (venetian clock strip + material cards)
 * ------------------------------------------------------------------ */

export function VenetianMiniWindow({
  w, h, col, tilt, pitch, wood = false, dim = 0, label,
}: {
  w: number; h: number; col: string; tilt: number; pitch: number;
  wood?: boolean; dim?: number; label: string;
}) {
  const uid = useId().replace(/:/g, "");
  const X = w * 0.085, Y = h * 0.075, W = w * 0.83, H = h * 0.815;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label}>
      <defs>
        <linearGradient id={`s${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CFE0E4" />
          <stop offset="1" stopColor="#EFD9B8" />
        </linearGradient>
        <clipPath id={`c${uid}`}>
          <rect x={X} y={Y} width={W} height={H} />
        </clipPath>
      </defs>
      <rect width={w} height={h} fill="#F7F4EB" />
      <g clipPath={`url(#c${uid})`}>
        <rect x={X} y={Y} width={W} height={H} fill={`url(#s${uid})`} />
        <rect x={X} y={Y + H * 0.68} width={W} height={H * 0.32} fill="#B8C4B0" fillOpacity=".7" />
        <path
          d={`M${X + W * 0.1} ${Y + H}c${W * 0.1} -${H * 0.34} ${W * 0.24} -${H * 0.5} ${W * 0.38} -${H * 0.5}s${W * 0.28} ${H * 0.16} ${W * 0.38} ${H * 0.5}z`}
          fill="#B8C4B0"
          fillOpacity=".7"
        />
        <rect x={X} y={Y} width={W} height={H} fill="#2A2622" fillOpacity={dim} />
        <g>{slatRects({ x0: X, y0: Y, W, H, col, tilt, drop: 100, pitch, wood })}</g>
      </g>
      <rect x={X - w * 0.03} y={Y - h * 0.05} width={W + w * 0.06} height={h * 0.05} rx={1.5} fill={shade(col, 0.82)} />
      <rect
        x={X + w * 0.012}
        y={Y + h * 0.012}
        width={W - w * 0.024}
        height={H - h * 0.024}
        fill="none"
        stroke="#D6CFBB"
        strokeWidth={w * 0.024}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Hero artwork
 * ------------------------------------------------------------------ */

export function RollerHeroArt({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 960 600" role="img" aria-label={label}>
      <defs>
        <linearGradient id="rhSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CFE0E4" /><stop offset=".55" stopColor="#E6E2D3" /><stop offset="1" stopColor="#EFD9B8" />
        </linearGradient>
        <linearGradient id="rhFab" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CFC4B0" /><stop offset=".62" stopColor="#C0AC91" /><stop offset="1" stopColor="#B39F84" />
        </linearGradient>
        <pattern id="rhWeave" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="none" />
          <path d="M0 3h6M3 0v6" stroke="#8E7A62" strokeOpacity=".16" strokeWidth="1" />
        </pattern>
        <linearGradient id="rhGlow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF3DC" stopOpacity=".55" /><stop offset="1" stopColor="#FFF3DC" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="960" height="600" fill="#F7F4EB" />
      <rect x="90" y="52" width="780" height="496" fill="url(#rhSky)" />
      <g fill="#B8C4B0" opacity=".55">
        <rect x="120" y="420" width="720" height="128" />
        <path d="M180 420c40-70 92-104 150-104s112 34 150 104z" />
        <path d="M560 420c30-52 70-78 112-78s84 26 112 78z" />
      </g>
      <g stroke="#EAE6DA" strokeWidth="10"><path d="M480 52v496M90 300h780" /></g>
      <rect x="74" y="36" width="812" height="352" fill="url(#rhFab)" />
      <rect x="74" y="36" width="812" height="352" fill="url(#rhWeave)" />
      <rect x="74" y="36" width="812" height="352" fill="url(#rhGlow)" />
      <rect x="74" y="36" width="812" height="26" fill="#A08C72" />
      <rect x="74" y="376" width="812" height="12" fill="#8E7B63" />
      <rect x="874" y="62" width="4" height="240" fill="#6F6A60" opacity=".45" />
      <g fill="none" stroke="#D6CFBB" strokeWidth="8"><rect x="86" y="48" width="788" height="504" /></g>
      <rect x="74" y="552" width="812" height="14" fill="#E3DCCB" />
    </svg>
  );
}

export function VenetianHeroArt({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 960 600" role="img" aria-label={label}>
      <defs>
        <linearGradient id="vhSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CFE0E4" /><stop offset=".55" stopColor="#E6E2D3" /><stop offset="1" stopColor="#EFD9B8" />
        </linearGradient>
        <clipPath id="vhClip"><rect x="70" y="52" width="820" height="472" /></clipPath>
      </defs>
      <rect width="960" height="600" fill="#F7F4EB" />
      <g clipPath="url(#vhClip)">
        <rect x="70" y="52" width="820" height="472" fill="url(#vhSky)" />
        <g fill="#B8C4B0" opacity=".55">
          <rect x="70" y="404" width="820" height="120" />
          <path d="M150 404c36-62 84-94 136-94s100 32 136 94z" />
          <path d="M560 404c28-48 66-72 106-72s78 24 106 72z" />
        </g>
        <g stroke="#CBC4B2" strokeWidth="6" opacity=".7"><path d="M480 52v472" /></g>
        <g>{slatRects({ x0: 70, y0: 52, W: 820, H: 472, col: "#7A4B2C", tilt: 45, drop: 100, pitch: 40, wood: true })}</g>
      </g>
      <g fill="none" stroke="#D6CFBB" strokeWidth="10"><rect x="65" y="47" width="830" height="482" /></g>
      <rect x="56" y="34" width="848" height="20" rx="2" fill="#6E4A2E" />
      <rect x="56" y="528" width="848" height="14" fill="#E3DCCB" />
    </svg>
  );
}

export function VertiSheerHeroArt({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 960 600" role="img" aria-label={label}>
      <defs>
        <linearGradient id="shSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CFE0E4" /><stop offset=".55" stopColor="#E6E2D3" /><stop offset="1" stopColor="#EFD9B8" />
        </linearGradient>
        <clipPath id="shClip"><rect x="70" y="52" width="820" height="472" /></clipPath>
      </defs>
      <rect width="960" height="600" fill="#F7F4EB" />
      <g clipPath="url(#shClip)">
        <rect x="70" y="52" width="820" height="472" fill="url(#shSky)" />
        <g fill="#B8C4B0" opacity=".55">
          <rect x="70" y="404" width="820" height="120" />
          <path d="M150 404c36-62 84-94 136-94s100 32 136 94z" />
          <path d="M560 404c28-48 66-72 106-72s78 24 106 72z" />
        </g>
        <g stroke="#CBC4B2" strokeWidth="6" opacity=".8"><path d="M480 52v472" /></g>
        <rect x="70" y="52" width="820" height="472" fill="#E4DCCB" opacity=".38" />
        <g>{vaneRects({ x0: 70, y0: 52, W: 820, H: 472, col: "#CBB89C", a: 48, cov: 100, n: 14 })}</g>
      </g>
      <g fill="none" stroke="#D6CFBB" strokeWidth="10"><rect x="65" y="47" width="830" height="482" /></g>
      <rect x="56" y="36" width="848" height="18" rx="2" fill="#B0A48D" />
      <rect x="56" y="528" width="848" height="14" fill="#E3DCCB" />
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Roller fabric cards
 * ------------------------------------------------------------------ */

export function RollerFabricPreview({
  variant, label,
}: {
  variant: "blackout" | "dimout" | "sunscreen";
  label: string;
}) {
  const uid = useId().replace(/:/g, "");
  if (variant === "blackout") {
    return (
      <svg viewBox="0 0 400 300" role="img" aria-label={label}>
        <rect width="400" height="300" fill="#F7F4EB" />
        <rect x="40" y="24" width="320" height="240" fill="#2A2622" />
        <rect x="40" y="24" width="320" height="240" fill="#1F1E1B" opacity=".55" />
        <rect x="34" y="18" width="332" height="14" fill="#3A342C" />
        <g fill="#F2E3BE" opacity=".85">
          <rect x="34" y="32" width="6" height="232" /><rect x="360" y="32" width="6" height="232" />
          <rect x="40" y="264" width="320" height="5" />
        </g>
        <g fill="none" stroke="#D6CFBB" strokeWidth="6"><rect x="43" y="27" width="314" height="234" /></g>
      </svg>
    );
  }
  if (variant === "dimout") {
    return (
      <svg viewBox="0 0 400 300" role="img" aria-label={label}>
        <defs>
          <linearGradient id={`soft${uid}`} x1=".1" y1="0" x2=".9" y2="1">
            <stop offset="0" stopColor="#FFF3DC" stopOpacity=".34" /><stop offset=".7" stopColor="#FFF3DC" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="#F7F4EB" />
        <rect x="40" y="24" width="320" height="240" fill="#E4D8BE" />
        <rect x="40" y="24" width="320" height="240" fill="#9A9086" opacity=".62" />
        <rect x="40" y="24" width="320" height="240" fill={`url(#soft${uid})`} />
        <rect x="34" y="18" width="332" height="14" fill="#A69A85" />
        <g fill="#F2E3BE" opacity=".7"><rect x="34" y="32" width="5" height="232" /><rect x="361" y="32" width="5" height="232" /></g>
        <g fill="none" stroke="#D6CFBB" strokeWidth="6"><rect x="43" y="27" width="314" height="234" /></g>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={label}>
      <defs>
        <linearGradient id={`ss${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CFE0E4" /><stop offset="1" stopColor="#EFD9B8" />
        </linearGradient>
        <pattern id={`open${uid}`} width="5" height="5" patternUnits="userSpaceOnUse">
          <rect width="5" height="5" fill="#8E8172" fillOpacity=".42" />
          <circle cx="2.5" cy="2.5" r="1.5" fill="#F0E7D6" fillOpacity=".5" />
        </pattern>
      </defs>
      <rect width="400" height="300" fill="#F7F4EB" />
      <rect x="40" y="24" width="320" height="240" fill={`url(#ss${uid})`} />
      <g fill="#B8C4B0" opacity=".7">
        <rect x="40" y="200" width="320" height="64" />
        <path d="M80 200c22-38 52-56 84-56s62 18 84 56z" />
      </g>
      <rect x="40" y="24" width="320" height="240" fill={`url(#open${uid})`} />
      <rect x="34" y="18" width="332" height="14" fill="#9A8C79" />
      <g fill="none" stroke="#D6CFBB" strokeWidth="6"><rect x="43" y="27" width="314" height="234" /></g>
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * VertiSheer mode cards
 * ------------------------------------------------------------------ */

export function VertiSheerModePreview({ angle, label }: { angle: number; label: string }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={label}>
      <defs>
        <linearGradient id={`sk${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CFE0E4" /><stop offset="1" stopColor="#EFD9B8" />
        </linearGradient>
        <clipPath id={`cl${uid}`}><rect x="34" y="22" width="332" height="244" /></clipPath>
      </defs>
      <rect width="400" height="300" fill="#F7F4EB" />
      <g clipPath={`url(#cl${uid})`}>
        <rect x="34" y="22" width="332" height="244" fill={`url(#sk${uid})`} />
        <rect x="34" y="206" width="332" height="60" fill="#B8C4B0" fillOpacity=".7" />
        <path d="M60 266c30-54 72-80 120-80s90 26 120 80z" fill="#B8C4B0" fillOpacity=".7" />
        <rect x="34" y="22" width="332" height="244" fill="#E4DCCB" fillOpacity=".34" />
        <rect x="34" y="22" width="332" height="244" fill="#2A2622" fillOpacity={(angle / 100) * 0.16} />
        <g>{vaneRects({ x0: 34, y0: 22, W: 332, H: 244, col: "#CBB89C", a: angle, cov: 100, n: 9 })}</g>
      </g>
      <rect x="28" y="14" width="344" height="11" rx="1.5" fill="#B0A48D" />
      <rect x="39" y="27" width="322" height="234" fill="none" stroke="#D6CFBB" strokeWidth="8" />
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Live previews for the roller + vertisheer designers
 * ------------------------------------------------------------------ */

const RX = 70, RY = 40, RW = 580, RH = 380;

/** Roller designer preview — the mockup's `draw()`, all three blind types. */
export function RollerDesignerPreview({
  type, opacity, hex, drop, label,
}: {
  type: "roller" | "venetian" | "vertisheer";
  opacity: "sunscreen" | "dimout" | "blackout";
  hex: string;
  drop: number;
  label: string;
}) {
  const cover = RH * (drop / 100);
  const body: ReactElement[] = [];

  if (type === "roller") {
    const op = opacity === "blackout" ? 1 : opacity === "dimout" ? 0.93 : 0.78;
    body.push(<rect key="f" x={RX} y={RY} width={RW} height={cover} fill={hex} fillOpacity={op} />);
    body.push(<rect key="w" x={RX} y={RY} width={RW} height={cover} fill="url(#pvweave)" />);
    if (opacity === "sunscreen") {
      body.push(<rect key="o" x={RX} y={RY} width={RW} height={cover} fill="url(#pvopen)" />);
    }
    body.push(<rect key="bar" x={RX} y={RY + cover - 10} width={RW} height={10} fill={shade(hex, 0.78)} />);
    body.push(<rect key="line" x={RX} y={RY + cover} width={RW} height={3} fill="#FFF3DC" fillOpacity=".5" />);
    body.push(
      <rect key="chain" x={RX + RW - 8} y={RY} width={3} height={Math.max(60, cover * 0.7)} fill="#6F6A60" fillOpacity=".45" />,
    );
  }

  if (type === "venetian") {
    const slatH = 14, gap = 4;
    const tilt = opacity === "blackout" ? 1 : opacity === "dimout" ? 0.8 : 0.55;
    let y = RY, i = 0;
    while (y < RY + cover) {
      const hgt = Math.min(slatH * tilt + 4, RY + cover - y);
      if (hgt <= 0) break;
      body.push(<rect key={`v${i}`} x={RX} y={y} width={RW} height={hgt} fill={hex} rx={1.5} />);
      body.push(
        <rect key={`vl${i}`} x={RX} y={y} width={RW} height={Math.max(1, hgt * 0.28)} fill="#FFFFFF" fillOpacity=".16" />,
      );
      y += slatH + gap;
      i++;
    }
    body.push(<rect key="cl" x={RX + 40} y={RY} width={2} height={cover} fill={shade(hex, 0.7)} />);
    body.push(<rect key="cr" x={RX + RW - 42} y={RY} width={2} height={cover} fill={shade(hex, 0.7)} />);
  }

  if (type === "vertisheer") {
    const bandW = 46, bg = 10;
    const bandOp = opacity === "blackout" ? 0.98 : opacity === "dimout" ? 0.85 : 0.62;
    body.push(<rect key="sheer" x={RX} y={RY} width={RW} height={cover} fill={hex} fillOpacity={0.28} />);
    let x = RX, i = 0;
    while (x < RX + RW) {
      const w = Math.min(bandW, RX + RW - x);
      body.push(<rect key={`b${i}`} x={x} y={RY} width={w} height={cover} fill={hex} fillOpacity={bandOp} />);
      body.push(
        <rect key={`bl${i}`} x={x} y={RY} width={Math.max(1, w * 0.22)} height={cover} fill="#FFFFFF" fillOpacity=".12" />,
      );
      x += bandW + bg;
      i++;
    }
    body.push(
      <rect key="hem" x={RX} y={RY + cover - 6} width={RW} height={6} fill={shade(hex, 0.75)} fillOpacity=".7" />,
    );
  }

  return (
    <svg viewBox="0 0 720 480" role="img" aria-label={label}>
      <defs>
        <linearGradient id="pvsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CFE0E4" /><stop offset=".6" stopColor="#E6E2D3" /><stop offset="1" stopColor="#EFD9B8" />
        </linearGradient>
        <pattern id="pvweave" width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M0 3h6M3 0v6" stroke="#000" strokeOpacity=".10" strokeWidth="1" />
        </pattern>
        <pattern id="pvopen" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="1.5" fill="#FFF6E2" fillOpacity=".5" />
        </pattern>
        <clipPath id="pvclip"><rect x="70" y="40" width="580" height="380" /></clipPath>
      </defs>
      <rect width="720" height="480" fill="#F7F4EB" />
      <g clipPath="url(#pvclip)">
        <rect x="70" y="40" width="580" height="380" fill="url(#pvsky)" />
        <g fill="#B8C4B0" opacity=".6">
          <rect x="70" y="330" width="580" height="90" />
          <path d="M120 330c30-52 68-78 112-78s82 26 112 78z" />
          <path d="M420 330c22-40 52-60 86-60s64 20 86 60z" />
        </g>
        <g stroke="#EFEADD" strokeWidth="8"><path d="M360 40v380M70 230h580" /></g>
        <g>{body}</g>
      </g>
      <g fill="none" stroke="#D6CFBB" strokeWidth="10"><rect x="65" y="35" width="590" height="390" /></g>
      <rect x="56" y="424" width="608" height="12" fill="#E3DCCB" />
      <rect x="56" y="24" width="608" height="16" rx="2" fill={shade(hex, 0.86)} />
    </svg>
  );
}

/** VertiSheer designer preview — vane rotation plus draw-across. */
export function VertiSheerDesignerPreview({
  hex, angle, cover, label,
}: {
  hex: string; angle: number; cover: number; label: string;
}) {
  return (
    <svg viewBox="0 0 900 520" role="img" aria-label={label}>
      <defs>
        <linearGradient id="vssky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CFE0E4" /><stop offset=".6" stopColor="#E6E2D3" /><stop offset="1" stopColor="#EFD9B8" />
        </linearGradient>
        <clipPath id="vsclip"><rect x="60" y="46" width="780" height="420" /></clipPath>
      </defs>
      <rect width="900" height="520" fill="#F7F4EB" />
      <g clipPath="url(#vsclip)">
        <rect x="60" y="46" width="780" height="420" fill="url(#vssky)" />
        <g fill="#B8C4B0" opacity=".6">
          <rect x="60" y="356" width="780" height="110" />
          <path d="M130 356c32-56 74-84 122-84s90 28 122 84z" />
          <path d="M500 356c24-44 56-66 94-66s70 22 94 66z" />
        </g>
        <g stroke="#CBC4B2" strokeWidth="5" opacity=".75"><path d="M450 46v420M60 260h780" /></g>
        <rect x="60" y="46" width="780" height="420" fill="#E4DCCB" opacity={(0.2 + (cover / 100) * 0.22).toFixed(3)} />
        <rect
          x="60" y="46" width="780" height="420"
          fill="#2A2622"
          opacity={((angle / 100) * 0.18 * (cover / 100)).toFixed(3)}
        />
        <g>{vaneRects({ x0: 60, y0: 46, W: 780, H: 420, col: hex, a: angle, cov: cover, n: 13 })}</g>
      </g>
      <g fill="none" stroke="#D6CFBB" strokeWidth="10"><rect x="55" y="41" width="790" height="430" /></g>
      <rect x="46" y="28" width="808" height="16" rx="2" fill={shade(hex, 0.84)} />
      <rect x="46" y="470" width="808" height="12" fill="#E3DCCB" />
    </svg>
  );
}
