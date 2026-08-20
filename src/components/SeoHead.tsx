// src/components/SeoHead.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
// ⚠️ 必须用 vite-react-ssg 自带的 <Head>，不能直接用 react-helmet-async 的 Helmet。
// SSG 构建时收集 head 标签用的是它自己内部的 helmet 实例；
// 直接 import react-helmet-async 会连到另一个实例，标签会被渲染进 <body> 而不是 <head>。
import { Head } from "vite-react-ssg";
import { useT } from "@/lib/i18n";

/** Map a pathname to a logical page key for SEO lookup. */
function pathnameToPageKey(pathname: string): keyof typeof PAGE_KEY_FALLBACK {
  const m: Record<string, keyof typeof PAGE_KEY_FALLBACK> = {
    "/": "home",
    "/bidai": "home",
    "/roller": "roller",
    "/bidai/roller": "roller",
    "/venetian": "venetian",
    "/bidai/venetian": "venetian",
    "/vertisheer": "vertisheer",
    "/bidai/vertisheer": "vertisheer",
    "/process": "process",
    "/bidai/proses": "process",
    "/configurator": "configurator",
    "/bidai/reka": "configurator",
    "/contact": "contact",
    "/bidai/hubungi": "contact",
    "/blog": "blog",
    "/bidai/jurnal": "blog",
  };
  if (m[pathname]) return m[pathname];
  if (pathname.startsWith("/blog/") || pathname.startsWith("/bidai/jurnal/")) return "blog";
  return "home";
}

const PAGE_KEY_FALLBACK = {
  home: 1,
  roller: 1,
  venetian: 1,
  vertisheer: 1,
  process: 1,
  configurator: 1,
  contact: 1,
  blog: 1,
} as const;

export function SeoHead() {
  const t = useT();
  const { pathname: rawPathname } = useLocation();
  // 线上主机会把 /roller 301 到 /roller/（尾部斜杠）。必须先把斜杠去掉再查表，
  // 否则 "/roller/" 匹配不到任何页面 → 整页 SEO 会错误地退回首页的标题和描述
  const pathname = rawPathname.length > 1 ? rawPathname.replace(/\/+$/, "") : rawPathname;

  const pageKey = pathnameToPageKey(pathname);
  const pageSeo = t.seo.pages[pageKey];
  const title = pageSeo.title;
  const description = pageSeo.description;
  const keywords = pageSeo.keywords ?? t.seo.keywords;

  // --- 🌟 新增：动态首屏图片预加载映射 (Issue 3 修复) ---
  // 根据不同的页面，预加载不同的核心大图 (LCP)，提升首屏加载分数
  const PRELOAD_IMAGES: Partial<Record<keyof typeof PAGE_KEY_FALLBACK, string>> = {
    home: "/showcase/hero-living.webp",
    roller: "/showcase/greige-roller.webp",
    // 如果你有其他页面的首屏大图，强烈建议在这里补齐，例如：
    // venetian: "/showcase/venetian-hero.webp",
    // vertisheer: "/showcase/vertisheer-hero.webp",
  };
  const heroImageToPreload = PRELOAD_IMAGES[pageKey];

  // ⚠️ 在 SSG 渲染期间 (Node.js)，window 对象不存在，所以必须使用硬编码的正式域名
  const SITE_ORIGIN = "https://kovasunshade.com";

  // --- Canonical + hreflang 路径逻辑 ---
  const PAIRS: Record<string, string> = {
    "/": "/bidai",
    "/roller": "/bidai/roller",
    "/venetian": "/bidai/venetian",
    "/vertisheer": "/bidai/vertisheer",
    "/process": "/bidai/proses",
    "/configurator": "/bidai/reka",
    "/contact": "/bidai/hubungi",
    "/blog": "/bidai/jurnal",
  };
  const EN_FROM_BM: Record<string, string> = Object.fromEntries(
    Object.entries(PAIRS).map(([en, ms]) => [ms, en])
  );

  let enPath = "/";
  let msPath = "/bidai";
  let canonicalPath = pathname;

  if (PAIRS[pathname]) {
    enPath = pathname;
    msPath = PAIRS[pathname];
  } else if (EN_FROM_BM[pathname]) {
    enPath = EN_FROM_BM[pathname];
    msPath = pathname;
  } else if (pathname.startsWith("/blog/")) {
    const slug = pathname.slice("/blog/".length);
    enPath = `/blog/${slug}`;
    msPath = `/bidai/jurnal/${slug}`;
  } else if (pathname.startsWith("/bidai/jurnal/")) {
    const slug = pathname.slice("/bidai/jurnal/".length);
    enPath = `/blog/${slug}`;
    msPath = `/bidai/jurnal/${slug}`;
  }

  const enHref = `${SITE_ORIGIN}${enPath}`;
  const msHref = `${SITE_ORIGIN}${msPath}`;
  const canonicalHref = `${SITE_ORIGIN}${canonicalPath}`;

  // 社交分享图必须是本站自己的绝对 URL（之前指向 gpt-engineer 的临时存储）
  const ogImage = `${SITE_ORIGIN}/showcase/hero-living.webp`;
  const htmlLang = t.meta.htmlLang;

  // --- JSON-LD Schema ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": canonicalHref,
    "publisher": { 
      "@type": "Organization", 
      "name": "Kova Sun Shade" 
    }
  };

  // vite-react-ssg 自带的 helmet (v1) 在 React 19 下切换路由时不会更新 <title>/<meta>/<link>
  // （htmlAttributes 会更新，标签不会），所以 SPA 内部跳转时手动把关键标签同步到 DOM。
  // 构建出来的静态 HTML 已经是对的，这段只影响浏览器内的页面切换。
  useEffect(() => {
    document.title = title;
    const setMeta = (selector: string, content: string) => {
      const el = document.head.querySelector<HTMLMetaElement>(selector);
      if (el) el.setAttribute("content", content);
    };
    const setLink = (selector: string, href: string) => {
      const el = document.head.querySelector<HTMLLinkElement>(selector);
      if (el) el.setAttribute("href", href);
    };
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:url"]', canonicalHref);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
    setLink('link[rel="canonical"]', canonicalHref);
    setLink('link[rel="alternate"][hreflang="en"]', enHref);
    setLink('link[rel="alternate"][hreflang="ms"]', msHref);
    setLink('link[rel="alternate"][hreflang="x-default"]', enHref);
  }, [title, description, canonicalHref, enHref, msHref]);

  return (
    // htmlAttributes 让每个页面输出正确的 <html lang="en|ms">（对 hreflang / 搜索引擎语言识别很重要）
    <Head htmlAttributes={{ lang: htmlLang }}>
      {/* 1. Standard Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* 🌟 新增：动态注入当前页面所需的首屏图片 */}
      {heroImageToPreload && (
        <link 
          rel="preload" 
          as="image" 
          href={heroImageToPreload} 
          type="image/webp" 
        />
      )}

      {/* 2. Open Graph / Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalHref} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Kova Sun Shade" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={htmlLang === "ms" ? "ms_MY" : "en_MY"} />

      {/* 3. Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* 4. Canonical + Hreflang */}
      <link rel="canonical" href={canonicalHref} />
      <link rel="alternate" href={enHref} hrefLang="en" />
      <link rel="alternate" href={msHref} hrefLang="ms" />
      <link rel="alternate" href={enHref} hrefLang="x-default" />

      {/* 5. Dynamic JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Head>
  );
}
