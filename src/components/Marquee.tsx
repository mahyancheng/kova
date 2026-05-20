import { useT } from "@/lib/i18n";

export function Marquee() {
  const t = useT();
  const phrases = t.marquee;
  return (
    <section
      aria-hidden
      className="relative py-[clamp(1.25rem,0.8rem+1.5vw,2.5rem)] overflow-hidden border-y border-[var(--color-line)] bg-[var(--color-cream)]"
    >
      <div className="flex gap-[clamp(2rem,1rem+2vw,3rem)] whitespace-nowrap animate-[scroll_38s_linear_infinite] font-serif text-[clamp(1.4rem,0.9rem+2vw,2.6rem)] tracking-tight text-[var(--color-ink)]/70">
        {[...phrases, ...phrases, ...phrases].map((p, i) => (
          <span key={i} className="flex items-center gap-8 lg:gap-12">
            <span className="italic font-light">{p}</span>
            <span className="text-[var(--color-clay)]">✺</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
