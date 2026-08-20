import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function VenetianSystem() {
  const t = useT();
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressBarRef = useRef<HTMLSpanElement | null>(null);
  const progressTextRef = useRef<HTMLSpanElement | null>(null);
  
  const [videoReady, setVideoReady] = useState(false);
  
  // 只把高层级的状态留在 React state 里，避免频繁 re-render
  const [stageIndex, setStageIndex] = useState(0);
  const currentStageRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let raf = 0;
    let cancelled = false;
    let targetProgress = 0;
    let smoothProgress = 0;
    let lastWritten = -1;

    const readTarget = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const range = Math.max(1, section.offsetHeight - vh);
      const scrolled = -rect.top;
      targetProgress = Math.max(0, Math.min(1, scrolled / range));
    };

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
        
        // 1. 优先更新视频
        const video = videoRef.current;
        if (video && Number.isFinite(video.duration) && video.duration > 0) {
          video.currentTime = smoothProgress * video.duration;
        }

        // 2. 绕过 React，直接高效操作 DOM 更新进度条和数字
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${smoothProgress * 100}%`;
        }
        if (progressTextRef.current) {
          progressTextRef.current.textContent = `${Math.round(smoothProgress * 100)}%`;
        }

        // 3. 只有在阶段真正跨越时，才触发 React 渲染
        const newStage = smoothProgress < 0.34 ? 0 : smoothProgress < 0.68 ? 1 : 2;
        if (newStage !== currentStageRef.current) {
          currentStageRef.current = newStage;
          setStageIndex(newStage);
        }
      }

      raf = requestAnimationFrame(tick);
    };

    readTarget();
    smoothProgress = targetProgress;
    raf = requestAnimationFrame(tick);

    window.addEventListener("scroll", readTarget, { passive: true });
    window.addEventListener("resize", readTarget);
    const fallback = window.setInterval(readTarget, 200);

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", readTarget);
      window.removeEventListener("resize", readTarget);
      window.clearInterval(fallback);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[var(--color-ink)] text-[var(--color-cream)]"
      style={{ minHeight: "400vh" }}
      aria-label="Venetian system: chain, tilt and lift"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
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

            {/* Progress rail + stage labels */}
            <div className="mt-1 lg:mt-3">
              <div className="relative h-px bg-[var(--color-cream)]/15 mb-3">
                <span
                  ref={progressBarRef}
                  /* 移除了 transition-[width]，因为 JS 已经在做平滑补帧，加上 transition 会导致不同步和卡顿 */
                  className="absolute inset-y-0 left-0 bg-[var(--color-clay-light)]"
                  style={{ width: "0%", height: "2px" }}
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

          {/* Video column */}
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
                  <span ref={progressTextRef}>0%</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}