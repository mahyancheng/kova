import { useT } from "@/lib/i18n";
import { PromoBar } from "@/components/PromoBar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { StickyQuote } from "@/components/StickyQuote";
import {
  Hero, Why, SwatchLibrary, Rooms, Price, Steps, Motorised, Care, Faq, Closing,
} from "@/components/brochure/Sections";
import { RollerFabricGuide } from "@/components/brochure/features";
import { RollerDesigner } from "@/components/brochure/designers";
import { RollerHeroArt } from "@/components/brochure/svg";
import { ROLLER_SWATCH_GROUPS } from "@/lib/brochure/data";

/**
 * Roller Blinds — laid out to the client's supplied brochure mockup:
 * hero, why, fabric comparison, swatch library, rooms, price, process,
 * designer, motorisation, care, FAQ, quote.
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
      <main id="main" className="brochure">
        <Hero
          n="01"
          eyebrow={c.heroEyebrow}
          h1={p.h1}
          subhead={p.subhead}
          body={p.heroBody}
          caption={p.heroCaption}
          art={<RollerHeroArt label={p.heroCaption} />}
        />
        <Why n="02" tone="paper" data={p.why} />
        <RollerFabricGuide n="03" data={p.fabricGuide} />
        <SwatchLibrary n="04" tone="paper" data={p.swatches} groups={ROLLER_SWATCH_GROUPS} />
        <Rooms n="05" tone="ground" data={p.rooms} />
        <Price n="06" tone="paper" data={p.price} />
        <Steps n="07" data={p.steps} />
        <RollerDesigner n="08" />
        <Motorised n="09" tone="paper" data={p.motorised} />
        <Care n="10" tone="ground" data={p.care} />
        <Faq n="11" tone="paper" data={p.faq} />
        <Closing
          n="12"
          data={p.closing}
          waMessage={`Hi KOVA, I would like a quote for ${prod.name}.`}
        />
      </main>
      <Footer />
      <StickyQuote />
    </div>
  );
}
