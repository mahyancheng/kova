import { useEffect, useId, useState, useRef } from "react";
import { Reveal } from "./Reveal";
import { useT } from "@/lib/i18n";
import { useConfigurator } from "@/lib/configurator/context";
import {
  OPACITY_LEVEL,
  getFabricsForProduct,
  type ProductId,
} from "@/lib/configurator/types";
import { PreviewScene } from "./configurator/PreviewScene";
import { RollerOverlay } from "./configurator/RollerOverlay";
import { VenetianOverlay } from "./configurator/VenetianOverlay";
import { VertiSheerOverlay } from "./configurator/VertiSheerOverlay";
import { ScenePhoto } from "./configurator/ScenePhoto";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom"; 
import { useRoutes } from "@/lib/routes";
const PRODUCT_IDS: ProductId[] = ["roller", "venetian", "vertisheer"];

// headingLevel: 在 /configurator 页面它是页面主标题 (h1)，其他页面维持 h2
export function Configurator({ headingLevel: H = "h2" }: { headingLevel?: "h1" | "h2" } = {}) {
  const t = useT();
  const { configuration, setProduct, setFabric, submit } = useConfigurator();
  const { product, fabric, opacity } = configuration;
  const navigate = useNavigate();
  const r = useRoutes();
  const opacityLevel = OPACITY_LEVEL[opacity];
  const uid = useId().replace(/[:]/g, "");
  const fabricsForProduct = getFabricsForProduct(product);
  
  const sectionRef = useRef<HTMLElement>(null);
  const [shouldPreload, setShouldPreload] = useState(false);

  useEffect(() => {
    if (!("IntersectionObserver" in window) || shouldPreload) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldPreload(true); 
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [shouldPreload]);

  const sceneUrls = fabricsForProduct
    .map((f) => f.sceneImage)
    .filter((u): u is string => Boolean(u));

  const [photoFailed, setPhotoFailed] = useState(false);
  useEffect(() => {
    setPhotoFailed(false);
  }, [fabric.name]);
  const usePhotoPreview = Boolean(fabric.sceneImage) && !photoFailed;

  // 🌟 核心修复 1：利用 setTimeout 将滚动操作放到下一个微任务队列，避开 React 状态更新的死锁
  const handleSubmit = () => {
    submit(); // 1. 提交并填写数据
    navigate(r.contact); // 2. 直接带用户跳转到 /contact 页面（如果是马来文版，它会自动跳去 /bidai/hubungi）
    setTimeout(() => {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        // 2. 完美的平滑定位跳转
        contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 60); // 留出 60ms 让 React 完成 DOM 状态更新
  };

  return (
    <section
      id="configurator"
      ref={sectionRef}
      className="fluid-section-y-tight border-t border-[var(--color-line)] bg-[var(--color-paper)]"
    >
      <div className="max-w-[1380px] mx-auto px-10 sm:px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-5 mb-[clamp(1rem,0.5rem+1.5vw,2.5rem)]">
            <div>
              <p className="eyebrow">{t.configurator.eyebrow}</p>
              <H className="mt-1.5 lg:mt-3 headline fluid-h3 text-[var(--color-ink)] max-w-2xl">
                {t.configurator.titleA}
                <span className="italic font-light text-[var(--color-clay-deep)]"> {t.configurator.titleB}</span>
              </H>
            </div>
            <p className="hidden sm:block max-w-md fluid-body text-[var(--color-ink-soft)]">
              {t.configurator.intro}
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-3 lg:gap-10 lg:items-start">
          <Reveal className="lg:col-span-7 lg:sticky lg:top-24">
            <div className="relative rounded-lg border border-[var(--color-line)] overflow-hidden bg-[var(--color-cream-light)]">
              <span className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 inline-flex items-center gap-1 sm:gap-1.5 bg-[var(--color-cream)]/90 backdrop-blur-sm text-[var(--color-ink)] text-[0.58rem] sm:text-[0.7rem] tracking-widest uppercase px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-[var(--color-line)]">
                <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-[var(--color-clay)] animate-pulse" />
                {t.configurator.badge}
              </span>
              {usePhotoPreview && fabric.sceneImage ? (
                <ScenePhoto
                  src={fabric.sceneImage}
                  alt={`${t.configurator.products[product]} — ${fabric.name}`}
                  preload={shouldPreload ? sceneUrls : []} 
                  onError={() => setPhotoFailed(true)}
                  className="w-full max-h-[38vh] sm:max-h-[60vh] lg:max-h-[calc(100vh-14rem)] overflow-hidden"
                />
              ) : (
                <PreviewScene
                  className="w-full h-auto max-h-[38vh] sm:max-h-[60vh] lg:max-h-[calc(100vh-14rem)]"
                  blind={
                    product === "roller" ? (
                      <RollerOverlay fabric={fabric} opacity={opacityLevel} uniqueId={uid} />
                    ) : product === "venetian" ? (
                      <VenetianOverlay fabric={fabric} opacity={opacityLevel} uniqueId={uid} />
                    ) : (
                      <VertiSheerOverlay fabric={fabric} opacity={opacityLevel} uniqueId={uid} />
                    )
                  }
                />
              )}
            </div>
            <p className="hidden sm:block mt-2 lg:mt-3 text-[0.74rem] lg:text-[0.78rem] text-[var(--color-muted)]">
              {t.configurator.figureCaption}
            </p>
          </Reveal>

          {/* 右侧控制区 */}
          <Reveal className="lg:col-span-5 flex flex-col gap-3 lg:gap-5" delay={120}>
            {/* Product tabs */}
            <div>
              <p className="eyebrow text-[0.66rem] sm:text-[0.72rem]">{t.configurator.productLabel}</p>
              <div className="mt-1.5 lg:mt-2.5 grid grid-cols-3 gap-1.5 lg:gap-2">
                {PRODUCT_IDS.map((id) => {
                  const active = product === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setProduct(id)}
                      aria-pressed={active}
                      className={cn(
                        "min-h-[40px] lg:min-h-[48px] px-2 lg:px-4 py-2 lg:py-2.5 rounded-md border text-[0.84rem] lg:text-[0.92rem] font-medium transition-colors",
                        active
                          ? "bg-[var(--color-ink)] border-[var(--color-ink)] text-[var(--color-cream)]"
                          : "bg-[var(--color-paper)] border-[var(--color-line)] text-[var(--color-ink-soft)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] active:bg-[var(--color-cream)]",
                      )}
                    >
                      {t.configurator.products[id]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fabric */}
            <div>
              <div className="flex items-baseline justify-between gap-2">
                <p className="eyebrow text-[0.66rem] sm:text-[0.72rem]">{t.configurator.fabricLabel}</p>
                <p className="text-[0.74rem] sm:text-[0.82rem] text-[var(--color-muted)] truncate">
                  <span className="font-serif text-[var(--color-ink)]">{fabric.name}</span>
                  <span className="ml-1.5 text-[var(--color-muted)]">{fabric.hex.toUpperCase()}</span>
                </p>
              </div>

              <div
                className={cn(
                  "mt-1.5 lg:mt-2.5 grid gap-1.5 sm:gap-2.5",
                  fabricsForProduct.length <= 4
                    ? "grid-cols-4"
                    : fabricsForProduct.length <= 6
                    ? "grid-cols-6"
                    : "grid-cols-8",
                )}
              >
                {fabricsForProduct.map((f) => {
                  const active = f.name === fabric.name;
                  return (
                    <button
                      key={f.name}
                      type="button"
                      onClick={() => setFabric(f)}
                      aria-label={f.name}
                      aria-pressed={active}
                      title={f.name}
                      className={cn(
                        "relative aspect-square min-h-[32px] lg:min-h-[36px] rounded-full border-2 overflow-hidden transition-all touch-manipulation",
                        active
                          ? "border-[var(--color-ink)] scale-[1.08] shadow-sm"
                          : "border-[var(--color-line)] hover:border-[var(--color-ink-soft)] active:scale-95",
                      )}
                      style={{
                        backgroundColor: f.hex,
                        backgroundImage: f.image ? `url(${f.image})` : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {active && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-cream)] mix-blend-difference" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Summary + CTA */}
            {/* 🌟 核心修复 2：彻底重构这个卡片容器的类名，去掉外层无意义的粘性定位（它曾会导致框跟随滚动时拉伸变形），让内层卡片平滑地贴在底部而绝不影响其容器框 */}
            <div className="relative mt-2 lg:mt-4">
              {/* Mobile CTA */}
              <div className="lg:hidden flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-cream-light)] pl-3 pr-1 py-1">
                <span className="flex-1 min-w-0 truncate font-serif text-[0.86rem] text-[var(--color-ink)]">
                  {t.configurator.products[product]} · {fabric.name}
                </span>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="shrink-0 inline-flex items-center justify-center gap-1 px-3.5 py-2 rounded-full bg-[var(--color-ink)] text-[var(--color-cream)] text-[0.82rem] font-medium hover:bg-[var(--color-clay-deep)] active:bg-[var(--color-clay-deep)] transition-colors"
                  aria-label={t.configurator.cta}
                >
                  Quote
                  <span aria-hidden>→</span>
                </button>
              </div>

              {/* Desktop Sticky Summary Card */}
              <div className="hidden lg:block sticky bottom-6 z-20 rounded-md border border-[var(--color-line)] bg-[var(--color-cream-light)]/95 backdrop-blur-sm p-5 shadow-[0_12px_32px_-12px_rgba(26,23,20,0.22)] transition-shadow duration-300">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="eyebrow">{t.configurator.summaryLabel}</p>
                    <p className="mt-1.5 font-serif text-[1.2rem] tracking-tight text-[var(--color-ink)] leading-snug">
                      {t.configurator.products[product]} · {fabric.name}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[var(--color-ink)] text-[var(--color-cream)] text-[0.92rem] font-medium hover:bg-[var(--color-clay-deep)] active:bg-[var(--color-clay-deep)] transition-colors shadow-sm"
                >
                  {t.configurator.cta}
                  <span aria-hidden>→</span>
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
} 