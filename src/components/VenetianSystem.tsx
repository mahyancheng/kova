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
    let lastProgress = -1;

    const measure = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const range = Math.max(1, section.offsetHeight - vh);
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / range));

      if (Math.abs(p - lastProgress) > 0.001) {
        lastProgress = p;
        setProgress(p);
        const video = videoRef.current;
        if (video && Number.isFinite(video.duration) && video.duration > 0) {
          video.currentTime = p * video.duration;
        }
      }
    };

    const schedule = () => {
      if (cancelled || raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        measure();
      });
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const fallback = window.setInterval(measure, 250);

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.clearInterval(fallback);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const stageIndex = progress < 0.34 ? 0 : progress < 0.68 ? 1 : 2;

  return (
    <section
      ref={sectionRef}
      className="relative bg-[var(--color-ink)] text-[var(--color-cream)]"
      // Less runway than before — keeps the scrub natural without a long
      // empty section. ~1.8 viewport heights is enough to pace 4s of video.
      style={{ minHeight: "180vh" }}
      aria-label="Venetian system: chain, tilt and lift"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="max-w-[1240px] mx-auto h-full px-5 sm:px-6 lg:px-10 flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:gap-10 lg:items-center justify-center py-[clamp(2rem,1rem+3vw,4rem)]">
          {/* Text column */}
          <div className="flex flex-col gap-3 lg:gap-5 min-w-0">
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
