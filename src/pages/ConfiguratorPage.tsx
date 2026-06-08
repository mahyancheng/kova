import { PromoBar } from "@/components/PromoBar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { StickyQuote } from "@/components/StickyQuote";
import { Configurator } from "@/components/Configurator";
import { Compare } from "@/components/Compare";
import { Fabrics } from "@/components/Fabrics";
import { Spaces } from "@/components/Spaces";

export function ConfiguratorPage() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <PromoBar />
      <Nav />
      <main id="main" className="pt-16">
        <Configurator />
        <Compare />
        <Fabrics />
        <Spaces />
      </main>
      <Footer />
      <StickyQuote />
    </div>
  );
}
