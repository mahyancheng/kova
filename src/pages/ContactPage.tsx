import { PromoBar } from "@/components/PromoBar";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { StickyQuote } from "@/components/StickyQuote";
import { Contact } from "@/components/Contact";
import { Configurator } from "@/components/Configurator";

export function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <PromoBar />
      <Nav />
      <main id="main" className="pt-16">
        <Contact />
        {/*
          Configurator sits below the form so visitors who land on
          /contact directly see the form first. People who scroll past
          can still adjust their selection — submitting from there
          re-prefills the form above.
        */}
        <Configurator />
      </main>
      <Footer />
      <StickyQuote />
    </div>
  );
}
