import { useT } from "@/lib/i18n";
import { PromoBar } from "@/components/PromoBar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { StickyQuote } from "@/components/StickyQuote";
import { ProductSpotlight } from "@/components/ProductSpotlight";
import { ProductFabricStrip } from "@/components/ProductFabricStrip";
import { VertiSheer as VertiSheerVisual } from "@/components/visuals/VertiSheer";
import { VERTISHEER_FABRICS } from "@/lib/configurator/types";

export function VertiSheerPage() {
  const t = useT();
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <PromoBar />
      <Nav />
      <main id="main" className="pt-16">
        <ProductSpotlight
          id="vertisheer"
          tone="ink"
          {...t.products.vertisheer}
          Detail={VertiSheerVisual}
          detailSrc="/showcase/pivot-silver-vertisheer.webp"
        />
        <ProductFabricStrip
          fabrics={VERTISHEER_FABRICS}
          eyebrow={t.fabrics.eyebrow}
          title={`VertiSheer · ${t.fabrics.titleA} ${t.fabrics.titleB}`}
          body={t.fabrics.intro}
        />
      </main>
      <Footer />
      <StickyQuote />
    </div>
  );
}
