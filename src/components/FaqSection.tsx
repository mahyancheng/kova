import { useEffect, useState } from "react";
import { Reveal } from "./Reveal";
import { useT } from "@/lib/i18n";

/**
 * Visible FAQ block — answers the questions Malaysian customers actually
 * ask before they fill out the form (price band, on-site measure, lead
 * time, motorisation, blind-type fit). Doubles as FAQPage structured
 * data: a sibling <script type="application/ld+json"> is mounted in
 * sync with the content so Google can lift the answers into AI Overviews
 * and rich snippets.
 *
 * The visible copy and the schema have to match exactly — Google policy.
 * We render both from the same i18n source so they can never drift.
 */
export function FaqSection() {
  const t = useT();
  const faq = t.faq;
  const [open, setOpen] = useState<number | null>(0);

  // Emit FAQPage JSON-LD alongside the visible content.
  useEffect(() => {
    const payload = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    };
    let el = document.head.querySelector(
      'script[type="application/ld+json"][data-jsonld="faq"]',
    );
    if (!el) {
      el = document.createElement("script");
      el.setAttribute("type", "application/ld+json");
      el.setAttribute("data-jsonld", "faq");
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(payload);
    return () => {
      el?.remove();
    };
  }, [faq]);

  return (
    <section className="fluid-section-y border-t border-[var(--color-line)]">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-7 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="eyebrow">{faq.eyebrow}</p>
              <h2 className="mt-3 lg:mt-4 font-serif text-[clamp(1.55rem,1.1rem+1.8vw,2.4rem)] leading-[1.08] tracking-tighter text-[var(--color-ink)]">
                {faq.titleA}{" "}
                <span className="italic font-light text-[var(--color-clay-deep)]">
                  {faq.titleB}
                </span>
              </h2>
              <p className="mt-4 lg:mt-5 fluid-body text-[var(--color-ink-soft)] max-w-sm">
                {faq.intro}
              </p>
            </Reveal>
          </div>

          <ul className="lg:col-span-8 border-t border-[var(--color-line)]">
            {faq.items.map((item, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={item.q} delay={i * 60}>
                  <li className="border-b border-[var(--color-line)]">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="w-full flex items-start justify-between gap-4 text-left py-5 lg:py-7 group"
                    >
                      <span className="font-serif text-[clamp(1.05rem,0.95rem+0.5vw,1.3rem)] leading-snug text-[var(--color-ink)] group-hover:text-[var(--color-clay-deep)] transition-colors">
                        {item.q}
                      </span>
                      <span
                        aria-hidden
                        className={
                          "shrink-0 mt-1.5 text-[var(--color-clay)] transition-transform " +
                          (isOpen ? "rotate-45" : "")
                        }
                      >
                        +
                      </span>
                    </button>
                    <div
                      className={
                        "overflow-hidden transition-[max-height,opacity] duration-300 ease-out " +
                        (isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0")
                      }
                    >
                      <p className="pb-5 lg:pb-7 pr-8 text-[clamp(0.92rem,0.88rem+0.2vw,1.02rem)] leading-relaxed text-[var(--color-ink-soft)] max-w-prose">
                        {item.a}
                      </p>
                    </div>
                  </li>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
