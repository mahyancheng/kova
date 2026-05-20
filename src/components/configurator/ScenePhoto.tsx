import { useEffect, useRef, useState } from "react";

/**
 * Cross-fades between scene photos when `src` changes, with no white
 * flash. Strategy:
 *   1. On mount, preload every URL in `preload` so the browser caches them.
 *   2. When `src` changes, preload that specific src first (off-screen) —
 *      the visible "active" image stays put until the new one is decoded.
 *   3. Once decoded, swap the active layer and fade the previous one out
 *      using a stacked absolute img with opacity transition.
 */
export function ScenePhoto({
  src,
  alt,
  className,
  preload = [],
  onError,
}: {
  src: string;
  alt: string;
  className?: string;
  preload?: string[];
  onError?: () => void;
}) {
  const [activeSrc, setActiveSrc] = useState(src);
  const [fadingSrc, setFadingSrc] = useState<string | null>(null);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Preload all listed URLs once on mount so future swaps are instant.
  useEffect(() => {
    preload.forEach((url) => {
      if (!url) return;
      const i = new Image();
      i.src = url;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When `src` changes, decode it off-screen first, then swap.
  useEffect(() => {
    if (src === activeSrc) return;
    let cancelled = false;
    const next = new Image();
    next.onload = () => {
      if (cancelled) return;
      setFadingSrc(activeSrc);
      setActiveSrc(src);
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
      fadeTimer.current = setTimeout(() => setFadingSrc(null), 500);
    };
    next.onerror = () => {
      if (cancelled) return;
      onError?.();
    };
    next.src = src;
    return () => {
      cancelled = true;
    };
  }, [src, activeSrc, onError]);

  useEffect(() => () => {
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
  }, []);

  return (
    <div className={"relative " + (className ?? "")}>
      {/* Outgoing image — sits underneath the active layer and animates
          from opacity 1 → 0 over 500ms (so the new photo appears to
          "rise through" the old one). */}
      {fadingSrc && (
        <img
          key={`fade-${fadingSrc}`}
          src={fadingSrc}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover animate-fade-out"
          draggable={false}
        />
      )}
      {/* Active image — fades IN from 0 → 1 over 500ms when it mounts,
          so the swap looks like a true cross-fade rather than a hard cut. */}
      <img
        key={`active-${activeSrc}`}
        src={activeSrc}
        alt={alt}
        className="relative block w-full h-auto object-cover animate-fade-in"
        draggable={false}
      />
    </div>
  );
}
