import { useT } from "@/lib/i18n";
import { PromoBar } from "@/components/PromoBar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { StickyQuote } from "@/components/StickyQuote";
import { Configurator } from "@/components/Configurator";
import { Compare } from "@/components/Compare";
import { Fabrics } from "@/components/Fabrics";
import { Spaces } from "@/components/Spaces";

export function ConfiguratorPage() {
  const t = useT();
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <PromoBar />
      <Nav />
      <main id="main" className="pt-16">
        <h1 className="sr-only">{t.seo.pages.configurator.title}</h1>
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
