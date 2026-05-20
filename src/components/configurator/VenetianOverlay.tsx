import type { Fabric } from "@/lib/configurator/types";

const APERTURE = { x: 200, y: 80, w: 400, h: 360 };

export function VenetianOverlay({
  fabric,
  opacity,
  uniqueId,
}: {
  fabric: Fabric;
  opacity: number; // 0 (blackout/closed) → 1 (sheer/open)
  uniqueId: string;
}) {
  const slatHeight = 11;
  const baseGap = 4;
  const gap = baseGap * (0.2 + opacity * 1.4);
  const rowHeight = slatHeight + gap;
  const slats = Math.ceil(APERTURE.h / rowHeight);

  const gradientId = `ve-grad-${uniqueId}`;
  const patternId = `ve-tex-${uniqueId}`;
  const shadeId = `ve-shade-${uniqueId}`;
  const slatFill = fabric.image ? `url(#${patternId})` : `url(#${gradientId})`;

  return (
    <g style={{ transition: "opacity 220ms ease" }}>
      <defs>
        {/* Solid fallback gradient (used when no texture image is provided) */}
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fabric.highlightHex} />
          <stop offset="55%" stopColor={fabric.hex} />
          <stop offset="100%" stopColor={fabric.shadowHex} />
        </linearGradient>

        {/* Continuous wood texture across the whole aperture — every slat
            samples from this pattern in user-space coords, so the grain
            reads like one solid piece of wood sliced into strips. */}
        {fabric.image && (
          <pattern
            id={patternId}
            patternUnits="userSpaceOnUse"
            x={APERTURE.x}
            y={APERTURE.y}
            width={APERTURE.w}
            height={APERTURE.h}
          >
            <image
              href={fabric.image}
              x="0"
              y="0"
              width={APERTURE.w}
              height={APERTURE.h}
              preserveAspectRatio="xMidYMid slice"
            />
          </pattern>
        )}

        {/* Top-to-bottom shade overlay applied per-slat to give that
            curved 3D feel even with the photographic wood texture. */}
        <linearGradient id={shadeId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
          <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="100%" stopColor="#1A1714" stopOpacity="0.28" />
        </linearGradient>
      </defs>

      {/* head rail */}
      <rect x={APERTURE.x - 6} y={APERTURE.y - 8} width={APERTURE.w + 12} height={12} fill="#1A1714" />

      {/* slats */}
      {Array.from({ length: slats }).map((_, i) => {
        const y = APERTURE.y + 4 + i * rowHeight;
        if (y + slatHeight > APERTURE.y + APERTURE.h) return null;
        return (
          <g key={i}>
            {/* texture / colour base */}
            <rect
              x={APERTURE.x + 4}
              y={y}
              width={APERTURE.w - 8}
              height={slatHeight}
              rx="1.5"
              fill={slatFill}
              style={{ transition: "y 220ms ease" }}
            />
            {/* per-slat curvature shade */}
            <rect
              x={APERTURE.x + 4}
              y={y}
              width={APERTURE.w - 8}
              height={slatHeight}
              rx="1.5"
              fill={`url(#${shadeId})`}
            />
            {/* slat bottom edge shadow */}
            <line
              x1={APERTURE.x + 4}
              x2={APERTURE.x + APERTURE.w - 4}
              y1={y + slatHeight}
              y2={y + slatHeight}
              stroke="#1A1714"
              strokeOpacity="0.32"
              strokeWidth="0.6"
            />
          </g>
        );
      })}

      {/* tilt cords */}
      <line x1={APERTURE.x + 24} y1={APERTURE.y - 4} x2={APERTURE.x + 24} y2={APERTURE.y + APERTURE.h} stroke="#1A1714" strokeOpacity="0.4" strokeWidth="0.6" />
      <line x1={APERTURE.x + APERTURE.w - 24} y1={APERTURE.y - 4} x2={APERTURE.x + APERTURE.w - 24} y2={APERTURE.y + APERTURE.h} stroke="#1A1714" strokeOpacity="0.4" strokeWidth="0.6" />

      {/* bottom rail */}
      <rect x={APERTURE.x - 6} y={APERTURE.y + APERTURE.h - 6} width={APERTURE.w + 12} height={10} fill="#1A1714" />

      {/* pull wand */}
      <line x1={APERTURE.x + APERTURE.w + 14} y1={APERTURE.y - 4} x2={APERTURE.x + APERTURE.w + 14} y2={APERTURE.y + 180} stroke="#1A1714" strokeOpacity="0.7" strokeWidth="1" />
      <circle cx={APERTURE.x + APERTURE.w + 14} cy={APERTURE.y + 184} r="2.6" fill="#1A1714" opacity="0.7" />
    </g>
  );
}
