// scripts/generate-sitemap.mjs
// 构建前运行：从 Supabase 抓取所有博客文章，生成完整的 public/sitemap.xml
// （静态页面 + 每篇文章的 en/ms hreflang 对），同时在 public/.htaccess 里
// 更新一段"跨语言 slug 守卫"（见下面 buildSlugGuardBlock 的说明）。
// Supabase 不可用时保留现有文件，不让构建失败。
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

const GUARD_BEGIN = "# === BEGIN AUTO-GENERATED: cross-language blog slug guard ===";
const GUARD_END = "# === END AUTO-GENERATED: cross-language blog slug guard ===";

/**
 * Blog slugs only ever exist in ONE language (5 English posts, 3 Malay,
 * completely disjoint slugs — see blogTranslationPairs.ts). .htaccess's
 * SPA fallback has to allow ANY single-segment /blog/<slug> or
 * /bidai/jurnal/<slug> through with a 200, so a post published to
 * Supabase after the last build still loads (BlogPost.tsx fetches it
 * client-side) — Apache has no way to check Supabase itself to tell
 * "not built yet" from "will never exist in this language".
 *
 * That leaves one gap the general fix can't close: an English slug
 * requested under /bidai/jurnal/, or a Malay slug requested under
 * /blog/, still 200s with the homepage shell instead of 404ing, because
 * it's shaped exactly like a valid future post. This block explicitly
 * denies exactly the slugs known (from Supabase, right now) to belong to
 * the OTHER language, so those specific URLs get a real 404 instead.
 * Regenerated on every build, so it grows/shrinks with the actual posts
 * — no manual upkeep, and it never touches genuinely unbuilt slugs in
 * their own correct language.
 */
function buildSlugGuardBlock(posts) {
  if (!posts || posts.length === 0) return null;
  const enOnly = new Set();
  const msOnly = new Set();
  const seenEn = new Set();
  const seenMs = new Set();
  for (const row of posts) {
    if (!row.slug) continue;
    (row.lang === "ms" ? seenMs : seenEn).add(row.slug);
  }
  for (const slug of seenEn) if (!seenMs.has(slug)) enOnly.add(slug);
  for (const slug of seenMs) if (!seenEn.has(slug)) msOnly.add(slug);

  if (enOnly.size === 0 && msOnly.size === 0) return null;

  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const lines = [GUARD_BEGIN];
  if (enOnly.size > 0) {
    lines.push(
      `  RewriteRule ^bidai/jurnal/(${[...enOnly].map(esc).join("|")})/?$ /__no-such-post__ [L]`,
    );
  }
  if (msOnly.size > 0) {
    lines.push(
      `  RewriteRule ^blog/(${[...msOnly].map(esc).join("|")})/?$ /__no-such-post__ [L]`,
    );
  }
  lines.push(GUARD_END);
  return lines.join("\n");
}

/** Splice the guard block into .htaccess, replacing a previous run's block if present. */
function writeSlugGuard(root, block) {
  const path = resolve(root, "public/.htaccess");
  if (!existsSync(path)) {
    console.warn("[sitemap] 找不到 public/.htaccess，跳过跨语言 slug 守卫");
    return;
  }
  let content = readFileSync(path, "utf8");
  const beginIdx = content.indexOf(GUARD_BEGIN);
  const endIdx = content.indexOf(GUARD_END);
  const hasExisting = beginIdx !== -1 && endIdx !== -1 && endIdx > beginIdx;

  if (!block) {
    // 没有需要拦的 slug（比如 Supabase 抓取失败）——保留原样，绝不清空
    // 已有的守卫规则，也绝不在没数据时插入一段空的规则块。
    if (hasExisting) console.warn("[sitemap] 本次未取得文章数据，保留 .htaccess 现有的 slug 守卫不变");
    return;
  }

  if (hasExisting) {
    content = content.slice(0, beginIdx) + block + content.slice(endIdx + GUARD_END.length);
  } else {
    // 第一次生成：插到 SPA fallback 那段规则前面，同一个 <IfModule mod_rewrite.c> 区块内。
    const marker = "  # --- SPA fallback, but ONLY for paths that are real app routes -------";
    if (content.includes(marker)) {
      content = content.replace(marker, `  ${block.split("\n").join("\n  ")}\n\n${marker}`);
    } else {
      console.warn("[sitemap] .htaccess 里找不到预期的插入点，追加到 mod_rewrite 区块末尾");
      content = content.replace("</IfModule>", `  ${block.split("\n").join("\n  ")}\n</IfModule>`);
    }
  }
  writeFileSync(path, content);
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
  } else {
    // 抓不到文章就沿用现有的文章 URL，别让这次构建把它们从 sitemap 里删掉。
    const kept = existingPostEntries();
    if (kept.length) entries.push(...kept);
    console.warn(
      `[sitemap] Supabase 不可用，保留现有 ${kept.length} 个文章 URL`,
    );
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

  const guardBlock = buildSlugGuardBlock(posts);
  writeSlugGuard(root, guardBlock);
  if (guardBlock) {
    const ruleCount = guardBlock.split("\n").filter((l) => l.includes("RewriteRule")).length;
    console.log(`[sitemap] .htaccess 跨语言 slug 守卫已更新 (${ruleCount} 条规则)`);
  }
}

main().catch((e) => {
  console.warn("[sitemap] 生成失败，保留现有 sitemap:", e.message);
});
