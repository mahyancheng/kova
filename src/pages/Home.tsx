import { PromoBar } from "@/components/PromoBar";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Philosophy } from "@/components/Philosophy";
import { Collection } from "@/components/Collection";
import { FactoryDirect } from "@/components/FactoryDirect";
import { Fabrics } from "@/components/Fabrics";
import { Configurator } from "@/components/Configurator";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { StickyQuote } from "@/components/StickyQuote";

/**
 * Landing page — brochure cover.
 *
 * Detailed enough to close a lead in one screenful of scrolling, brief
 * enough that visitors hungry for depth go to the dedicated brochure
 * pages (`/roller`, `/process`, `/configurator`, …).
 *
 * Order is deliberate:
 *  1. Hero          — brand promise + primary CTAs
 *  2. Marquee       — visual atmosphere strip
 *  3. Philosophy    — three short pillars
 *  4. Collection    — three product cards, each linking out to its page
 *  5. FactoryDirect — the "why us" argument (40% lower) for closing
 *  6. Configurator  — the live preview, the marquee feature
 */
export function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <PromoBar />
      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <Philosophy />
        <Collection />
        <FactoryDirect />
        <Fabrics />
        <Configurator />
        <FaqSection />
      </main>
      <Footer />
      <StickyQuote />
    </div>
  );
}
