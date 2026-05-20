import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Scroll-driven Venetian "chain · tilt · lift" video.
 *
 * The section is intentionally tall (3 viewports) so the user has runway
 * to scroll. Inside it, a `sticky` inner container holds the video and
 * a 3-stage overlay. As the user scrolls down through the section, we
 * map scroll progress 0 → 1 onto video.currentTime, so the mechanism
 * appears to animate in lockstep with the user's gesture.
 *
 * The video itself never autoplays. It's muted, plays-inline, and pauses
 * by default — we only set currentTime, never .play(). That makes the
 * effect deterministic and never makes noise on the page.
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

    // Fire on every scroll + resize (the events that change progress).
    // rAF coalesces multiple events into one measurement per frame.
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    // Belt-and-braces fallback: re-measure 4× per second in case the
    // host environment throttles scroll events (some iframes / preview
    // tools do). Negligible cost — measure() is a single rect read.
    const fallback = window.setInterval(measure, 250);

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.clearInterval(fallback);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Stage index 0/1/2 based on progress
  const stageIndex = progress < 0.34 ? 0 : progress < 0.68 ? 1 : 2;

  return (
    <section
      ref={sectionRef}
      className="relative bg-[var(--color-ink)] text-[var(--color-cream)]"
      // 3 viewport heights of runway — enough for the user to scrub through
      style={{ minHeight: "260vh" }}
      aria-label="Venetian system: chain, tilt and lift"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">
        {/* video layer */}
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            src="/videos/venetian-system.mp4"
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={() => setVideoReady(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* dark wash so overlay text reads */}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-ink)]/65 via-[var(--color-ink)]/15 to-[var(--color-ink)]/80" />
        </div>

        {/* overlay content */}
        <div className="relative z-10 flex-1 flex flex-col px-5 sm:px-6 lg:px-10 max-w-[1380px] mx-auto w-full">
          {/* header — anchored top */}
          <div className="pt-[clamp(3.5rem,2rem+6vw,7rem)]">
            <p className="eyebrow !text-[var(--color-sand)]">{t.venetianSystem.eyebrow}</p>
            <h2 className="mt-3 lg:mt-4 headline fluid-h2 max-w-3xl">
              {t.venetianSystem.titleA}
              <span className="italic font-light text-[var(--color-clay-light)]"> {t.venetianSystem.titleB}</span>
            </h2>
            <p className="mt-5 lg:mt-7 max-w-xl fluid-body text-[var(--color-cream)]/80">
              {t.venetianSystem.intro}
            </p>
          </div>

          {/* spacer to push stages to bottom */}
          <div className="flex-1" />

          {/* stage indicator row — anchored bottom */}
          <div className="pb-[clamp(2rem,1.5rem+3vw,4rem)]">
            {/* progress rail */}
            <div className="relative h-px bg-[var(--color-cream)]/15 mb-5">
              <span
                className="absolute inset-y-0 left-0 bg-[var(--color-clay-light)] transition-[width] duration-150 ease-out"
                style={{ width: `${progress * 100}%`, height: "2px" }}
              />
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-6">
              {t.venetianSystem.stages.map((s, i) => {
                const active = i === stageIndex;
                return (
                  <div
                    key={s.label}
                    className={cn(
                      "transition-opacity duration-300",
                      active
                        ? "opacity-100"
                        : "opacity-40 sm:opacity-50",
                    )}
                  >
                    <p
                      className={cn(
                        "text-[0.66rem] sm:text-[0.72rem] tracking-widest uppercase mb-1.5 transition-colors",
                        active ? "text-[var(--color-clay-light)]" : "text-[var(--color-sand)]/70",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")} · {s.label}
                    </p>
                    <p className="font-serif text-[clamp(1.05rem,0.85rem+0.9vw,1.55rem)] leading-tight">
                      {s.title}
                    </p>
                    <p className="mt-1.5 text-[clamp(0.78rem,0.74rem+0.2vw,0.92rem)] leading-snug text-[var(--color-cream)]/65 max-w-[22ch]">
                      {s.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* tiny caption pinned to bottom-right */}
        <p className="absolute bottom-3 right-4 z-10 text-[0.62rem] tracking-widest uppercase text-[var(--color-cream)]/45">
          {videoReady ? t.venetianSystem.caption : ""}
        </p>
      </div>
    </section>
  );
}
