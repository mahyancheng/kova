// scripts/generate-sitemap.mjs
// 构建前运行：从 Supabase 抓取所有博客文章，生成完整的 public/sitemap.xml
// （静态页面 + 每篇文章的 en/ms hreflang 对）。
// Supabase 不可用时保留现有 sitemap，不让构建失败。
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://kovasunshade.com";

// --- 读取 .env / .env.local（简单解析，不引入 dotenv 依赖） ---
function loadEnv() {
  const env = {};
  for (const file of [".env", ".env.local"]) {
    const p = resolve(root, file);
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
  return env;
}

// --- 静态页面（en 路径 → ms 路径 的对应表，与 SeoHead.tsx 保持一致） ---
const STATIC_PAGES = [
  { en: "/", ms: "/bidai", changefreq: "weekly", priority: "1.0" },
  { en: "/roller", ms: "/bidai/roller", changefreq: "monthly", priority: "0.9" },
  { en: "/venetian", ms: "/bidai/venetian", changefreq: "monthly", priority: "0.9" },
  { en: "/vertisheer", ms: "/bidai/vertisheer", changefreq: "monthly", priority: "0.9" },
  { en: "/process", ms: "/bidai/proses", changefreq: "monthly", priority: "0.7" },
  { en: "/configurator", ms: "/bidai/reka", changefreq: "monthly", priority: "0.8" },
  { en: "/contact", ms: "/bidai/hubungi", changefreq: "monthly", priority: "0.8" },
  { en: "/blog", ms: "/bidai/jurnal", changefreq: "weekly", priority: "0.6" },
];

function urlEntry({ loc, en, ms, xDefault, changefreq, priority, lastmod }) {
  const lines = [`  <url>`, `    <loc>${SITE}${loc}</loc>`];
  if (en) lines.push(`    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${en}"/>`);
  if (ms) lines.push(`    <xhtml:link rel="alternate" hreflang="ms" href="${SITE}${ms}"/>`);
  if (xDefault) lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${xDefault}"/>`);
  if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
  if (changefreq) lines.push(`    <changefreq>${changefreq}</changefreq>`);
  if (priority) lines.push(`    <priority>${priority}</priority>`);
  lines.push(`  </url>`);
  return lines.join("\n");
}

async function fetchPosts(env) {
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY || env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn("[sitemap] 找不到 Supabase 环境变量，跳过文章部分");
    return null;
  }
  const endpoint = `${url}/rest/v1/KovaTable?select=slug,lang,publishedAt,updatedAt&slug=not.is.null`;
  const res = await fetch(endpoint, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) {
    console.warn(`[sitemap] Supabase 请求失败 (${res.status})，跳过文章部分`);
    return null;
  }
  return await res.json();
}

function isoDate(row) {
  const raw = row.updatedAt || row.publishedAt;
  if (!raw) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

async function main() {
  const env = loadEnv();

  const entries = STATIC_PAGES.flatMap((p) => [
    urlEntry({ loc: p.en, en: p.en, ms: p.ms, xDefault: p.en, changefreq: p.changefreq, priority: p.priority }),
    urlEntry({ loc: p.ms, en: p.en, ms: p.ms, xDefault: p.en, changefreq: p.changefreq, priority: p.priority }),
  ]);

  let posts = null;
  try {
    posts = await fetchPosts(env);
  } catch (e) {
    console.warn("[sitemap] 抓取文章出错，跳过文章部分:", e.message);
  }

  if (posts) {
    // 按 slug 分组，找出每个 slug 有哪些语言版本
    const bySlug = new Map();
    for (const row of posts) {
      if (!row.slug) continue;
      if (!bySlug.has(row.slug)) bySlug.set(row.slug, {});
      bySlug.get(row.slug)[row.lang || "en"] = row;
    }
    for (const [slug, langs] of bySlug) {
      const enPath = langs.en ? `/blog/${slug}` : null;
      const msPath = langs.ms ? `/bidai/jurnal/${slug}` : null;
      if (enPath) {
        entries.push(urlEntry({
          loc: enPath, en: enPath, ms: msPath, xDefault: enPath,
          changefreq: "monthly", priority: "0.6", lastmod: isoDate(langs.en),
        }));
      }
      if (msPath) {
        entries.push(urlEntry({
          loc: msPath, en: enPath, ms: msPath, xDefault: enPath ?? msPath,
          changefreq: "monthly", priority: "0.6", lastmod: isoDate(langs.ms),
        }));
      }
    }
    console.log(`[sitemap] 已加入 ${bySlug.size} 篇文章 (${posts.length} 个语言版本)`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">

${entries.join("\n\n")}

</urlset>
`;

  writeFileSync(resolve(root, "public/sitemap.xml"), xml);
  console.log(`[sitemap] public/sitemap.xml 已生成 (${entries.length} 个 URL)`);
}

main().catch((e) => {
  console.warn("[sitemap] 生成失败，保留现有 sitemap:", e.message);
});
