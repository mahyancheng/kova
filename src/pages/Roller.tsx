import { useT } from "@/lib/i18n";
import { PromoBar } from "@/components/PromoBar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { StickyQuote } from "@/components/StickyQuote";
import {
  Hero, Why, SwatchLibrary, Rooms, Price, Steps, Motorised, Care, Faq, Closing,
} from "@/components/product/sections";
import { RollerFabricGuide } from "@/components/product/features";
import { RollerDesigner } from "@/components/product/designers";
import { HERO_PHOTOS, ROLLER_SWATCH_GROUPS } from "@/lib/brochure/data";

/**
 * Roller Blinds. Content follows the client's brochure; presentation uses
 * the site's own design system, the same one the home page uses.
 */
export function RollerPage() {
  const t = useT();
  const p = t.productPages.roller;
  const c = t.productPages.common;
  const prod = t.products.roller;

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
          photo={HERO_PHOTOS.roller}
          caption={p.heroCaption}
        />
        <Why n="02" tone="band" data={p.why} />
        <RollerFabricGuide n="03" tone="cream" data={p.fabricGuide} />
        <SwatchLibrary n="04" tone="band" data={p.swatches} groups={ROLLER_SWATCH_GROUPS} />
        <Rooms n="05" tone="cream" data={p.rooms} />
        <Price n="06" tone="band" data={p.price} />
        <Steps n="07" data={p.steps} />
        <RollerDesigner n="08" tone="cream" />
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
