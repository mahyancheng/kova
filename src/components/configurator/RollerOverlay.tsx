import type { Fabric } from "@/lib/configurator/types";

export function RollerOverlay({
  fabric,
  opacity,
  uniqueId,
}: {
  fabric: Fabric;
  opacity: number; // 0 (blackout) → 1 (sheer)
  uniqueId: string;
}) {
  // Fabric translucency: at high opacity (sheer), let more light bleed
  // through so the outside view is visible behind the blind. At 0 (blackout),
  // the fabric stays fully opaque.
  const fabricAlpha = 1 - opacity * 0.55;

  return (
    <g style={{ transition: "opacity 220ms ease" }}>
      <defs>
        <linearGradient id={`ro-${uniqueId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fabric.highlightHex} />
          <stop offset="55%" stopColor={fabric.hex} />
          <stop offset="100%" stopColor={fabric.shadowHex} />
        </linearGradient>
      </defs>

      {/* fabric panel — fills the aperture */}
      <rect
        x="200"
        y="80"
        width="400"
        height="360"
        fill={`url(#ro-${uniqueId})`}
        opacity={fabricAlpha}
        style={{ transition: "opacity 280ms ease" }}
      />

      {/* subtle weave lines on top of the fabric */}
      {Array.from({ length: 28 }).map((_, i) => (
        <line
          key={i}
          x1="200"
          x2="600"
          y1={88 + i * 12}
          y2={88 + i * 12}
          stroke="#1A1714"
          strokeOpacity={0.05}
          strokeWidth="0.6"
        />
      ))}

      {/* roll cylinder at the top of the aperture */}
      <rect x="194" y="72" width="412" height="18" rx="2" fill={fabric.shadowHex} />
      <rect x="194" y="72" width="412" height="6" fill="#1A1714" opacity="0.35" />

      {/* bottom hem bar */}
      <rect x="200" y="432" width="400" height="6" fill="#1A1714" opacity="0.85" />

      {/* pull cord on the right */}
      <line x1="586" y1="86" x2="586" y2="500" stroke="#1A1714" strokeOpacity="0.45" strokeWidth="0.7" />
      <circle cx="586" cy="504" r="3.2" fill="#1A1714" opacity="0.55" />
    </g>
  );
}
