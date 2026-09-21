import { useT } from "@/lib/i18n";
import { PromoBar } from "@/components/PromoBar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { StickyQuote } from "@/components/StickyQuote";
import {
  Hero, Why, SwatchLibrary, Rooms, Price, Steps, Motorised, Care, Faq, Closing,
} from "@/components/brochure/Sections";
import { VertiSheerModes } from "@/components/brochure/features";
import { VertiSheerDesigner } from "@/components/brochure/designers";
import { WinPhoto } from "@/components/brochure/photo";
import { HERO_PHOTOS, VERTISHEER_SWATCH_GROUPS } from "@/lib/brochure/data";

/**
 * VertiSheer — laid out to the client's supplied brochure mockup: hero,
 * why, the vane-rotation demo, three light modes, fabric library, rooms,
 * price, process, motorisation, care, FAQ, quote.
 */
export function VertiSheerPage() {
  const t = useT();
  const p = t.productPages.vertisheer;
  const c = t.productPages.common;
  const prod = t.products.vertisheer;

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
          art={
            <WinPhoto
              src={HERO_PHOTOS.vertisheer.src}
              srcSet={HERO_PHOTOS.vertisheer.srcSet}
              alt={p.heroCaption}
              priority
            />
          }
        />
        <Why n="02" tone="paper" data={p.why} />
        <VertiSheerDesigner n="03" />
        <VertiSheerModes n="04" data={p.modes} />
        <SwatchLibrary n="05" tone="ground" data={p.swatches} groups={VERTISHEER_SWATCH_GROUPS} />
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
