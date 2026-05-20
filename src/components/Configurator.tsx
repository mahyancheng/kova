import { useEffect, useId, useState } from "react";
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
import { cn } from "@/lib/utils";

const PRODUCT_IDS: ProductId[] = ["roller", "venetian", "vertisheer"];

export function Configurator() {
  const t = useT();
  const { configuration, setProduct, setFabric, submit } = useConfigurator();
  const { product, fabric, opacity } = configuration;
  const opacityLevel = OPACITY_LEVEL[opacity];
  const uid = useId().replace(/[:]/g, "");
  const fabricsForProduct = getFabricsForProduct(product);

  /**
   * If the selected fabric has a sceneImage (real room photo), show it as
   * the live preview. Falls back to the SVG room with the fabric's texture
   * if the photo is missing or 404s.
   */
  const [photoFailed, setPhotoFailed] = useState(false);
  useEffect(() => {
    setPhotoFailed(false);
  }, [fabric.name]);
  const usePhotoPreview = Boolean(fabric.sceneImage) && !photoFailed;

  const handleSubmit = () => {
    submit();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };


  return (
    <section
      id="configurator"
      className="fluid-section-y-tight border-t border-[var(--color-line)] bg-[var(--color-paper)]"
    >
      <div className="max-w-[1380px] mx-auto px-5 sm:px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 lg:gap-5 mb-[clamp(1rem,0.5rem+1.5vw,2.5rem)]">
            <div>
              <p className="eyebrow">{t.configurator.eyebrow}</p>
              <h2 className="mt-1.5 lg:mt-3 headline fluid-h3 text-[var(--color-ink)] max-w-2xl">
                {t.configurator.titleA}
                <span className="italic font-light text-[var(--color-clay-deep)]"> {t.configurator.titleB}</span>
              </h2>
            </div>
            <p className="hidden sm:block max-w-md fluid-body text-[var(--color-ink-soft)]">
              {t.configurator.intro}
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-3 lg:gap-10 lg:items-start">
          {/* Preview canvas — always the same SVG room. Only the slats inside
              change material when the user picks a different fabric. */}
          <Reveal className="lg:col-span-7 lg:sticky lg:top-24">
            <div className="relative rounded-lg border border-[var(--color-line)] overflow-hidden bg-[var(--color-cream-light)]">
              <span className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 inline-flex items-center gap-1 sm:gap-1.5 bg-[var(--color-cream)]/90 backdrop-blur-sm text-[var(--color-ink)] text-[0.58rem] sm:text-[0.7rem] tracking-widest uppercase px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-[var(--color-line)]">
                <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-[var(--color-clay)] animate-pulse" />
                {t.configurator.badge}
              </span>
              {usePhotoPreview ? (
                <img
                  key={fabric.sceneImage}
                  src={fabric.sceneImage}
                  alt={`${t.configurator.products[product]} — ${fabric.name}`}
                  onError={() => setPhotoFailed(true)}
                  className="block w-full h-auto max-h-[38vh] sm:max-h-[60vh] lg:max-h-[calc(100vh-14rem)] object-cover animate-fade-in"
                  loading="lazy"
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

          {/* Controls */}
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

            {/* Fabric — either close-up showcase tiles (Venetian) or circle swatches */}
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

            {/* Summary + CTA — compact inline on mobile, full card on desktop */}
            <div className="lg:sticky lg:bottom-4 lg:z-10 lg:mt-2">
              {/* Mobile: tight inline row */}
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

              {/* Desktop: full card */}
              <div className="hidden lg:block rounded-md border border-[var(--color-line)] bg-[var(--color-cream-light)]/95 backdrop-blur-sm p-5 shadow-[0_8px_24px_-12px_rgba(26,23,20,0.18)]">
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
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[var(--color-ink)] text-[var(--color-cream)] text-[0.92rem] font-medium hover:bg-[var(--color-clay-deep)] active:bg-[var(--color-clay-deep)] transition-colors"
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
