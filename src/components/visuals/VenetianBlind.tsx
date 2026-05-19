export function VenetianBlind({ className }: { className?: string }) {
  const slats = 22;
  return (
    <svg
      viewBox="0 0 400 480"
      className={className}
      role="img"
      aria-label="Venetian blind illustration"
    >
      <defs>
        <linearGradient id="vb-slat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C8B68C" />
          <stop offset="55%" stopColor="#A98F61" />
          <stop offset="100%" stopColor="#7A6440" />
        </linearGradient>
        <linearGradient id="vb-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF1C9" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#F0EEE5" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="400" height="480" fill="#F0EEE5" />

      {/* window recess */}
      <rect
        x="48"
        y="40"
        width="304"
        height="400"
        rx="2"
        fill="#FBFAF3"
        stroke="#1A1714"
        strokeWidth="1.25"
      />

      {/* light glow behind */}
      <rect x="56" y="48" width="288" height="384" fill="url(#vb-light)" />

      {/* head rail */}
      <rect x="52" y="40" width="296" height="12" fill="#1A1714" />

      {/* slats */}
      {Array.from({ length: slats }).map((_, i) => {
        const y = 64 + i * 16;
        return (
          <g key={i}>
            <rect
              x="56"
              y={y}
              width="288"
              height="11"
              rx="1.5"
              fill="url(#vb-slat)"
            />
            <line
              x1="56"
              x2="344"
              y1={y + 11}
              y2={y + 11}
              stroke="#1A1714"
              strokeOpacity="0.25"
              strokeWidth="0.6"
            />
          </g>
        );
      })}

      {/* tilt cord left */}
      <line
        x1="76"
        y1="52"
        x2="76"
        y2={64 + slats * 16}
        stroke="#1A1714"
        strokeOpacity="0.45"
        strokeWidth="0.6"
      />
      {/* tilt cord right */}
      <line
        x1="324"
        y1="52"
        x2="324"
        y2={64 + slats * 16}
        stroke="#1A1714"
        strokeOpacity="0.45"
        strokeWidth="0.6"
      />

      {/* bottom rail */}
      <rect x="52" y={64 + slats * 16 - 2} width="296" height="8" fill="#1A1714" />

      {/* pull wand */}
      <line
        x1="334"
        y1="56"
        x2="334"
        y2="220"
        stroke="#1A1714"
        strokeOpacity="0.7"
        strokeWidth="1"
      />
      <circle cx="334" cy="222" r="2.6" fill="#1A1714" opacity="0.7" />
    </svg>
  );
}
