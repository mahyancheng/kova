import { RollerBlind } from "./visuals/RollerBlind";
import { VenetianBlind } from "./visuals/VenetianBlind";
import { VertiSheer } from "./visuals/VertiSheer";
import { ImageSlot } from "./ImageSlot";
import { Reveal } from "./Reveal";
import { useT } from "@/lib/i18n";

const visuals = {
  roller: RollerBlind,
  venetian: VenetianBlind,
  vertisheer: VertiSheer,
} as const;

/** Showcase scene photo per product (falls back to the SVG visual if absent). */
const scenes: Record<string, string> = {
  roller: "/showcase/greige-roller.jpg",
  venetian: "/showcase/white-venetian.jpg",
  vertisheer: "/showcase/pivot-anchor-vertisheer.jpg",
};

export function Collection() {
  const t = useT();
  return (
    <section id="collection" className="relative fluid-section-y">
      <div className="max-w-[1380px] mx-auto px-5 sm:px-6 lg:px-10">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-[clamp(1.5rem,1rem+2vw,3.5rem)]">
            <div>
              <p className="eyebrow">{t.collection.eyebrow}</p>
              <h2 className="mt-3 lg:mt-4 headline fluid-h3 text-[var(--color-ink)] max-w-2xl">
                {t.collection.titleA}
                <span className="italic font-light text-[var(--color-clay-deep)]"> {t.collection.titleB}</span>
              </h2>
            </div>
            <p className="max-w-md fluid-body text-[var(--color-ink-soft)] leading-relaxed">
              {t.collection.body}
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
          {t.collection.items.map((item, i) => {
            const Visual = visuals[item.id as keyof typeof visuals];
            return (
              <Reveal key={item.id} delay={i * 100}>
                <a
                  href={`#${item.id}`}
                  className="group relative flex flex-col bg-[var(--color-paper)] border border-[var(--color-line)] rounded-md overflow-hidden hover:border-[var(--color-ink)] transition-colors h-full"
                >
                  <div className="overflow-hidden">
                    <ImageSlot ratio="4/5" tone="sand" src={scenes[item.id]} alt={item.name}>
                      <Visual className="w-full h-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]" />
                    </ImageSlot>
                  </div>
                  <div className="p-5 lg:p-7 flex flex-col grow">
                    <div className="flex items-center justify-between gap-3">
                      <p className="eyebrow">{item.eyebrow}</p>
                      <span className="inline-flex items-center gap-1.5 text-[0.64rem] lg:text-[0.68rem] tracking-widest uppercase text-[var(--color-clay-deep)]">
                        <span className="h-1 w-1 rounded-full bg-[var(--color-clay)]" />
                        {t.collection.badge}
                      </span>
                    </div>
                    <h3 className="mt-2.5 font-serif text-[clamp(1.3rem,1rem+1vw,1.65rem)] leading-tight tracking-tight text-[var(--color-ink)]">
                      {item.name}
                    </h3>
                    <p className="mt-2 lg:mt-3 text-[clamp(0.86rem,0.82rem+0.2vw,0.94rem)] leading-relaxed text-[var(--color-muted)]">
                      {item.blurb}
                    </p>
                    <span className="mt-4 lg:mt-6 inline-flex items-center gap-1.5 text-[0.84rem] lg:text-[0.88rem] font-medium text-[var(--color-ink)] group-hover:text-[var(--color-clay-deep)] transition-colors">
                      {t.collection.learnMore}
                      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                    </span>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
