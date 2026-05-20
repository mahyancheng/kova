import type { Fabric } from "@/lib/configurator/types";

const APERTURE = { x: 200, y: 80, w: 400, h: 360 };

export function VertiSheerOverlay({
  fabric,
  opacity,
  uniqueId,
}: {
  fabric: Fabric;
  opacity: number; // 0 (sunscreen, more open) → 1 (sheer, most open)
  uniqueId: string;
}) {
  const vanes = 10;
  // As "openness" increases, each vane narrows so more sky shows between them.
  const vaneWidth = 28 - opacity * 10;
  const totalVaneWidth = vanes * vaneWidth;
  const totalGap = APERTURE.w - totalVaneWidth;
  const gap = totalGap / (vanes - 1);

  return (
    <g style={{ transition: "opacity 220ms ease" }}>
      <defs>
        <linearGradient id={`vs-${uniqueId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fabric.highlightHex} />
          <stop offset="100%" stopColor={fabric.shadowHex} />
        </linearGradient>
        <linearGradient id={`vs-sheer-${uniqueId}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={fabric.hex} stopOpacity="0.35" />
          <stop offset="100%" stopColor={fabric.hex} stopOpacity="0.12" />
        </linearGradient>
      </defs>

      {/* sheer backing fabric — softens the outside view but doesn't hide it */}
      <rect
        x={APERTURE.x}
        y={APERTURE.y}
        width={APERTURE.w}
        height={APERTURE.h}
        fill={`url(#vs-sheer-${uniqueId})`}
      />
      {/* sheer fine vertical weave */}
      {Array.from({ length: 40 }).map((_, i) => (
        <line
          key={i}
          x1={APERTURE.x + i * 10}
          x2={APERTURE.x + i * 10}
          y1={APERTURE.y}
          y2={APERTURE.y + APERTURE.h}
          stroke="#1A1714"
          strokeOpacity={0.06}
          strokeWidth="0.4"
        />
      ))}

      {/* track */}
      <rect x={APERTURE.x - 6} y={APERTURE.y - 8} width={APERTURE.w + 12} height={10} fill="#1A1714" />

      {/* opaque vanes (the "blind" element) */}
      {Array.from({ length: vanes }).map((_, i) => {
        const x = APERTURE.x + i * (vaneWidth + gap);
        return (
          <g key={i}>
            <rect
              x={x}
              y={APERTURE.y + 4}
              width={vaneWidth}
              height={APERTURE.h - 8}
              rx={1}
              fill={`url(#vs-${uniqueId})`}
              style={{ transition: "x 240ms ease, width 240ms ease" }}
            />
            {/* subtle right-edge shadow on each vane */}
            <line
              x1={x + vaneWidth}
              x2={x + vaneWidth}
              y1={APERTURE.y + 4}
              y2={APERTURE.y + APERTURE.h - 4}
              stroke="#1A1714"
              strokeOpacity="0.22"
              strokeWidth="0.6"
            />
            {/* vane mount on top */}
            <rect x={x + vaneWidth / 2 - 2.5} y={APERTURE.y - 6} width={5} height={6} fill="#1A1714" opacity="0.7" />
          </g>
        );
      })}

      {/* hem chain across the bottom */}
      <line
        x1={APERTURE.x + 6}
        x2={APERTURE.x + APERTURE.w - 6}
        y1={APERTURE.y + APERTURE.h - 4}
        y2={APERTURE.y + APERTURE.h - 4}
        stroke="#1A1714"
        strokeOpacity="0.35"
        strokeWidth="0.6"
      />
    </g>
  );
}
