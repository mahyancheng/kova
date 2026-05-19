export function RollerBlind({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 480"
      className={className}
      role="img"
      aria-label="Roller blind illustration"
    >
      <defs>
        <linearGradient id="rb-fabric" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8DEC4" />
          <stop offset="55%" stopColor="#D9C9A2" />
          <stop offset="100%" stopColor="#BFAA7C" />
        </linearGradient>
        <linearGradient id="rb-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF6DC" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F0EEE5" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="rb-roll" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9C8559" />
          <stop offset="50%" stopColor="#7E6A41" />
          <stop offset="100%" stopColor="#5E4F2F" />
        </linearGradient>
      </defs>

      {/* outer wall plane */}
      <rect width="400" height="480" fill="#F0EEE5" />

      {/* window frame */}
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

      {/* mullion */}
      <line x1="200" y1="40" x2="200" y2="440" stroke="#1A1714" strokeWidth="0.75" />
      <line x1="48" y1="240" x2="352" y2="240" stroke="#1A1714" strokeWidth="0.5" />

      {/* light wash behind blind */}
      <rect x="48" y="40" width="304" height="220" fill="url(#rb-light)" />

      {/* fabric rolled down ~60% */}
      <rect
        x="56"
        y="50"
        width="288"
        height="240"
        fill="url(#rb-fabric)"
      />

      {/* subtle fabric weave lines */}
      {Array.from({ length: 24 }).map((_, i) => (
        <line
          key={i}
          x1="56"
          x2="344"
          y1={60 + i * 10}
          y2={60 + i * 10}
          stroke="#1A1714"
          strokeOpacity="0.04"
          strokeWidth="0.75"
        />
      ))}

      {/* bottom hem bar */}
      <rect x="56" y="286" width="288" height="6" fill="#1A1714" opacity="0.85" />

      {/* roll cylinder at top */}
      <rect x="52" y="36" width="296" height="20" rx="2" fill="url(#rb-roll)" />
      <ellipse cx="348" cy="46" rx="6" ry="9" fill="#3D3424" />

      {/* pull cord */}
      <line
        x1="332"
        y1="48"
        x2="332"
        y2="378"
        stroke="#1A1714"
        strokeOpacity="0.55"
        strokeWidth="0.6"
      />
      <circle cx="332" cy="382" r="3" fill="#1A1714" opacity="0.55" />
    </svg>
  );
}
