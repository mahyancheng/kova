import { useEffect } from "react";
import { useT } from "@/lib/i18n";
import { PromoBar } from "@/components/PromoBar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { StickyQuote } from "@/components/StickyQuote";
import { ProductSpotlight } from "@/components/ProductSpotlight";
import { ProductFabricStrip } from "@/components/ProductFabricStrip";
import { VenetianSystem } from "@/components/VenetianSystem";
import {
  ProductCare,
  ProductClock,
  ProductClosing,
  ProductFaq,
  ProductMaterials,
  ProductMotorised,
  ProductPricing,
  ProductRooms,
  ProductSteps,
} from "@/components/product/ProductSections";
import { Configurator } from "@/components/Configurator";
import { VenetianBlind } from "@/components/visuals/VenetianBlind";
import { VENETIAN_FABRICS } from "@/lib/configurator/types";
import { useConfigurator } from "@/lib/configurator/context";

export function VenetianPage() {
  const t = useT();
  const { setProduct } = useConfigurator();
  const prod = t.products.venetian;
  const p = t.productPages.venetian;

  useEffect(() => {
    setProduct("venetian");
  }, [setProduct]);

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <PromoBar />
      <Nav />
      <main id="main" className="pt-1">
        <ProductSpotlight
          id="venetian"
          tone="paper"
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
          whyPipeline={p.why.pipeline}
          perfectFor={prod.perfectFor}
          detailCaption={prod.detailCaption}
          Detail={VenetianBlind}
          detailSrc="/showcase/white-venetian.webp"
        />
        <VenetianSystem />
        <ProductClock tone="cream" data={p.clock} />
        <ProductMaterials n="02" tone="paper" data={p.materials} />
        <ProductFabricStrip
          fabrics={VENETIAN_FABRICS}
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
