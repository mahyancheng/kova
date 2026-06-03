import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { useT } from "@/lib/i18n";
import { listPosts, formatPostDate, type PostSummary } from "@/lib/blog";
import { isSupabaseConfigured } from "@/lib/supabase";

/**
 * Blog index — a card grid of published posts. Pulls from Supabase on
 * mount; falls back to a soft empty state when no posts exist or the
 * client isn't configured (e.g. before env vars are set in Lovable).
 */
export function Blog() {
  const t = useT();
  const [posts, setPosts] = useState<PostSummary[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    listPosts().then((rows) => {
      if (!cancelled) setPosts(rows);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const loading = posts === null;
  const empty = !loading && posts.length === 0;

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <Nav />

      <main className="pt-28 pb-24">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-6 lg:px-10">
          <Reveal>
            <p className="eyebrow">{t.blog.eyebrow}</p>
            <h1 className="mt-3 lg:mt-4 headline text-[clamp(2rem,1.4rem+3vw,3.5rem)] leading-[1.05] text-[var(--color-ink)] max-w-3xl">
              {t.blog.titleA}
              <span className="italic font-light text-[var(--color-clay-deep)]"> {t.blog.titleB}</span>
            </h1>
            <p className="mt-5 lg:mt-6 max-w-xl text-[clamp(0.95rem,0.88rem+0.3vw,1.08rem)] leading-relaxed text-[var(--color-ink-soft)]">
              {t.blog.intro}
            </p>
          </Reveal>

          <div className="mt-12 lg:mt-16 border-t border-[var(--color-line)] pt-10 lg:pt-14">
            {loading && (
              <p className="text-[0.92rem] text-[var(--color-muted)]">{t.blog.loading}</p>
            )}

            {empty && (
              <div className="max-w-xl">
                <p className="font-serif text-[1.3rem] lg:text-[1.5rem] leading-snug text-[var(--color-ink)]">
                  {t.blog.emptyTitle}
                </p>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-[var(--color-muted)]">
                  {isSupabaseConfigured ? t.blog.emptyBody : t.blog.emptyUnconfigured}
                </p>
              </div>
            )}

            {!loading && !empty && (
              <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {posts!.map((p, i) => (
                  <Reveal key={p.slug} delay={i * 80}>
                    <li>
                      <Link
                        to={`/blog/${p.slug}`}
                        className="group flex flex-col h-full bg-[var(--color-paper)] border border-[var(--color-line)] rounded-md overflow-hidden hover:border-[var(--color-ink)] transition-colors"
                      >
                        {p.cover_image_url ? (
                          <div className="aspect-[4/3] overflow-hidden bg-[var(--color-cream-dark)]">
                            <img
                              src={p.cover_image_url}
                              alt={p.title}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                            />
                          </div>
                        ) : (
                          <div className="aspect-[4/3] bg-gradient-to-br from-[var(--color-cream-dark)] to-[var(--color-sand)]" />
                        )}
                        <div className="p-5 lg:p-7 flex flex-col grow">
                          <p className="text-[0.7rem] tracking-widest uppercase text-[var(--color-muted)]">
                            {formatPostDate(p.published_at)}
                          </p>
                          <h2 className="mt-2.5 font-serif text-[clamp(1.2rem,0.95rem+0.8vw,1.5rem)] leading-tight tracking-tight text-[var(--color-ink)]">
                            {p.title}
                          </h2>
                          {p.excerpt && (
                            <p className="mt-2.5 text-[0.92rem] leading-relaxed text-[var(--color-muted)] line-clamp-3">
                              {p.excerpt}
                            </p>
                          )}
                          <span className="mt-5 inline-flex items-center gap-1.5 text-[0.86rem] font-medium text-[var(--color-ink)] group-hover:text-[var(--color-clay-deep)] transition-colors">
                            {t.blog.readMore}
                            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                          </span>
                        </div>
                      </Link>
                    </li>
                  </Reveal>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
