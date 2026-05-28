import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

type Ratio = "4/5" | "3/4" | "1/1" | "16/9" | "4/3" | "5/7" | "21/9" | "9/16";

const ratioClass: Record<Ratio, string> = {
  "4/5": "aspect-[4/5]",
  "3/4": "aspect-[3/4]",
  "1/1": "aspect-square",
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "5/7": "aspect-[5/7]",
  "21/9": "aspect-[21/9]",
  "9/16": "aspect-[9/16]",
};

export function ImageSlot({
  ratio = "4/5",
  label,
  caption,
  tone = "cream",
  src,
  alt,
  className,
  children,
}: {
  ratio?: Ratio;
  label?: string;
  caption?: string;
  tone?: "cream" | "paper" | "sand" | "ink";
  src?: string;
  alt?: string;
  className?: string;
  children?: ReactNode;
}) {
  const t = useT();
  const toneClass =
    tone === "ink"
      ? "bg-[var(--color-ink)] text-[var(--color-cream)] border-transparent"
      : tone === "sand"
      ? "bg-[#E5DBC1] text-[var(--color-ink)] border-[var(--color-line)]"
      : tone === "paper"
      ? "bg-[var(--color-paper)] text-[var(--color-ink)] border-[var(--color-line)]"
      : "bg-[var(--color-cream-light)] text-[var(--color-ink)] border-[var(--color-line)]";

  return (
    <figure className={cn("group/slot", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-[6px] border hatch",
          ratioClass[ratio],
          toneClass,
        )}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-80"
          style={{
            background:
              tone === "ink"
                ? "radial-gradient(120% 80% at 50% 0%, rgba(255,233,179,0.18) 0%, transparent 60%)"
                : "radial-gradient(120% 80% at 50% 0%, rgba(255,233,179,0.45) 0%, transparent 60%)",
          }}
        />

        {src && (
          <img
            src={src}
            alt={alt ?? ""}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
            loading="lazy"
          />
        )}

        {!src && children && (
          <div className="absolute inset-0 w-full h-full">{children}</div>
        )}

        {!src && !children && (
          <>
            <span
              aria-hidden
              className="absolute top-4 left-4 text-[0.7rem] tracking-widest uppercase text-current/60"
            >
              {t.imageSlot.photo}
            </span>
            <span
              aria-hidden
              className="absolute bottom-4 right-4 text-[0.7rem] tracking-widest uppercase text-current/60"
            >
              {t.imageSlot.coming}
            </span>
            <svg
              aria-hidden
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full opacity-15"
            >
              <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.4" />
              <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="0.4" />
            </svg>
          </>
        )}

        {label && (
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-[var(--color-cream)]/85 backdrop-blur-sm text-[var(--color-ink)] text-[0.7rem] tracking-widest uppercase px-2.5 py-1 rounded-full border border-[var(--color-line)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-clay)]" />
            {label}
          </span>
        )}
      </div>

      {caption && (
        <figcaption className="mt-3 text-[0.78rem] text-[var(--color-muted)] leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
