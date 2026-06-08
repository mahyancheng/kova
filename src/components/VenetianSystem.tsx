import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Scroll-driven Venetian "chain · tilt · lift" video.
 *
 * Compact layout: sticky inner container fills one viewport, but the
 * video itself uses object-contain at the source aspect ratio (4:3-ish,
 * 1664x1248) so the whole mechanism is always visible — never cropped.
 * Text labels sit alongside the video (side-by-side on lg+, stacked
 * tight on mobile) so the entire composition fits a single viewport at
 * any common screen size.
 *
 * The video itself never autoplays. It's muted, plays-inline, and we
 * only ever set currentTime — never .play(). That makes the effect
 * deterministic and silent.
 */
export function VenetianSystem() {
  const t = useT();
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let raf = 0;
    let cancelled = false;
    /** target progress driven by scroll position (0..1) */
    let targetProgress = 0;
    /** smoothly interpolated, eased progress that drives the video */
    let smoothProgress = 0;
    let lastWritten = -1;

    const readTarget = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const range = Math.max(1, section.offsetHeight - vh);
      const scrolled = -rect.top;
      targetProgress = Math.max(0, Math.min(1, scrolled / range));
    };

    // Every animation frame, ease smoothProgress toward targetProgress.
    // The factor 0.18 ≈ "reach 95% of target in ~15 frames" — smooth
    // enough that fast scrolls play through intermediate frames rather
    // than jumping, fast enough that it never feels laggy.
    const tick = () => {
      if (cancelled) return;
      const diff = targetProgress - smoothProgress;
      if (Math.abs(diff) < 0.0005) {
        smoothProgress = targetProgress;
      } else {
        smoothProgress += diff * 0.18;
      }

      if (Math.abs(smoothProgress - lastWritten) > 0.0005) {
        lastWritten = smoothProgress;
        setProgress(smoothProgress);
        const video = videoRef.current;
        if (video && Number.isFinite(video.duration) && video.duration > 0) {
          video.currentTime = smoothProgress * video.duration;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    readTarget();
    smoothProgress = targetProgress; // start at the right place, no flash
    raf = requestAnimationFrame(tick);

    window.addEventListener("scroll", readTarget, { passive: true });
    window.addEventListener("resize", readTarget);
    // Re-read target periodically as a safety net for environments where
    // scroll events get throttled (some embedded iframes).
    const fallback = window.setInterval(readTarget, 200);

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", readTarget);
      window.removeEventListener("resize", readTarget);
      window.clearInterval(fallback);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const stageIndex = progress < 0.34 ? 0 : progress < 0.68 ? 1 : 2;

  return (
    <section
      ref={sectionRef}
      className="relative bg-[var(--color-ink)] text-[var(--color-cream)]"
      // ~4 viewport heights of runway so that each pixel of scroll
      // equates to a tiny slice of the 4-second video — the user has
      // time to actually *see* each frame of the chain/tilt/lift
      // animation instead of jumping past it.
      style={{ minHeight: "400vh" }}
      aria-label="Venetian system: chain, tilt and lift"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/*
          On phones/portrait the video is the whole point — putting the
          text column above it pushes the animation off-screen on common
          handset heights. `flex-col-reverse` keeps the JSX order (text
          first → easier to read) but renders the video on top in mobile
          flex layout, then the layout switches to a 2-column grid at lg+
          where source order is fine.
        */}
        <div className="max-w-[1240px] mx-auto h-full px-5 sm:px-6 lg:px-10 flex flex-col-reverse lg:grid lg:grid-cols-2 gap-3 lg:gap-10 lg:items-center justify-center py-[clamp(1.25rem,0.5rem+2vw,4rem)]">
          {/* Text column */}
          <div className="flex flex-col gap-2.5 lg:gap-5 min-w-0">
            <div>
              <p className="eyebrow !text-[var(--color-sand)]">{t.venetianSystem.eyebrow}</p>
              <h2 className="mt-2 lg:mt-3 headline text-[clamp(1.5rem,1rem+3vw,3rem)] leading-[1.05]">
                {t.venetianSystem.titleA}
                <span className="italic font-light text-[var(--color-clay-light)]"> {t.venetianSystem.titleB}</span>
              </h2>
            </div>
            <p className="text-[clamp(0.88rem,0.82rem+0.3vw,1.02rem)] leading-[1.5] text-[var(--color-cream)]/75 max-w-md">
              {t.venetianSystem.intro}
            </p>

            {/* Progress rail + stage labels (compact) */}
            <div className="mt-1 lg:mt-3">
              <div className="relative h-px bg-[var(--color-cream)]/15 mb-3">
                <span
                  className="absolute inset-y-0 left-0 bg-[var(--color-clay-light)] transition-[width] duration-150 ease-out"
                  style={{ width: `${progress * 100}%`, height: "2px" }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {t.venetianSystem.stages.map((s, i) => {
                  const active = i === stageIndex;
                  return (
                    <div
                      key={s.label}
                      className={cn(
                        "transition-opacity duration-300",
                        active ? "opacity-100" : "opacity-40",
                      )}
                    >
                      <p
                        className={cn(
                          "text-[0.6rem] sm:text-[0.66rem] tracking-widest uppercase mb-1 transition-colors",
                          active
                            ? "text-[var(--color-clay-light)]"
                            : "text-[var(--color-sand)]/70",
                        )}
                      >
                        {String(i + 1).padStart(2, "0")} · {s.label}
                      </p>
                      <p className="font-serif text-[clamp(0.92rem,0.8rem+0.5vw,1.2rem)] leading-tight">
                        {s.title}
                      </p>
                      <p className="mt-1 text-[clamp(0.7rem,0.66rem+0.18vw,0.84rem)] leading-snug text-[var(--color-cream)]/60 max-w-[20ch] hidden sm:block">
                        {s.body}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Video column — entire mechanism visible, never cropped */}
          <div className="flex items-center justify-center min-h-0">
            <div
              className="relative w-full rounded-md overflow-hidden border border-[var(--color-cream)]/10 bg-[var(--color-ink-soft)]/40"
              style={{ aspectRatio: "1664 / 1248" }}
            >
              <video
                ref={videoRef}
                src="/videos/venetian-system.mp4"
                muted
                playsInline
                preload="auto"
                onLoadedMetadata={() => setVideoReady(true)}
                className="absolute inset-0 w-full h-full object-contain"
              />
              {/* tiny live-progress chip in the corner */}
              {videoReady && (
                <span className="absolute top-2 right-2 inline-flex items-center gap-1 bg-[var(--color-ink)]/80 backdrop-blur-sm text-[var(--color-cream)]/90 text-[0.58rem] tracking-widest uppercase px-2 py-0.5 rounded-full border border-[var(--color-cream)]/15">
                  <span className="h-1 w-1 rounded-full bg-[var(--color-clay-light)] animate-pulse" />
                  {Math.round(progress * 100)}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
