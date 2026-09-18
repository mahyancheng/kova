import { useLocation } from "react-router-dom";
import { Head } from "vite-react-ssg";
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
 *  - BreadcrumbList on product/process/configurator/contact/blog pages
 *
 * IMPORTANT: this renders through vite-react-ssg's <Head> (a Helmet
 * wrapper), not via useEffect + document.head.appendChild the way this
 * component used to work. The old imperative version only ever ran in the
 * browser after hydration — during SSG prerendering there is no `document`,
 * so none of these <script> tags existed in the actual HTML the server
 * sent out. Any crawler or tool that reads the raw response (rather than
 * executing JS and waiting for React to mount) saw zero of this: no
 * Organization, no LocalBusiness, no Product, no BreadcrumbList — only
 * whatever SeoHead.tsx separately rendered through <Head> already, which
 * is how that one WebPage block survived while everything here silently
 * didn't. <Head> renders synchronously as JSX, so it's part of the
 * server-rendered output like everything else on the page.
 *
 * Article schema for blog posts is NOT emitted here — it needs the actual
 * post content (title/excerpt/date/author), which isn't available
 * synchronously from just the route; BlogPost.tsx renders it directly
 * alongside its own <Head> block, from the same loader/fetch data it
 * already uses for the <title> tag.
 */
const SITE_URL = "https://kovasunshade.com";
const LOGO_URL = `${SITE_URL}/favicon.svg`;
const SAME_AS: string[] = []; // Add socials when they exist.

export function JsonLd() {
  const t = useT();
  const { pathname: rawPathname } = useLocation();
  // 与 SeoHead 一致：去掉尾部斜杠再做路由匹配（线上主机会 301 到带斜杠的 URL）
  const pathname = rawPathname.length > 1 ? rawPathname.replace(/\/+$/, "") : rawPathname;
  const lang = t.meta.htmlLang;
  const isMalay = lang === "ms";

  // --- Always present: Organization / LocalBusiness + WebSite ---------
  const business = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: "Kova Sun Shade",
    alternateName: isMalay ? "Kova — Bidai dan Langsir Tingkap" : undefined,
    description: t.seo?.description || "Premium Window Blinds and Shades",
    url: SITE_URL,
    email: "info@kovasunshade.com",
    telephone: "+60179778289",
    logo: LOGO_URL,
    image: `${SITE_URL}/showcase/greige-roller.webp`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "No 3, Jalan Tpk 1/6, Taman Perindustrian Kinrara",
      addressLocality: "Puchong",
      postalCode: "47180",
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
      price: "0.00",
      url: `${SITE_URL}${isMalay ? "/bidai/hubungi" : "/contact"}`,
    },
  };

  // --- Per-product schema (dedicated product pages) --------------------
  const productMatch = pathname.match(/^(?:\/bidai)?\/(roller|venetian|vertisheer)$/);
  let product: Record<string, unknown> | null = null;
  if (productMatch) {
    const key = productMatch[1] as "roller" | "venetian" | "vertisheer";
    const meta = {
      roller: {
        name: isMalay ? "Bidai Roller" : "Roller Blinds",
        category: "Window Blinds",
        description: t.products.roller.body[0],
        image: `${SITE_URL}/showcase/greige-roller.webp`,
      },
      venetian: {
        name: isMalay ? "Bidai Venetian" : "Venetian Blinds",
        category: "Window Blinds",
        description: t.products.venetian.body[0],
        image: `${SITE_URL}/showcase/white-venetian.webp`,
      },
      vertisheer: {
        name: "VertiSheer",
        category: "Vertical Sheer Blinds",
        description: t.products?.vertisheer?.body?.[0] || "Modern vertical sheer blinds.",
        image: `${SITE_URL}/showcase/pivot-silver-vertisheer.webp`,
      },
    }[key];
    product = {
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
        price: "0.00",
        url: `${SITE_URL}${isMalay ? "/bidai/hubungi" : "/contact"}`,
        seller: { "@id": `${SITE_URL}/#business` },
      },
    };
  }

  // --- HowTo (process page) --------------------------------------------
  const onProcess = pathname === "/process" || pathname === "/bidai/proses";
  const howto = onProcess
    ? {
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
      }
    : null;

  // --- Breadcrumbs (every brochure + blog page) -------------------------
  const homeUrl = isMalay ? `${SITE_URL}/bidai` : `${SITE_URL}/`;
  const blogUrl = isMalay ? `${SITE_URL}/bidai/jurnal` : `${SITE_URL}/blog`;
  const onBlogIndex = pathname === "/blog" || pathname === "/bidai/jurnal";
  const onBlogPost = pathname.startsWith("/blog/") || pathname.startsWith("/bidai/jurnal/");

  const breadcrumbItems: Array<{ "@type": string; position: number; name: string; item: string }> = [
    { "@type": "ListItem", position: 1, name: "Home", item: homeUrl },
  ];

  if (onBlogIndex || onBlogPost) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 2,
      name: t.nav.journal,
      item: blogUrl,
    });
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
      name:
        productMatch[1] === "roller" ? (isMalay ? "Bidai Roller" : "Roller Blinds")
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

  const breadcrumbs =
    breadcrumbItems.length > 1
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbItems,
        }
      : null;

  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(business)}</script>
      <script type="application/ld+json">{JSON.stringify(website)}</script>
      <script type="application/ld+json">{JSON.stringify(service)}</script>
      {product && <script type="application/ld+json">{JSON.stringify(product)}</script>}
      {howto && <script type="application/ld+json">{JSON.stringify(howto)}</script>}
      {breadcrumbs && <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>}
    </Head>
  );
}

/**
 * Article schema for a single blog post — built from the post's real
 * content (title/excerpt/date/author), unlike everything above which only
 * needs the route. Called directly from BlogPost.tsx's own render (see
 * that file), not from JsonLd, so it's available synchronously wherever
 * the post data already is (loader data during SSR, or the client fetch
 * fallback for posts published after the last build).
 */
export function buildArticleJsonLd(
  post: {
    title?: string;
    excerpt?: string;
    content?: string;
    image?: string;
    author?: string;
    publishedAt?: string;
    slug?: string;
  },
  pathname: string,
  lang: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? post.title,
    image: post.image ? [post.image] : undefined,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    inLanguage: lang === "ms" ? "ms-MY" : "en-MY",
    author: { "@type": "Organization", name: post.author ?? "Kova Sun Shade" },
    publisher: { "@id": `${SITE_URL}/#business` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}${pathname}`,
    },
  };
}
