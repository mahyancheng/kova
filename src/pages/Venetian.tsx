import { useT } from "@/lib/i18n";
import { PromoBar } from "@/components/PromoBar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { StickyQuote } from "@/components/StickyQuote";
import {
  Hero, Why, SwatchLibrary, Rooms, Price, Steps, Motorised, Care, Faq, Closing,
} from "@/components/brochure/Sections";
import { VenetianClock, VenetianMaterials } from "@/components/brochure/features";
import { VenetianStage } from "@/components/brochure/designers";
import { VenetianHeroArt } from "@/components/brochure/svg";
import { VENETIAN_SWATCH_GROUPS } from "@/lib/brochure/data";

/**
 * Venetian Blinds — laid out to the client's supplied brochure mockup:
 * hero, why (+ the four-hour clock strip), the 3D tilt stage, aluminium
 * vs timber, finish library, rooms, price, process, motorisation, care,
 * FAQ, quote.
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
      <main id="main" className="brochure">
        <Hero
          n="01"
          eyebrow={c.heroEyebrow}
          h1={p.h1}
          subhead={p.subhead}
          body={p.heroBody}
          caption={p.heroCaption}
          art={<VenetianHeroArt label={p.heroCaption} />}
        />
        <Why n="02" tone="paper" data={p.why} extra={<VenetianClock data={p.clock} />} />
        <VenetianStage n="03" />
        <VenetianMaterials n="04" data={p.materials} />
        <SwatchLibrary n="05" tone="ground" data={p.swatches} groups={VENETIAN_SWATCH_GROUPS} />
        <Rooms n="06" tone="paper" data={p.rooms} />
        <Price n="07" tone="ground" data={p.price} />
        <Steps n="08" data={p.steps} />
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
