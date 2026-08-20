import { useEffect, useState } from "react";
import { Link, useLoaderData, useLocation, useParams } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { setArticleJsonLd } from "@/components/JsonLd";
import { useT } from "@/lib/i18n";
import { getPost, formatPostDate, type BlogPost } from "@/lib/blog";

/**
 * Single blog post — fetches by slug from the URL and renders the
 * markdown body with the site's "prose-kova" type system (see
 * index.css). 404s land on a soft empty state with a link back to the
 * journal index rather than throwing.
 */
export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { pathname } = useLocation();
  const t = useT();

  // 获取当前语言环境，确保与数据库的 lang 字段匹配
  const lang = t.meta.htmlLang;

  // Back link returns to the index in the matching language.
  const blogIndex = pathname.startsWith("/bidai") ? "/bidai/jurnal" : "/blog";

  // 构建期由 route loader 抓好的文章（预渲染 HTML 直接包含正文）。
  // 构建之后才发布的新文章 loader 返回 null，下面的 useEffect 会退回客户端抓取。
  const loaderPost = (useLoaderData() ?? null) as BlogPost | null;
  const [post, setPost] = useState<BlogPost | null | "missing">(
    loaderPost && loaderPost.slug === slug ? loaderPost : null,
  );

  useEffect(() => {
    if (!slug) {
      setPost("missing");
      return;
    }

    // helmet 在路由切换时不更新 <title>（React 19 兼容问题），手动同步，
    // 否则从文章 A 跳到文章 B 时标签页还显示 A 的标题
    const syncMeta = (row: BlogPost) => {
      setArticleJsonLd(row, pathname, lang);
      if (row.title) document.title = `${row.title} | Kova Sun Shade`;
      const desc = document.head.querySelector('meta[name="description"]');
      if (desc && row.excerpt) desc.setAttribute("content", row.excerpt);
    };

    // 已有预渲染数据 → 不用再请求 Supabase
    if (loaderPost && loaderPost.slug === slug) {
      setPost(loaderPost);
      syncMeta(loaderPost);
      return;
    }

    let cancelled = false;
    setPost(null);

    // 传入 slug 和当前语言环境进行精准查询
    getPost(slug, lang).then((res) => {
      if (cancelled) return;

      // 【核心修复 1】：拦截并提取数组中的第一项数据
      const row = Array.isArray(res) ? res[0] : res;

      setPost(row ?? "missing");

      if (row) syncMeta(row);
    });

    return () => {
      cancelled = true;
    };
  }, [slug, pathname, lang, loaderPost]);

  const loading = post === null;
  const missing = post === "missing";

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* 文章加载后用文章自己的标题/摘要覆盖 SeoHead 的通用 Journal 标题，
          否则每篇文章在 Google 里都显示同一个 "KovaSunShade | Journal" */}
      {post && post !== "missing" && post.title && (
        <Head>
          <title>{`${post.title} | Kova Sun Shade`}</title>
          {post.excerpt && <meta name="description" content={post.excerpt} />}
          <meta property="og:type" content="article" />
          <meta property="og:title" content={post.title} />
          {post.excerpt && <meta property="og:description" content={post.excerpt} />}
          {post.image && <meta property="og:image" content={post.image} />}
        </Head>
      )}
      {missing && (
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
      )}
      <Nav />

      <main id="main" className="pt-28 pb-24">
        {/* 文章正文现在会在构建期预渲染进 HTML（对 SEO 很关键）。
            日期格式已改为确定性输出（blog.ts），不会再触发 418 hydration 错误 */}
        <div className="max-w-[760px] mx-auto px-5 sm:px-6 lg:px-10">
            <Link
              to={blogIndex}
              className="inline-flex items-center gap-1.5 text-[0.78rem] tracking-widest uppercase text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
            >
              <span aria-hidden>←</span>
              {t.blog.backToIndex}
            </Link>

            {loading && (
              <p className="mt-10 text-[0.92rem] text-[var(--color-muted)]">{t.blog.loading}</p>
            )}

            {missing && (
              <div className="mt-12 max-w-xl">
                <p className="font-serif text-[1.5rem] lg:text-[1.9rem] leading-snug text-[var(--color-ink)]">
                  {t.blog.notFoundTitle}
                </p>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-[var(--color-muted)]">
                  {t.blog.notFoundBody}
                </p>
              </div>
            )}

            {post && post !== "missing" && (
              <article>
                <Reveal>
                  <header className="mt-8 lg:mt-12 pb-8 lg:pb-12 border-b border-[var(--color-line)]">
                    <p className="text-[0.74rem] tracking-widest uppercase text-[var(--color-muted)]">
                      {formatPostDate(post.publishedAt)}
                      {post.author ? ` · ${post.author}` : ""}
                    </p>
                    <h1 className="mt-4 lg:mt-5 headline text-[clamp(1.9rem,1.3rem+2.5vw,3rem)] leading-[1.07] tracking-tight text-[var(--color-ink)]">
                      {post.title}
                    </h1>
                    {post.excerpt && (
                      <p className="mt-5 lg:mt-6 text-[clamp(1rem,0.9rem+0.3vw,1.15rem)] leading-relaxed text-[var(--color-ink-soft)]">
                        {post.excerpt}
                      </p>
                    )}
                  </header>
                </Reveal>

                {post.image && (
                  <Reveal delay={80}>
                    <figure className="mt-10 lg:mt-14 -mx-5 sm:mx-0">
                      <img
                        src={post.image}
                        alt={post.title ?? ""}
                        className="w-full aspect-[16/9] object-cover rounded-md border border-[var(--color-line)]"
                      />
                    </figure>
                  </Reveal>
                )}

                <div
                  className="prose-kova mt-10 lg:mt-14"
                  dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
                />
              </article>
            )}
          </div>
      </main>

      <Footer />
    </div>
  );
}