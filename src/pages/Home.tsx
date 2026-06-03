import { useT } from "@/lib/i18n";
import { PromoBar } from "@/components/PromoBar";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { FactoryDirect } from "@/components/FactoryDirect";
import { Philosophy } from "@/components/Philosophy";
import { Collection } from "@/components/Collection";
import { Configurator } from "@/components/Configurator";
import { Marquee } from "@/components/Marquee";
import { ProductSpotlight } from "@/components/ProductSpotlight";
import { VenetianSystem } from "@/components/VenetianSystem";
import { Fabrics } from "@/components/Fabrics";
import { Compare } from "@/components/Compare";
import { Spaces } from "@/components/Spaces";
import { Process } from "@/components/Process";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { StickyQuote } from "@/components/StickyQuote";
import { RollerBlind } from "@/components/visuals/RollerBlind";
import { VenetianBlind } from "@/components/visuals/VenetianBlind";
import { VertiSheer } from "@/components/visuals/VertiSheer";

/**
 * Landing page — the original single-page composition. Extracted from
 * App.tsx so the router can mount it under `/` while reserving other
 * paths (e.g. `/blog`) for separate pages that reuse Nav + Footer.
 */
export function Home() {
  const t = useT();
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <PromoBar />
      <Nav />

      <main>
        <Hero />
        <FactoryDirect />
        <Philosophy />
        <Collection />
        <Configurator />
        <Marquee />

        <ProductSpotlight
          id="roller"
          tone="cream"
          {...t.products.roller}
          Detail={RollerBlind}
          detailSrc="/showcase/greige-roller.jpg"
        />

        <ProductSpotlight
          id="venetian"
          tone="paper"
          {...t.products.venetian}
          Detail={VenetianBlind}
          detailSrc="/showcase/white-venetian.jpg"
          reverse
        />

        <VenetianSystem />

        <ProductSpotlight
          id="vertisheer"
          tone="ink"
          {...t.products.vertisheer}
          Detail={VertiSheer}
          detailSrc="/showcase/pivot-silver-vertisheer.jpg"
        />

        <Compare />
        <Fabrics />
        <Spaces />
        <div id="process">
          <Process />
        </div>
        <Contact />
      </main>

      <Footer />
      <StickyQuote />
    </div>
  );
}
