import { useEffect } from "react";
import { useT } from "@/lib/i18n";
import { PromoBar } from "@/components/PromoBar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { StickyQuote } from "@/components/StickyQuote";
import { ProductSpotlight } from "@/components/ProductSpotlight";
import { ProductFabricStrip } from "@/components/ProductFabricStrip";
import {
  ProductCare,
  ProductClosing,
  ProductFabricTable,
  ProductFaq,
  ProductMotorised,
  ProductPricing,
  ProductRooms,
  ProductSteps,
} from "@/components/product/ProductSections";
import { Configurator } from "@/components/Configurator";
import { RollerBlind } from "@/components/visuals/RollerBlind";
import { ROLLER_FABRICS } from "@/lib/configurator/types";
import { useConfigurator } from "@/lib/configurator/context";

export function RollerPage() {
  const t = useT();
  const { setProduct } = useConfigurator();
  const prod = t.products.roller;
  const p = t.productPages.roller;

  // Pre-select Roller when the page first opens — visitors who landed
  // here came for Roller, so the configurator should reflect that.
  useEffect(() => {
    setProduct("roller");
  }, [setProduct]);

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <PromoBar />
      <Nav />
      <main id="main" className="pt-1">
        <ProductSpotlight
          id="roller"
          tone="cream"
          priority={true} // 👈 告诉底层：这是首屏核心大图，给我最高优先级加载！
          number={prod.number}
          name={prod.name}
          h1={p.h1}
          taglineA={p.subhead}
          taglineB=""
          body={p.heroBody}
          features={p.why.items.map((i) => ({
            title: i.title,
            detail: i.body,
            bullets: i.bullets,
          }))}
          whyEyebrow={p.why.eyebrow}
          whyTitleA={p.why.titleA}
          whyTitleB={p.why.titleB}
          whyDek={p.why.dek}
          perfectFor={prod.perfectFor}
          detailCaption={prod.detailCaption}
          Detail={RollerBlind}
          detailSrc="/showcase/greige-roller.webp"
        />
        <ProductFabricTable n="02" tone="paper" data={p.fabricGuide} />
        <ProductFabricStrip
          fabrics={ROLLER_FABRICS}
          eyebrow={t.fabrics.eyebrow}
          title={`${prod.name} · ${t.fabrics.titleA} ${t.fabrics.titleB}`}
          body={t.fabrics.intro}
        />
        <ProductRooms n="03" tone="paper" data={p.rooms} />
        <ProductPricing n="04" tone="cream" data={p.price} />
        <ProductSteps n="05" data={p.steps} />
        <Configurator />
        <ProductMotorised n="06" tone="paper" data={p.motorised} />
        <ProductCare n="07" tone="cream" data={p.care} />
        <ProductFaq n="08" tone="paper" data={p.faq} />
        <ProductClosing
          n="09"
          data={p.closing}
          waMessage={`Hi KOVA, I would like a quote for ${prod.name}.`}
        />
      </main>
      <Footer />
      <StickyQuote />
    </div>
  );
}
