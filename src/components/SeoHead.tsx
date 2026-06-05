import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useT } from "@/lib/i18n";

/**
 * Keeps the document <title>, social meta tags, canonical URL and the
 * EN ↔ BM hreflang pair in sync with the active route and language.
 *
 * Crawlers see the static index.html on first byte; once the SPA
 * hydrates this hook updates the head to the actually-rendered language
 * and the actually-current path. That matters most for the BM landing
 * (/bidai) where the URL itself carries a target keyword and the
 * canonical/hreflang pair tells Google to index it as the Malay
 * counterpart of `/`.
 */
function setMeta(selector: string, content: string) {
  const el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (el) el.content = content;
}

/** Upsert a <link rel="..."> tag, optionally keyed by hreflang. */
function setLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    if (hreflang) el.hreflang = hreflang;
    document.head.appendChild(el);
  }
  el.href = href;
}

export function SeoHead() {
  const t = useT();
  const { pathname } = useLocation();
  const seo = t.seo;

  useEffect(() => {
    // --- Title + description / OG / Twitter (language-driven) ------
    document.title = seo.title;
    setMeta('meta[name="description"]', seo.description);
    setMeta('meta[name="keywords"]', seo.keywords);
    setMeta('meta[property="og:title"]', seo.title);
    setMeta('meta[property="og:description"]', seo.description);
    setMeta('meta[name="twitter:title"]', seo.title);
    setMeta('meta[name="twitter:description"]', seo.description);

    // --- Canonical + hreflang pair (route-driven) ------------------
    const origin = window.location.origin;

    // Compute the EN and BM versions of the *current* page so the
    // hreflang pair points at the matching localised URL. Blog posts
    // share a slug across languages; only the prefix differs.
    let enHref = `${origin}/`;
    let msHref = `${origin}/bidai`;
    let canonicalPath: string = pathname;

    if (pathname === "/" || pathname === "/bidai") {
      // Home — defaults above already correct.
    } else if (pathname === "/blog" || pathname === "/bidai/jurnal") {
      enHref = `${origin}/blog`;
      msHref = `${origin}/bidai/jurnal`;
    } else if (pathname.startsWith("/blog/")) {
      const slug = pathname.slice("/blog/".length);
      enHref = `${origin}/blog/${slug}`;
      msHref = `${origin}/bidai/jurnal/${slug}`;
    } else if (pathname.startsWith("/bidai/jurnal/")) {
      const slug = pathname.slice("/bidai/jurnal/".length);
      enHref = `${origin}/blog/${slug}`;
      msHref = `${origin}/bidai/jurnal/${slug}`;
    } else {
      // Unknown route → canonical to EN home.
      canonicalPath = "/";
    }

    setLink("canonical", `${origin}${canonicalPath}`);
    setLink("alternate", enHref, "en");
    setLink("alternate", msHref, "ms");
    setLink("alternate", enHref, "x-default");

    // og:locale matches the current page's language.
    setMeta('meta[property="og:locale"]', t.meta.htmlLang === "ms" ? "ms_MY" : "en_MY");
  }, [seo, pathname, t.meta.htmlLang]);

  return null;
}
