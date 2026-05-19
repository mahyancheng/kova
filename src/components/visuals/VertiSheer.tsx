export function VertiSheer({ className }: { className?: string }) {
  const vanes = 9;
  const vaneWidth = 30;
  const gap = 4;
  const startX = 56;

  return (
    <svg
      viewBox="0 0 400 480"
      className={className}
      role="img"
      aria-label="VertiSheer illustration"
    >
      <defs>
        <linearGradient id="vs-vane" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F2EEDD" />
          <stop offset="100%" stopColor="#D9CFAE" />
        </linearGradient>
        <linearGradient id="vs-sheer" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFAEB" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#F0EEE5" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="vs-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF4D2" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#F0EEE5" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="400" height="480" fill="#F0EEE5" />

      {/* window */}
      <rect
        x="40"
        y="40"
        width="320"
        height="400"
        rx="2"
        fill="#FBFAF3"
        stroke="#1A1714"
        strokeWidth="1.25"
      />

      {/* background glow */}
      <rect x="48" y="48" width="304" height="384" fill="url(#vs-light)" />

      {/* sheer backing fabric */}
      <rect x="48" y="52" width="304" height="380" fill="url(#vs-sheer)" />

      {/* sheer vertical lines */}
      {Array.from({ length: 38 }).map((_, i) => (
        <line
          key={i}
          x1={48 + i * 8}
          x2={48 + i * 8}
          y1="52"
          y2="432"
          stroke="#1A1714"
          strokeOpacity="0.06"
          strokeWidth="0.5"
        />
      ))}

      {/* track */}
      <rect x="40" y="44" width="320" height="10" fill="#1A1714" />

      {/* opaque vanes */}
      {Array.from({ length: vanes }).map((_, i) => {
        const x = startX + i * (vaneWidth + gap);
        return (
          <g key={i}>
            <rect
              x={x}
              y={54}
              width={vaneWidth}
              height={376}
              rx={1}
              fill="url(#vs-vane)"
            />
            {/* subtle vane shadow */}
            <line
              x1={x + vaneWidth}
              x2={x + vaneWidth}
              y1={54}
              y2={430}
              stroke="#1A1714"
              strokeOpacity="0.18"
              strokeWidth="0.6"
            />
            {/* vane top mount */}
            <rect x={x + vaneWidth / 2 - 3} y={48} width={6} height={6} fill="#1A1714" opacity="0.7" />
          </g>
        );
      })}

      {/* hem chain */}
      <line x1="56" x2="344" y1="432" y2="432" stroke="#1A1714" strokeOpacity="0.35" strokeWidth="0.6" />
    </svg>
  );
}
