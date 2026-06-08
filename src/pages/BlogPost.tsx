import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { setArticleJsonLd } from "@/components/JsonLd";
import { useT } from "@/lib/i18n";
import { getPost, formatPostDate, type Post } from "@/lib/blog";

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
  // Back link returns to the index in the matching language.
  const blogIndex = pathname.startsWith("/bidai") ? "/bidai/jurnal" : "/blog";
  const [post, setPost] = useState<Post | null | "missing">(null);

  useEffect(() => {
    if (!slug) {
      setPost("missing");
      return;
    }
    let cancelled = false;
    setPost(null);
    getPost(slug).then((row) => {
      if (cancelled) return;
      setPost(row ?? "missing");
      if (row) setArticleJsonLd(row, pathname, t.meta.htmlLang);
    });
    return () => {
      cancelled = true;
    };
  }, [slug, pathname, t.meta.htmlLang]);

  const loading = post === null;
  const missing = post === "missing";

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <Nav />

      <main id="main" className="pt-28 pb-24">
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
                    {formatPostDate(post.published_at)}
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

              {post.cover_image_url && (
                <Reveal delay={80}>
                  <figure className="mt-10 lg:mt-14 -mx-5 sm:mx-0">
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="w-full aspect-[16/9] object-cover rounded-md border border-[var(--color-line)]"
                    />
                  </figure>
                </Reveal>
              )}

              <Reveal delay={120}>
                <div className="prose-kova mt-10 lg:mt-14">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body_md}</ReactMarkdown>
                </div>
              </Reveal>
            </article>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
