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

  return (
    <section
      id="configurator"
      className="py-20 lg:py-32 border-t border-[var(--color-line)] bg-[var(--color-paper)]"
    >
      <div className="max-w-[1380px] mx-auto px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 lg:mb-16">
            <div>
              <p className="eyebrow">{t.configurator.eyebrow}</p>
              <h2 className="mt-4 headline text-[2.4rem] sm:text-[3rem] lg:text-[3.8rem] text-[var(--color-ink)] max-w-2xl">
                {t.configurator.titleA}
                <span className="italic font-light text-[var(--color-clay-deep)]"> {t.configurator.titleB}</span>
              </h2>
            </div>
            <p className="max-w-md text-[var(--color-ink-soft)] leading-relaxed">
              {t.configurator.intro}
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Preview canvas */}
          <Reveal className="lg:col-span-7">
            <div className="relative rounded-lg border border-[var(--color-line)] overflow-hidden bg-[var(--color-cream-light)]">
              <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 bg-[var(--color-cream)]/90 backdrop-blur-sm text-[var(--color-ink)] text-[0.7rem] tracking-widest uppercase px-2.5 py-1 rounded-full border border-[var(--color-line)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-clay)] animate-pulse" />
                {t.configurator.badge}
              </span>
              <PreviewScene
                className="w-full h-auto"
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
            <p className="mt-3 text-[0.78rem] text-[var(--color-muted)]">
              {t.configurator.figureCaption}
            </p>
          </Reveal>

          {/* Controls */}
          <Reveal className="lg:col-span-5" delay={120}>
            <div className="space-y-8">
              {/* Product tabs */}
              <div>
                <p className="eyebrow">{t.configurator.productLabel}</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {PRODUCT_IDS.map((id) => {
                    const active = product === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setProduct(id)}
                        aria-pressed={active}
                        className={cn(
                          "px-4 py-3 rounded-md border text-[0.92rem] font-medium transition-colors",
                          active
                            ? "bg-[var(--color-ink)] border-[var(--color-ink)] text-[var(--color-cream)]"
                            : "bg-[var(--color-paper)] border-[var(--color-line)] text-[var(--color-ink-soft)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]",
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
                <div className="flex items-baseline justify-between">
                  <p className="eyebrow">{t.configurator.fabricLabel}</p>
                  <p className="text-[0.82rem] text-[var(--color-muted)]">
                    <span className="font-serif text-[var(--color-ink)]">{fabric.name}</span>
                    <span className="ml-2 text-[var(--color-muted)]">{fabric.hex.toUpperCase()}</span>
                  </p>
                </div>
                <div className="mt-3 grid grid-cols-4 sm:grid-cols-8 gap-2">
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
                          "relative aspect-square rounded-full border-2 transition-all",
                          active
                            ? "border-[var(--color-ink)] scale-[1.06] shadow-sm"
                            : "border-[var(--color-line)] hover:border-[var(--color-ink-soft)]",
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
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {OPACITY_OPTIONS[product].map((o) => {
                    const active = opacity === o;
                    return (
                      <button
                        key={o}
                        type="button"
                        onClick={() => setOpacity(o)}
                        aria-pressed={active}
                        className={cn(
                          "text-left px-4 py-3 rounded-md border transition-colors",
                          active
                            ? "bg-[var(--color-cream)] border-[var(--color-ink)]"
                            : "bg-[var(--color-paper)] border-[var(--color-line)] hover:border-[var(--color-ink-soft)]",
                        )}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-serif text-[1.05rem] text-[var(--color-ink)] leading-tight">
                            {t.configurator.opacityNames[o]}
                          </span>
                          {active && (
                            <span className="text-[var(--color-clay)] text-[0.78rem] font-medium">●</span>
                          )}
                        </div>
                        <p className="mt-1 text-[0.78rem] text-[var(--color-muted)] leading-snug">
                          {t.configurator.opacityHint[o]}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Summary + CTA */}
              <div className="rounded-md border border-[var(--color-line)] bg-[var(--color-cream-light)] p-5">
                <p className="eyebrow">{t.configurator.summaryLabel}</p>
                <p className="mt-2 font-serif text-[1.2rem] tracking-tight text-[var(--color-ink)] leading-snug">
                  {t.configurator.products[product]} · {fabric.name} · {t.configurator.opacityNames[opacity]}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    submit();
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--color-ink)] text-[var(--color-cream)] text-[0.92rem] font-medium hover:bg-[var(--color-clay-deep)] transition-colors"
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
