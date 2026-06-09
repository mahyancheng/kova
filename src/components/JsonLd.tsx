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

    // Service — what the business actually offers, with area + language.
    const service = {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${SITE_URL}/#service`,
      name: isMalay
        ? "Bidai dibuat ikut ukuran — pengukuran, pembuatan dan pemasangan"
        : "Made-to-measure window blinds — measure, manufacture and install",
      serviceType: isMalay
        ? "Pembuatan dan pemasangan bidai tingkap"
        : "Window blind manufacture and installation",
      provider: { "@id": `${SITE_URL}/#business` },
      areaServed: [
        { "@type": "AdministrativeArea", name: "Klang Valley" },
        { "@type": "AdministrativeArea", name: "Greater Kuala Lumpur" },
        { "@type": "AdministrativeArea", name: "Selangor" },
      ],
      availableLanguage: ["en", "ms"],
      offers: {
        "@type": "Offer",
        priceCurrency: "MYR",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}${isMalay ? "/bidai/hubungi" : "/contact"}`,
      },
    };

    setJsonLd("business", business);
    setJsonLd("website", website);
    setJsonLd("service", service);

    // --- Per-product schema (dedicated product pages) ----------------
    const productMatch = pathname.match(
      /^(?:\/bidai)?\/(roller|venetian|vertisheer)$/,
    );
    if (productMatch) {
      const key = productMatch[1] as "roller" | "venetian" | "vertisheer";
      const meta = {
        roller: {
          name: isMalay ? "Bidai Roller" : "Roller Blinds",
          category: "Roller Blinds",
          description: t.products.roller.body[0],
          image: `${SITE_URL}/showcase/greige-roller.webp`,
        },
        venetian: {
          name: isMalay ? "Bidai Venetian" : "Venetian Blinds",
          category: "Venetian Blinds",
          description: t.products.venetian.body[0],
          image: `${SITE_URL}/showcase/white-venetian.webp`,
        },
        vertisheer: {
          name: "VertiSheer",
          category: "Vertical Sheer Blinds",
          description: t.products.vertisheer.body[0],
          image: `${SITE_URL}/showcase/pivot-silver-vertisheer.webp`,
        },
      }[key];
      setJsonLd("products", {
        "@context": "https://schema.org",
        "@type": "Product",
        ...meta,
        brand: { "@type": "Brand", name: "Kova Sun Shade" },
        url: `${SITE_URL}${pathname}`,
        areaServed: "Klang Valley, Malaysia",
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          priceCurrency: "MYR",
          url: `${SITE_URL}${isMalay ? "/bidai/hubungi" : "/contact"}`,
          seller: { "@id": `${SITE_URL}/#business` },
        },
      });
    } else {
      clearJsonLd("products");
    }

    // --- HowTo (process page) --------------------------------------
    const onProcess = pathname === "/process" || pathname === "/bidai/proses";
    if (onProcess) {
      setJsonLd("howto", {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: isMalay
          ? "Cara kami pasang bidai anda — empat langkah"
          : "How Kova Sun Shade installs your blinds — four steps",
        description: t.process.intro,
        step: t.process.steps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.title,
          text: s.body,
        })),
        totalTime: "P14D",
        inLanguage: isMalay ? "ms-MY" : "en-MY",
      });
    } else {
      clearJsonLd("howto");
    }

    // --- Breadcrumbs (every brochure + blog page) ------------------
    const homeUrl = isMalay ? `${SITE_URL}/bidai` : `${SITE_URL}/`;
    const blogUrl = isMalay ? `${SITE_URL}/bidai/jurnal` : `${SITE_URL}/blog`;
    const onBlogIndex = pathname === "/blog" || pathname === "/bidai/jurnal";
    const onBlogPost =
      pathname.startsWith("/blog/") || pathname.startsWith("/bidai/jurnal/");

    /** Maps the current pathname to its breadcrumb chain. */
    const breadcrumbItems: Array<{ "@type": string; position: number; name: string; item: string }> = [];
    breadcrumbItems.push({ "@type": "ListItem", position: 1, name: "Home", item: homeUrl });

    if (onBlogIndex || onBlogPost) {
      breadcrumbItems.push({ "@type": "ListItem", position: 2, name: t.nav.journal, item: blogUrl });
      if (onBlogPost) {
        const slug = pathname.split("/").pop() || "";
        breadcrumbItems.push({
          "@type": "ListItem",
          position: 3,
          name: slug.replace(/-/g, " "),
          item: `${SITE_URL}${pathname}`,
        });
      }
    } else if (productMatch) {
      breadcrumbItems.push({
        "@type": "ListItem",
        position: 2,
        name: productMatch[1] === "roller" ? (isMalay ? "Bidai Roller" : "Roller Blinds")
            : productMatch[1] === "venetian" ? (isMalay ? "Bidai Venetian" : "Venetian Blinds")
            : "VertiSheer",
        item: `${SITE_URL}${pathname}`,
      });
    } else if (onProcess) {
      breadcrumbItems.push({
        "@type": "ListItem",
        position: 2,
        name: isMalay ? "Proses" : "Process",
        item: `${SITE_URL}${pathname}`,
      });
    } else if (pathname === "/configurator" || pathname === "/bidai/reka") {
      breadcrumbItems.push({
        "@type": "ListItem",
        position: 2,
        name: isMalay ? "Reka sendiri" : "Design yours",
        item: `${SITE_URL}${pathname}`,
      });
    } else if (pathname === "/contact" || pathname === "/bidai/hubungi") {
      breadcrumbItems.push({
        "@type": "ListItem",
        position: 2,
        name: isMalay ? "Hubungi" : "Contact",
        item: `${SITE_URL}${pathname}`,
      });
    }

    if (breadcrumbItems.length > 1) {
      setJsonLd("breadcrumbs", {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems,
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
