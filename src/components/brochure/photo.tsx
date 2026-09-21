/**
 * Photography inside the brochure's window frames.
 *
 * The mockups drew every window as SVG. Only the interactive previews
 * actually need to be drawn — everything static uses the real product
 * photography that already ships in /public, which is what the product
 * pages showed before the brochure rebuild.
 */

export function WinPhoto({
  src, alt, srcSet, sizes, priority = false,
}: {
  src: string;
  alt: string;
  srcSet?: string;
  sizes?: string;
  /** Above-the-fold hero — load eagerly so it isn't a deferred LCP. */
  priority?: boolean;
}) {
  return (
    <img
      src={src}
      alt={alt}
      srcSet={srcSet}
      sizes={sizes ?? (srcSet ? "(min-width: 900px) 1120px, 100vw" : undefined)}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding={priority ? "sync" : "async"}
    />
  );
}

/** Photographed fabric swatch filling a `.dot` circle. */
export function DotPhoto({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} loading="lazy" decoding="async" width={144} height={144} />;
}
