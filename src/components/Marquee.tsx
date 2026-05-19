import { useT } from "@/lib/i18n";

export function Marquee() {
  const t = useT();
  const phrases = t.marquee;
  return (
    <section
      aria-hidden
      className="relative py-10 overflow-hidden border-y border-[var(--color-line)] bg-[var(--color-cream)]"
    >
      <div className="flex gap-12 whitespace-nowrap animate-[scroll_38s_linear_infinite] font-serif text-[2.1rem] sm:text-[2.6rem] tracking-tight text-[var(--color-ink)]/70">
        {[...phrases, ...phrases, ...phrases].map((p, i) => (
          <span key={i} className="flex items-center gap-12">
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
