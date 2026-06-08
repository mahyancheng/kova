import { useT } from "@/lib/i18n";
import { PromoBar } from "@/components/PromoBar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { StickyQuote } from "@/components/StickyQuote";
import { ProductSpotlight } from "@/components/ProductSpotlight";
import { ProductFabricStrip } from "@/components/ProductFabricStrip";
import { VenetianSystem } from "@/components/VenetianSystem";
import { VenetianBlind } from "@/components/visuals/VenetianBlind";
import { VENETIAN_FABRICS } from "@/lib/configurator/types";

export function VenetianPage() {
  const t = useT();
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <PromoBar />
      <Nav />
      <main id="main" className="pt-16">
        <ProductSpotlight
          id="venetian"
          tone="paper"
          {...t.products.venetian}
          Detail={VenetianBlind}
          detailSrc="/showcase/white-venetian.webp"
        />
        <VenetianSystem />
        <ProductFabricStrip
          fabrics={VENETIAN_FABRICS}
          eyebrow={t.fabrics.eyebrow}
          title={`${t.products.venetian.name} · ${t.fabrics.titleA} ${t.fabrics.titleB}`}
          body={t.fabrics.intro}
        />
      </main>
      <Footer />
      <StickyQuote />
    </div>
  );
}
