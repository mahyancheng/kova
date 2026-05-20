import { useId } from "react";
import { Reveal } from "./Reveal";
import { useT } from "@/lib/i18n";
import { useConfigurator } from "@/lib/configurator/context";
import {
  FABRICS,
  OPACITY_LEVEL,
  OPACITY_OPTIONS,
  type OpacityId,
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
  const { configuration, setProduct, setFabric, setOpacity, submit } = useConfigurator();
  const { product, fabric, opacity } = configuration;
  const opacityLevel = OPACITY_LEVEL[opacity];
  const uid = useId().replace(/[:]/g, "");

  const handleSubmit = () => {
    submit();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="configurator"
      className="py-10 lg:py-20 border-t border-[var(--color-line)] bg-[var(--color-paper)]"
    >
      <div className="max-w-[1380px] mx-auto px-5 sm:px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-6 lg:mb-10">
            <div>
              <p className="eyebrow">{t.configurator.eyebrow}</p>
              <h2 className="mt-2.5 lg:mt-3 headline text-[1.7rem] sm:text-[2.4rem] lg:text-[3.2rem] text-[var(--color-ink)] max-w-2xl">
                {t.configurator.titleA}
                <span className="italic font-light text-[var(--color-clay-deep)]"> {t.configurator.titleB}</span>
              </h2>
            </div>
            <p className="max-w-md text-[0.92rem] lg:text-[1rem] text-[var(--color-ink-soft)] leading-relaxed">
              {t.configurator.intro}
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 lg:items-start">
          {/* Preview canvas — sticky on desktop so it stays in view while user explores controls */}
          <Reveal className="lg:col-span-7 lg:sticky lg:top-24">
            <div className="relative rounded-lg border border-[var(--color-line)] overflow-hidden bg-[var(--color-cream-light)]">
              <span className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 inline-flex items-center gap-1.5 bg-[var(--color-cream)]/90 backdrop-blur-sm text-[var(--color-ink)] text-[0.62rem] sm:text-[0.7rem] tracking-widest uppercase px-2 sm:px-2.5 py-1 rounded-full border border-[var(--color-line)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-clay)] animate-pulse" />
                {t.configurator.badge}
              </span>
              <PreviewScene
                className="w-full h-auto max-h-[60vh] lg:max-h-[calc(100vh-14rem)]"
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
            </div>
            <p className="mt-2 lg:mt-3 text-[0.74rem] lg:text-[0.78rem] text-[var(--color-muted)]">
              {t.configurator.figureCaption}
            </p>
          </Reveal>

          {/* Controls */}
          <Reveal className="lg:col-span-5 flex flex-col gap-5" delay={120}>
            {/* Product tabs */}
            <div>
              <p className="eyebrow">{t.configurator.productLabel}</p>
              <div className="mt-2.5 grid grid-cols-3 gap-2">
                {PRODUCT_IDS.map((id) => {
                  const active = product === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setProduct(id)}
                      aria-pressed={active}
                      className={cn(
                        "min-h-[48px] px-3 sm:px-4 py-2.5 rounded-md border text-[0.9rem] sm:text-[0.92rem] font-medium transition-colors",
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

            {/* Fabric swatches */}
            <div>
              <div className="flex items-baseline justify-between gap-2">
                <p className="eyebrow">{t.configurator.fabricLabel}</p>
                <p className="text-[0.78rem] sm:text-[0.82rem] text-[var(--color-muted)] truncate">
                  <span className="font-serif text-[var(--color-ink)]">{fabric.name}</span>
                  <span className="ml-2 text-[var(--color-muted)]">{fabric.hex.toUpperCase()}</span>
                </p>
              </div>
              <div className="mt-2.5 grid grid-cols-8 gap-2 sm:gap-2.5">
                {FABRICS.map((f) => {
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
                        "relative aspect-square min-h-[36px] rounded-full border-2 transition-all touch-manipulation",
                        active
                          ? "border-[var(--color-ink)] scale-[1.08] shadow-sm"
                          : "border-[var(--color-line)] hover:border-[var(--color-ink-soft)] active:scale-95",
                      )}
                      style={{ backgroundColor: f.hex }}
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

            {/* Opacity options */}
            <div>
              <p className="eyebrow">{t.configurator.opacityLabel}</p>
              <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {OPACITY_OPTIONS[product].map((o) => {
                  const active = opacity === o;
                  return (
                    <button
                      key={o}
                      type="button"
                      onClick={() => setOpacity(o)}
                      aria-pressed={active}
                      className={cn(
                        "text-left min-h-[60px] px-3.5 py-2.5 rounded-md border transition-colors",
                        active
                          ? "bg-[var(--color-cream)] border-[var(--color-ink)]"
                          : "bg-[var(--color-paper)] border-[var(--color-line)] hover:border-[var(--color-ink-soft)] active:bg-[var(--color-cream-light)]",
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-serif text-[1.02rem] sm:text-[1.05rem] text-[var(--color-ink)] leading-tight">
                          {t.configurator.opacityNames[o]}
                        </span>
                        {active && (
                          <span className="text-[var(--color-clay)] text-[0.78rem] font-medium">●</span>
                        )}
                      </div>
                      <p className="mt-1 text-[0.76rem] sm:text-[0.78rem] text-[var(--color-muted)] leading-snug">
                        {t.configurator.opacityHint[o]}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sticky Summary + CTA — pinned to bottom of viewport on desktop, regular flow on mobile */}
            <div className="lg:sticky lg:bottom-4 lg:z-10 lg:mt-2">
              <div className="rounded-md border border-[var(--color-line)] bg-[var(--color-cream-light)]/95 backdrop-blur-sm p-4 sm:p-5 shadow-[0_8px_24px_-12px_rgba(26,23,20,0.18)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="eyebrow">{t.configurator.summaryLabel}</p>
                    <p className="mt-1.5 font-serif text-[1.1rem] sm:text-[1.2rem] tracking-tight text-[var(--color-ink)] leading-snug">
                      {t.configurator.products[product]} · {fabric.name} · {t.configurator.opacityNames[opacity]}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="mt-3.5 sm:mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[var(--color-ink)] text-[var(--color-cream)] text-[0.92rem] font-medium hover:bg-[var(--color-clay-deep)] active:bg-[var(--color-clay-deep)] transition-colors"
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
