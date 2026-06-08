import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useT } from "@/lib/i18n";

/**
 * Per-route JSON-LD structured data.
 *
 * Crawlers + AI answer engines lean heavily on schema.org JSON-LD to
 * understand "what is this site" beyond the rendered text. The blocks
 * emitted here cover the cases Google highlights as high-signal:
 *  - Organization / LocalBusiness with NAP, hours and service area
 *  - WebSite with a SearchAction Google can wire into Sitelinks
 *  - Three Product nodes (Roller / Venetian / VertiSheer)
 *  - BreadcrumbList on blog pages
 *  - Article on a single post (powers Google Discover + AI summaries)
 *
 * One <script type="application/ld+json"> per type, replaced on every
 * route/language change.
 */
const SITE_URL = "https://kovasunshade.com";
const LOGO_URL = `${SITE_URL}/favicon.svg`;
const SAME_AS: string[] = []; // Add socials when they exist.

/** Upsert a JSON-LD script tag keyed by a stable id. */
function setJsonLd(id: string, payload: unknown) {
  let el = document.head.querySelector(`script[type="application/ld+json"][data-jsonld="${id}"]`);
  if (!payload) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement("script");
    el.setAttribute("type", "application/ld+json");
    el.setAttribute("data-jsonld", id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(payload);
}

function clearJsonLd(id: string) {
  const el = document.head.querySelector(`script[type="application/ld+json"][data-jsonld="${id}"]`);
  if (el) el.remove();
}

export function JsonLd() {
  const t = useT();
  const { pathname } = useLocation();
  const lang = t.meta.htmlLang;
  const isMalay = lang === "ms";

  useEffect(() => {
    // --- Always present: Organization / LocalBusiness + WebSite -----
    const business = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#business`,
      name: "Kova Sun Shade",
      alternateName: isMalay ? "Kova — Bidai dan Langsir Tingkap" : undefined,
      description: t.seo.description,
      url: SITE_URL,
      email: "info@kovasunshade.com",
      telephone: "+60123456789",
      logo: LOGO_URL,
      image: `${SITE_URL}/showcase/greige-roller.webp`,
      address: {
        "@type": "PostalAddress",
        streetAddress: "No. 14, Jalan Bayu 4",
        addressLocality: "Petaling Jaya",
        addressRegion: "Selangor",
        addressCountry: "MY",
      },
      areaServed: [
        { "@type": "AdministrativeArea", name: "Klang Valley" },
        { "@type": "AdministrativeArea", name: "Greater Kuala Lumpur" },
        { "@type": "AdministrativeArea", name: "Selangor" },
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: "10:00",
          closes: "16:00",
          description: "By appointment",
        },
      ],
      knowsLanguage: ["en", "ms"],
      foundingDate: "2014",
      sameAs: SAME_AS,
    };

    const website = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Kova Sun Shade",
      inLanguage: ["en-MY", "ms-MY"],
      publisher: { "@id": `${SITE_URL}/#business` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    };

    setJsonLd("business", business);
    setJsonLd("website", website);

    // --- Product trio (home routes only) ----------------------------
    const onHomeRoute = pathname === "/" || pathname === "/bidai";
    if (onHomeRoute) {
      const products = [
        {
          "@type": "Product",
          name: isMalay ? "Bidai Roller" : "Roller Blinds",
          category: "Window Blinds",
          description: t.products.roller.body[0],
          image: `${SITE_URL}/showcase/greige-roller.webp`,
          brand: { "@type": "Brand", name: "Kova Sun Shade" },
          url: `${SITE_URL}${isMalay ? "/bidai" : "/"}#roller`,
        },
        {
          "@type": "Product",
          name: isMalay ? "Bidai Venetian" : "Venetian Blinds",
          category: "Window Blinds",
          description: t.products.venetian.body[0],
          image: `${SITE_URL}/showcase/white-venetian.webp`,
          brand: { "@type": "Brand", name: "Kova Sun Shade" },
          url: `${SITE_URL}${isMalay ? "/bidai" : "/"}#venetian`,
        },
        {
          "@type": "Product",
          name: "VertiSheer",
          category: "Vertical Sheer Blinds",
          description: t.products.vertisheer.body[0],
          image: `${SITE_URL}/showcase/pivot-silver-vertisheer.webp`,
          brand: { "@type": "Brand", name: "Kova Sun Shade" },
          url: `${SITE_URL}${isMalay ? "/bidai" : "/"}#vertisheer`,
        },
      ];
      setJsonLd("products", {
        "@context": "https://schema.org",
        "@graph": products,
      });
    } else {
      clearJsonLd("products");
    }

    // --- Blog breadcrumbs ------------------------------------------
    const onBlogIndex = pathname === "/blog" || pathname === "/bidai/jurnal";
    const onBlogPost =
      pathname.startsWith("/blog/") || pathname.startsWith("/bidai/jurnal/");

    if (onBlogIndex || onBlogPost) {
      const homeUrl = isMalay ? `${SITE_URL}/bidai` : `${SITE_URL}/`;
      const blogUrl = isMalay ? `${SITE_URL}/bidai/jurnal` : `${SITE_URL}/blog`;
      const items: Array<{ "@type": string; position: number; name: string; item: string }> = [
        { "@type": "ListItem", position: 1, name: "Home", item: homeUrl },
        { "@type": "ListItem", position: 2, name: t.nav.journal, item: blogUrl },
      ];
      if (onBlogPost) {
        const slug = pathname.split("/").pop() || "";
        items.push({
          "@type": "ListItem",
          position: 3,
          name: slug.replace(/-/g, " "),
          item: `${SITE_URL}${pathname}`,
        });
      }
      setJsonLd("breadcrumbs", {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items,
      });
    } else {
      clearJsonLd("breadcrumbs");
    }

    // --- Single blog post Article (filled in by BlogPost via window
    //     event so we don't double-fetch — see BlogPost.tsx). -------
    if (!onBlogPost) clearJsonLd("article");
  }, [pathname, lang, isMalay, t]);

  return null;
}

/**
 * Helper for blog post pages — emits the Article schema once a post is
 * loaded. Centralised here so the JSON shape stays consistent.
 */
export function setArticleJsonLd(post: {
  title: string;
  excerpt: string | null;
  body_md: string;
  cover_image_url: string | null;
  author: string | null;
  published_at: string | null;
  slug: string;
}, pathname: string, lang: string) {
  setJsonLd("article", {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? post.title,
    image: post.cover_image_url ? [post.cover_image_url] : undefined,
    datePublished: post.published_at,
    dateModified: post.published_at,
    inLanguage: lang === "ms" ? "ms-MY" : "en-MY",
    author: { "@type": "Organization", name: post.author ?? "Kova Sun Shade" },
    publisher: { "@id": `${SITE_URL}/#business` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}${pathname}`,
    },
  });
}
