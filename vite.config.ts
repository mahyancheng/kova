import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import fs from "node:fs";
import { en, type Dict } from "./src/lib/i18n/en";
import { ms } from "./src/lib/i18n/ms";

// Absolute base for the canonical / hreflang URLs baked into the
// prerendered pages.
const SITE_ORIGIN = "https://kovasunshade.com";

/**
 * The static brochure routes, each paired EN ↔ BM. `key` selects the
 * per-page SEO block from the i18n dictionaries — the SAME source the
 * runtime <SeoHead> reads, so a prerendered <title> never drifts from
 * the hydrated one.
 */
const PAGES: { en: string; ms: string; key: keyof Dict["seo"]["pages"] }[] = [
  { en: "/", ms: "/bidai", key: "home" },
  { en: "/roller", ms: "/bidai/roller", key: "roller" },
  { en: "/venetian", ms: "/bidai/venetian", key: "venetian" },
  { en: "/vertisheer", ms: "/bidai/vertisheer", key: "vertisheer" },
  { en: "/process", ms: "/bidai/proses", key: "process" },
  { en: "/configurator", ms: "/bidai/reka", key: "configurator" },
  { en: "/contact", ms: "/bidai/hubungi", key: "contact" },
  { en: "/blog", ms: "/bidai/jurnal", key: "blog" },
];

const escAttr = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
const escText = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Rewrite the shared <head> of `tpl` for one concrete route. */
function renderRoute(
  tpl: string,
  route: {
    path: string;
    lang: "en" | "ms";
    key: keyof Dict["seo"]["pages"];
    enHref: string;
    msHref: string;
  },
): string {
  const d: Dict = route.lang === "ms" ? ms : (en as unknown as Dict);
  const page = d.seo.pages[route.key];
  const title = page.title;
  const description = page.description;
  const keywords = page.keywords ?? d.seo.keywords;
  const canonical = SITE_ORIGIN + route.path;
  const ogLocale = route.lang === "ms" ? "ms_MY" : "en_MY";

  // Each entry replaces exactly the one head tag the static shell already
  // ships; [^>]* keeps the match tolerant of attribute order / spacing.
  const swaps: [RegExp, string][] = [
    [/<html lang="[^"]*">/, `<html lang="${route.lang}">`],
    [/<title>[\s\S]*?<\/title>/, `<title>${escText(title)}</title>`],
    [
      /<meta name="description"[^>]*>/,
      `<meta name="description" content="${escAttr(description)}" />`,
    ],
    [
      /<meta name="keywords"[^>]*>/,
      `<meta name="keywords" content="${escAttr(keywords)}" />`,
    ],
    [/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${canonical}" />`],
    [
      /<link rel="alternate" hreflang="en"[^>]*>/,
      `<link rel="alternate" hreflang="en" href="${route.enHref}" />`,
    ],
    [
      /<link rel="alternate" hreflang="ms"[^>]*>/,
      `<link rel="alternate" hreflang="ms" href="${route.msHref}" />`,
    ],
    [
      /<link rel="alternate" hreflang="x-default"[^>]*>/,
      `<link rel="alternate" hreflang="x-default" href="${route.enHref}" />`,
    ],
    [
      /<meta property="og:locale"[^>]*>/,
      `<meta property="og:locale" content="${ogLocale}" />`,
    ],
    [
      /<meta property="og:title"[^>]*>/,
      `<meta property="og:title" content="${escAttr(title)}" />`,
    ],
    [
      /<meta property="og:description"[^>]*>/,
      `<meta property="og:description" content="${escAttr(description)}" />`,
    ],
    [
      /<meta name="twitter:title"[^>]*>/,
      `<meta name="twitter:title" content="${escAttr(title)}" />`,
    ],
    [
      /<meta name="twitter:description"[^>]*>/,
      `<meta name="twitter:description" content="${escAttr(description)}" />`,
    ],
  ];

  let html = tpl;
  for (const [re, replacement] of swaps) {
    // Function replacer so `$` in a value is never treated as a group ref.
    html = html.replace(re, () => replacement);
  }

  // The audit reads first-byte HTML, while React replaces #root at startup.
  // Seed one route-specific H1 into the static shell; createRoot removes it
  // before rendering the page's matching runtime H1, so neither view has zero
  // or duplicate primary headings.
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root"><h1 class="sr-only" data-static-seo="h1">${escText(title)}</h1></div>`,
  );
  return html;
}

/**
 * Prerender a static index.html per brochure route.
 *
 * The site is a client-rendered SPA, so on the wire every URL is served
 * the same shell — a crawler that doesn't run JS sees one <title> for the
 * whole site (the "missing/duplicate title" an audit flags). Emitting a
 * real dist/<route>/index.html with the route's own <title> + meta baked
 * in fixes that at the source: the .htaccess serves the physical file
 * (its RewriteCond -d short-circuits the SPA fallback), and <SeoHead>
 * still refines everything after hydration.
 */
function prerenderStaticHead(): Plugin {
  let outDir = "dist";
  return {
    name: "kova-prerender-static-head",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const templatePath = path.join(outDir, "index.html");
      if (!fs.existsSync(templatePath)) return;
      const template = fs.readFileSync(templatePath, "utf8");

      for (const p of PAGES) {
        const enHref = SITE_ORIGIN + p.en;
        const msHref = SITE_ORIGIN + p.ms;
        const routes = [
          { path: p.en, lang: "en" as const, key: p.key, enHref, msHref },
          { path: p.ms, lang: "ms" as const, key: p.key, enHref, msHref },
        ];
        for (const route of routes) {
          const out =
            route.path === "/"
              ? path.join(outDir, "index.html")
              : path.join(outDir, route.path, "index.html");
          fs.mkdirSync(path.dirname(out), { recursive: true });
          fs.writeFileSync(out, renderRoute(template, route));
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), prerenderStaticHead()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
