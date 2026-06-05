import { useEffect } from "react";
import { useT } from "@/lib/i18n";

/**
 * Keeps the document <title> and the SEO/social meta tags in sync with
 * the currently active language. Crawlers see the static EN/BM-merged
 * copy from index.html on first byte; once the SPA hydrates this hook
 * swaps to the language the visitor actually has selected — so the
 * browser tab title, share previews and any AI summarisers see the
 * right localised copy.
 */
function setMeta(selector: string, content: string) {
  const el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (el) el.content = content;
}

export function SeoHead() {
  const t = useT();
  const seo = t.seo;

  useEffect(() => {
    document.title = seo.title;
    setMeta('meta[name="description"]', seo.description);
    setMeta('meta[name="keywords"]', seo.keywords);
    setMeta('meta[property="og:title"]', seo.title);
    setMeta('meta[property="og:description"]', seo.description);
    setMeta('meta[name="twitter:title"]', seo.title);
    setMeta('meta[name="twitter:description"]', seo.description);
  }, [seo]);

  return null;
}
