import { PromoBar } from "@/components/PromoBar";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Philosophy } from "@/components/Philosophy";
import { Collection } from "@/components/Collection";
import { Footer } from "@/components/Footer";
import { StickyQuote } from "@/components/StickyQuote";

/**
 * Landing page — slim brochure cover.
 *
 * Each product / process / configurator block lives on its own page
 * (see `pages/Roller.tsx`, `pages/ProcessPage.tsx`, etc.). The home is
 * here to set tone (hero + brand atmosphere + philosophy snippet) and
 * lead visitors into the Collection cards, which link to the dedicated
 * product pages.
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
      </main>
      <Footer />
      <StickyQuote />
    </div>
  );
}
