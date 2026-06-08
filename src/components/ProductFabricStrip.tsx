import { Reveal } from "./Reveal";
import { type Fabric } from "@/lib/configurator/types";

/**
 * Compact fabric gallery used at the bottom of each product page.
 * Renders the swatch circle (photo if available, hex fallback) and the
 * fabric name. Intentionally simpler than the homepage's horizontal
 * carousel — a brochure page benefits from showing every option at once
 * so visitors can scan and pick.
 */
export function ProductFabricStrip({
  fabrics,
  eyebrow,
  title,
  body,
}: {
  fabrics: Fabric[];
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <section className="fluid-section-y border-t border-[var(--color-line)]">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-6 lg:px-10">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-3 lg:mt-4 font-serif text-[clamp(1.5rem,1rem+2vw,2.4rem)] leading-tight tracking-tighter text-[var(--color-ink)] max-w-2xl">
            {title}
          </h2>
          {body && (
            <p className="mt-4 lg:mt-5 fluid-body text-[var(--color-ink-soft)] max-w-xl leading-relaxed">
              {body}
            </p>
          )}
        </Reveal>

        <ul className="mt-10 lg:mt-14 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-x-4 gap-y-7">
          {fabrics.map((f, i) => (
            <Reveal key={f.name} delay={i * 30}>
              <li className="flex flex-col items-center text-center">
                <div
                  className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full overflow-hidden border border-[var(--color-line)] shrink-0"
                  style={{ backgroundColor: f.hex }}
                >
                  {f.image && (
                    <img
                      src={f.image}
                      alt={f.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <p className="mt-2.5 text-[0.78rem] leading-tight text-[var(--color-ink-soft)] max-w-[14ch]">
                  {f.name}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
