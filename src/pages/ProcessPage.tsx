import { useT } from "@/lib/i18n";
import { PromoBar } from "@/components/PromoBar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { StickyQuote } from "@/components/StickyQuote";
import { FactoryDirect } from "@/components/FactoryDirect";
import { Philosophy } from "@/components/Philosophy";
import { Process } from "@/components/Process";
import { Configurator } from "@/components/Configurator";

export function ProcessPage() {
  const t = useT();
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <PromoBar />
      <Nav />
      <main id="main" className="pt-16">
        <h1 className="sr-only">{t.seo.pages.process.title}</h1>
        <FactoryDirect />
        <Philosophy />
        <div id="process">
          <Process />
        </div>
        <Configurator />
      </main>
      <Footer />
      <StickyQuote />
    </div>
  );
}
