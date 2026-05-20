import type { ReactNode } from "react";

/**
 * Static architectural room SVG. The window aperture is fixed at:
 *   x: 200 → 600  (400 wide)
 *   y: 80  → 440  (360 tall)
 *
 * A `blind` slot child renders inside that aperture so the room never
 * re-renders when the user swaps product/colour/opacity.
 */
export function PreviewScene({ blind, className }: { blind: ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 800 600" className={className} role="img" aria-label="Window with blind preview">
      <defs>
        <linearGradient id="ps-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F1EDE3" />
          <stop offset="100%" stopColor="#E6E0D0" />
        </linearGradient>
        <linearGradient id="ps-sidewall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#D6CFBB" />
          <stop offset="100%" stopColor="#E6E0D0" />
        </linearGradient>
        <linearGradient id="ps-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A98F61" />
          <stop offset="100%" stopColor="#7C5E36" />
        </linearGradient>
        <linearGradient id="ps-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F6EFDC" />
          <stop offset="100%" stopColor="#E6D6B2" />
        </linearGradient>
        <radialGradient id="ps-sun" cx="0.5" cy="0.18" r="0.6">
          <stop offset="0%" stopColor="#FFE9B3" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFE9B3" stopOpacity="0" />
        </radialGradient>
        <clipPath id="ps-aperture">
          <rect x="200" y="80" width="400" height="360" />
        </clipPath>
      </defs>

      {/* back wall */}
      <rect width="800" height="500" fill="url(#ps-wall)" />

      {/* left side wall (slight perspective) */}
      <polygon points="0,0 80,40 80,460 0,500" fill="url(#ps-sidewall)" />
      {/* right side wall */}
      <polygon points="800,0 720,40 720,460 800,500" fill="url(#ps-sidewall)" />

      {/* floor */}
      <polygon points="0,500 800,500 800,600 0,600" fill="url(#ps-floor)" />
      {/* floor sun-cast (driven by outside light through window) */}
      <polygon points="240,500 560,500 660,600 140,600" fill="#FFE9B3" opacity="0.32" />
      {/* floor plank lines */}
      {Array.from({ length: 6 }).map((_, i) => (
        <line
          key={i}
          x1="0"
          x2="800"
          y1={510 + i * 16}
          y2={510 + i * 16}
          stroke="#1A1714"
          strokeOpacity="0.08"
          strokeWidth="0.6"
        />
      ))}

      {/* outside view (visible through window aperture) */}
      <g clipPath="url(#ps-aperture)">
        <rect x="200" y="80" width="400" height="360" fill="url(#ps-sky)" />
        {/* horizon */}
        <line x1="200" y1="290" x2="600" y2="290" stroke="#1A1714" strokeOpacity="0.18" strokeWidth="0.6" />
        {/* distant buildings / trees in taupe */}
        <rect x="220" y="248" width="48" height="42" fill="#A89B82" opacity="0.7" />
        <rect x="276" y="234" width="32" height="56" fill="#8B7A60" opacity="0.6" />
        <circle cx="430" cy="262" r="28" fill="#A89B82" opacity="0.55" />
        <circle cx="478" cy="270" r="20" fill="#8B7A60" opacity="0.5" />
        <rect x="520" y="244" width="40" height="46" fill="#A89B82" opacity="0.55" />
        {/* sun wash overlay */}
        <rect x="200" y="80" width="400" height="360" fill="url(#ps-sun)" />
      </g>

      {/* light dust motes inside the room */}
      <circle cx="160" cy="380" r="1.4" fill="#FFF1C9" opacity="0.7" />
      <circle cx="640" cy="420" r="1.2" fill="#FFF1C9" opacity="0.6" />
      <circle cx="380" cy="470" r="1.6" fill="#FFF1C9" opacity="0.7" />

      {/* the blind layer — sits inside the aperture, swappable */}
      <g clipPath="url(#ps-aperture)">{blind}</g>

      {/* window frame (drawn AFTER blind so the trim sits on top) */}
      <rect
        x="200"
        y="80"
        width="400"
        height="360"
        fill="none"
        stroke="#1A1714"
        strokeWidth="2"
      />
      {/* sill */}
      <rect x="188" y="438" width="424" height="10" fill="#1A1714" />
      <rect x="188" y="444" width="424" height="6" fill="#3A382F" />
      {/* head trim */}
      <rect x="188" y="72" width="424" height="14" fill="#1A1714" />

      {/* foreground plant accent (taupe — palette-safe) */}
      <ellipse cx="92" cy="500" rx="34" ry="5" fill="#1A1714" opacity="0.18" />
      <rect x="70" y="450" width="44" height="50" rx="3" fill="#8B5A3C" />
      <path d="M92 450 C 62 392 80 354 92 332 C 104 354 122 392 92 450 Z" fill="#7C6E58" />
      <path
        d="M92 450 C 112 412 124 382 132 372 C 124 398 116 426 92 450 Z"
        fill="#A89B82"
        opacity="0.9"
      />
    </svg>
  );
}
