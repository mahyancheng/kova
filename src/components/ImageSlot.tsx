import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n";

type Ratio = "4/5" | "3/4" | "1/1" | "16/9" | "4/3" | "5/4" | "5/7" | "21/9" | "9/16";

const ratioClass: Record<Ratio, string> = {
  "4/5": "aspect-[4/5]",
  "3/4": "aspect-[3/4]",
  "1/1": "aspect-square",
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "5/4": "aspect-[5/4]",
  "5/7": "aspect-[5/7]",
  "21/9": "aspect-[21/9]",
  "9/16": "aspect-[9/16]",
};

export function ImageSlot({
  ratio = "4/5",
  caption,
  tone = "cream",
  src,
  alt,
  className,
  children,
  // priority 是简写：Hero 等首屏调用点只传这一个 boolean。
  // ProductSpotlight 等调用点自己算好 loading/fetchPriority 精确传入——
  // 两种调用方式都要支持，所以 loading/fetchPriority/decoding 的默认值
  // 由 priority 派生，但显式传入时仍以显式值为准。
  priority = false,
  loading = priority ? "eager" : "lazy",
  fetchPriority = priority ? "high" : "auto",
  decoding = priority ? "sync" : "async",
  // ✅ 新增：支持具体的宽高和响应式图片属性
  width,
  height,
  srcSet,
  sizes,
}: {
  ratio?: Ratio;
  caption?: string;
  tone?: "cream" | "paper" | "sand" | "ink";
  src?: string;
  alt?: string;
  className?: string;
  children?: ReactNode;
  /** Above-the-fold image — load eagerly so it isn't a deferred LCP. */
  priority?: boolean;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
  decoding?: "async" | "sync" | "auto";
  // ✅ 新增类型定义
  width?: number | string;
  height?: number | string;
  srcSet?: string;
  sizes?: string;
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
        {/* 背景遮罩代码省略，保持原样 */}
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
            // ✅ 传入新增的属性
            width={width}
            height={height}
            srcSet={srcSet}
            sizes={sizes}
            loading={loading}
            fetchPriority={fetchPriority}
            decoding={decoding}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
          />
        )}

        {!src && children && (
          <div className="absolute inset-0 w-full h-full">{children}</div>
        )}

        {/* 占位符代码省略，保持原样 */}
        {!src && !children && (
          <>
            <span aria-hidden className="absolute top-4 left-4 text-[0.7rem] tracking-widest uppercase text-current/60">{t.imageSlot.photo}</span>
            <span aria-hidden className="absolute bottom-4 right-4 text-[0.7rem] tracking-widest uppercase text-current/60">{t.imageSlot.coming}</span>
            <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-15">
              <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.4" />
              <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="0.4" />
            </svg>
          </>
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