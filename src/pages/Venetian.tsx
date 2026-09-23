import { useT } from "@/lib/i18n";
import { PromoBar } from "@/components/PromoBar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { StickyQuote } from "@/components/StickyQuote";
import {
  Hero, Why, SwatchLibrary, Rooms, Price, Steps, Motorised, Care, Faq, Closing,
} from "@/components/product/sections";
import { VenetianClock, VenetianMaterials } from "@/components/product/features";
import { VenetianStage } from "@/components/product/designers";
import { HERO_PHOTOS, VENETIAN_SWATCH_GROUPS } from "@/lib/brochure/data";

/**
 * Venetian Blinds. Content follows the client's brochure; presentation
 * uses the site's own design system, the same one the home page uses.
 */
export function VenetianPage() {
  const t = useT();
  const p = t.productPages.venetian;
  const c = t.productPages.common;
  const prod = t.products.venetian;

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <PromoBar />
      <Nav />
      <main id="main">
        <Hero
          n="01"
          eyebrow={c.heroEyebrow}
          h1={p.h1}
          subhead={p.subhead}
          body={p.heroBody}
          photo={HERO_PHOTOS.venetian}
          caption={p.heroCaption}
        />
        <Why n="02" tone="band" data={p.why} extra={<VenetianClock data={p.clock} />} />
        <VenetianStage n="03" tone="cream" />
        <VenetianMaterials n="04" tone="band" data={p.materials} />
        <SwatchLibrary n="05" tone="cream" data={p.swatches} groups={VENETIAN_SWATCH_GROUPS} />
        <Rooms n="06" tone="band" data={p.rooms} />
        <Price n="07" tone="cream" data={p.price} />
        <Steps n="08" data={p.steps} />
        <Motorised n="09" tone="band" data={p.motorised} />
        <Care n="10" tone="cream" data={p.care} />
        <Faq n="11" tone="band" data={p.faq} />
        <Closing n="12" data={p.closing} waMessage={`Hi KOVA, I would like a quote for ${prod.name}.`} />
      </main>
      <Footer />
      <StickyQuote />
    </div>
  );
}
