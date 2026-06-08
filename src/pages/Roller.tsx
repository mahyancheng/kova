import { useT } from "@/lib/i18n";
import { PromoBar } from "@/components/PromoBar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { StickyQuote } from "@/components/StickyQuote";
import { ProductSpotlight } from "@/components/ProductSpotlight";
import { ProductFabricStrip } from "@/components/ProductFabricStrip";
import { RollerBlind } from "@/components/visuals/RollerBlind";
import { ROLLER_FABRICS } from "@/lib/configurator/types";

export function RollerPage() {
  const t = useT();
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <PromoBar />
      <Nav />
      <main id="main" className="pt-16">
        <ProductSpotlight
          id="roller"
          tone="cream"
          {...t.products.roller}
          Detail={RollerBlind}
          detailSrc="/showcase/greige-roller.webp"
        />
        <ProductFabricStrip
          fabrics={ROLLER_FABRICS}
          eyebrow={t.fabrics.eyebrow}
          title={`${t.products.roller.name} · ${t.fabrics.titleA} ${t.fabrics.titleB}`}
          body={t.fabrics.intro}
        />
      </main>
      <Footer />
      <StickyQuote />
    </div>
  );
}
