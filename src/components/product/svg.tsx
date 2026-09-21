import type { ReactElement } from "react";
import { shade } from "@/lib/brochure/data";

/**
 * Drawn artwork for the product pages.
 *
 * Only the interactive previews are drawn — they redraw as the visitor
 * moves a slider, which a photograph cannot do. Every static window on
 * these pages uses real product photography instead.
 *
 * The maths is the supplied mockups' own (`vanes()`, `draw()`), converted
 * from imperative createElementNS into declarative JSX so the preview
 * renders server-side. Geometry constants are kept verbatim — changing
 * them changes the drawing.
 */

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

  for (let s = 0; s < stacked; s++) {
    out.push(<rect key={`s${s}`} x={x0 + s * 7} y={y0} width={9} height={H} fill={shade(col, 0.9)} fillOpacity=".95" />);
    out.push(<rect key={`sh${s}`} x={x0 + s * 7} y={y0} width={2.5} height={H} fill="#FFFFFF" fillOpacity=".18" />);
  }
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
 * Roller designer preview — the mockup's draw(), all three blind types
 * ------------------------------------------------------------------ */

const RX = 70, RY = 40, RW = 580, RH = 380;

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
    body.push(<rect key="hem" x={RX} y={RY + cover - 6} width={RW} height={6} fill={shade(hex, 0.75)} fillOpacity=".7" />);
  }

  return (
    <svg viewBox="0 0 720 480" role="img" aria-label={label} className="block w-full h-full">
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

/* ------------------------------------------------------------------ *
 * VertiSheer designer preview — vane rotation plus draw-across
 * ------------------------------------------------------------------ */

export function VertiSheerDesignerPreview({
  hex, angle, cover, label,
}: {
  hex: string; angle: number; cover: number; label: string;
}) {
  return (
    <svg viewBox="0 0 900 520" role="img" aria-label={label} className="block w-full h-full">
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
        <rect x="60" y="46" width="780" height="420" fill="#2A2622" opacity={((angle / 100) * 0.18 * (cover / 100)).toFixed(3)} />
        <g>{vaneRects({ x0: 60, y0: 46, W: 780, H: 420, col: hex, a: angle, cov: cover, n: 13 })}</g>
      </g>
      <g fill="none" stroke="#D6CFBB" strokeWidth="10"><rect x="55" y="41" width="790" height="430" /></g>
      <rect x="46" y="28" width="808" height="16" rx="2" fill={shade(hex, 0.84)} />
      <rect x="46" y="470" width="808" height="12" fill="#E3DCCB" />
    </svg>
  );
}
