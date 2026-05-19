export function HeroVisual({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 560 640"
      className={className}
      role="img"
      aria-label="Sunlight through window furnishings"
    >
      <defs>
        <linearGradient id="hv-sun" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#FFE9B3" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#F5D593" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#F0EEE5" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hv-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0EEE5" />
          <stop offset="100%" stopColor="#E8E4D5" />
        </linearGradient>
        <linearGradient id="hv-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D7CCB0" />
          <stop offset="100%" stopColor="#B89F7A" />
        </linearGradient>
        <linearGradient id="hv-fabric" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EFE5CB" />
          <stop offset="100%" stopColor="#C9B68A" />
        </linearGradient>
      </defs>

      {/* wall */}
      <rect width="560" height="640" fill="url(#hv-wall)" />

      {/* floor */}
      <polygon points="0,500 560,500 560,640 0,640" fill="url(#hv-floor)" />

      {/* sun cast on floor */}
      <polygon
        points="180,500 400,500 480,640 100,640"
        fill="#FFE9B3"
        opacity="0.35"
      />

      {/* window frame */}
      <rect
        x="120"
        y="80"
        width="320"
        height="380"
        rx="2"
        fill="#FBFAF3"
        stroke="#1A1714"
        strokeWidth="1.5"
      />

      {/* light wash */}
      <rect x="124" y="84" width="312" height="372" fill="url(#hv-sun)" />

      {/* horizon line */}
      <line x1="124" y1="260" x2="436" y2="260" stroke="#1A1714" strokeOpacity="0.25" strokeWidth="0.6" />

      {/* distant trees */}
      <circle cx="180" cy="240" r="22" fill="#A89B82" opacity="0.7" />
      <circle cx="220" cy="248" r="14" fill="#A89B82" opacity="0.55" />
      <circle cx="370" cy="244" r="18" fill="#A89B82" opacity="0.65" />

      {/* head rail */}
      <rect x="116" y="76" width="328" height="14" fill="#1A1714" />

      {/* fabric panel — partially down (roller) */}
      <rect x="120" y="80" width="320" height="180" fill="url(#hv-fabric)" />
      {Array.from({ length: 18 }).map((_, i) => (
        <line
          key={i}
          x1="120"
          x2="440"
          y1={88 + i * 10}
          y2={88 + i * 10}
          stroke="#1A1714"
          strokeOpacity="0.04"
          strokeWidth="0.75"
        />
      ))}
      <rect x="120" y="256" width="320" height="6" fill="#1A1714" opacity="0.9" />

      {/* pull cord */}
      <line x1="426" y1="92" x2="426" y2="350" stroke="#1A1714" strokeOpacity="0.5" strokeWidth="0.6" />
      <circle cx="426" cy="354" r="3" fill="#1A1714" opacity="0.5" />

      {/* small plant in front */}
      <ellipse cx="60" cy="500" rx="34" ry="6" fill="#1A1714" opacity="0.1" />
      <rect x="38" y="438" width="44" height="62" rx="3" fill="#A98F61" />
      <path d="M60 438 C 30 380 50 340 60 320 C 70 340 90 380 60 438 Z" fill="#7C6E58" />
      <path d="M60 438 C 80 400 92 370 100 360 C 92 386 84 414 60 438 Z" fill="#A89B82" opacity="0.9" />

      {/* light dust */}
      <circle cx="220" cy="320" r="1.4" fill="#FFF1C9" />
      <circle cx="260" cy="360" r="1.0" fill="#FFF1C9" />
      <circle cx="310" cy="340" r="1.2" fill="#FFF1C9" />
      <circle cx="350" cy="400" r="0.9" fill="#FFF1C9" />
      <circle cx="190" cy="420" r="1.1" fill="#FFF1C9" />
    </svg>
  );
}
