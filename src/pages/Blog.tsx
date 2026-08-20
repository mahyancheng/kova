import { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { useT } from "@/lib/i18n";
import { listPosts, formatPostDate, type BlogPostSummary } from "@/lib/blog";
import { isSupabaseConfigured } from "@/lib/supabase";

/**
 * Blog index — a card grid of published posts. Pulls from Supabase on
 * mount; falls back to a soft empty state when no posts exist or the
 * client isn't configured.
 */
export function Blog() {
  const t = useT();
  const { pathname } = useLocation();
  const lang = t.meta.htmlLang; // 假设这是你的语言标识 'en' 或 'my'
  // Keep post links on the language-matched URL prefix
  const blogBase = pathname.startsWith("/bidai") ? "/bidai/jurnal" : "/blog";
  
  // --- 数据与状态 ---
  const [posts, setPosts] = useState<BlogPostSummary[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 12; // 每页显示的数量

  // 获取 Supabase 数据
  useEffect(() => {
    let cancelled = false;
    listPosts("All", lang).then((rows) => {
      if (!cancelled) setPosts(rows);
    });
    return () => { cancelled = true; };
  }, [lang]); // <--- 依赖项加入 lang

  // --- 逻辑：提取全部分类 ---
  const categories = useMemo(() => {
    if (!posts) return [];
    // 假设标签储存在 tags 字段，如果没有则归为 "General"
    const cats = new Set(posts.map((p) => p.tags || "General"));
    return Array.from(cats).sort();
  }, [posts]);

  // --- 逻辑：按分类过滤 ---
  const filtered = useMemo(() => {
    if (!posts) return [];
    if (!selectedCategory) return posts;
    return posts.filter((p) => (p.tags || "General") === selectedCategory);
  }, [posts, selectedCategory]);

  // 切换分类时，自动回到第一页
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // --- 逻辑：分页计算 ---
  const totalPages = Math.max(1, Math.ceil(filtered.length / blogsPerPage));
  const startIndex = (currentPage - 1) * blogsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + blogsPerPage);

  const handlePrevious = () => currentPage > 1 && setCurrentPage((p) => p - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage((p) => p + 1);

  // --- 状态判断 ---
  const loading = posts === null;
  const empty = !loading && filtered.length === 0;

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <Nav />

      <main id="main" className="pt-28 pb-24">
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

          {/* 新增：分类过滤器 */}
          {!loading && categories.length > 0 && (
            <Reveal delay={100}>
              <div className="mt-10 flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-5 py-2 rounded-full text-[0.85rem] tracking-wide uppercase font-medium transition-all duration-300 ${
                    selectedCategory === null
                      ? "bg-[var(--color-ink)] text-[var(--color-cream)]"
                      : "bg-[var(--color-paper)] border border-[var(--color-line)] text-[var(--color-ink-soft)] hover:border-[var(--color-ink)]"
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 py-2 rounded-full text-[0.85rem] tracking-wide uppercase font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-[var(--color-ink)] text-[var(--color-cream)]"
                        : "bg-[var(--color-paper)] border border-[var(--color-line)] text-[var(--color-ink-soft)] hover:border-[var(--color-ink)]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </Reveal>
          )}

          <div className="mt-10 lg:mt-12 border-t border-[var(--color-line)] pt-10 lg:pt-14">
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
              <>
                <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {paginated.map((p, i) => (
                    <Reveal key={p.slug} delay={i * 80}>
                      <li>
                        <Link
                          to={`${blogBase}/${p.slug}`}
                          className="group flex flex-col h-full bg-[var(--color-paper)] border border-[var(--color-line)] rounded-md overflow-hidden hover:border-[var(--color-ink)] transition-colors relative"
                        >
                          {p.image ? (
                            <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-cream-dark)]">
                              <img
                                src={p.image}
                                alt={p.title ?? ""}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                              />
                              {/* 新增：图片左上角的分类悬浮标签 */}
                              {p.tags && (
                                <span className="absolute top-4 left-4 bg-[var(--color-paper)]/90 backdrop-blur-sm border border-[var(--color-line)] text-[var(--color-ink)] text-[0.65rem] tracking-widest uppercase font-medium px-3 py-1.5 rounded-full z-10">
                                  {p.tags}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="relative aspect-[4/3] bg-gradient-to-br from-[var(--color-cream-dark)] to-[var(--color-sand)]">
                              {p.tags && (
                                <span className="absolute top-4 left-4 bg-[var(--color-paper)] border border-[var(--color-line)] text-[var(--color-ink)] text-[0.65rem] tracking-widest uppercase font-medium px-3 py-1.5 rounded-full z-10">
                                  {p.tags}
                                </span>
                              )}
                            </div>
                          )}
                          <div className="p-5 lg:p-7 flex flex-col grow">
                            <p className="text-[0.7rem] tracking-widest uppercase text-[var(--color-muted)]">
                              {formatPostDate(p.publishedAt)}
                            </p>
                            <h2 className="mt-2.5 font-serif text-[clamp(1.2rem,0.95rem+0.8vw,1.5rem)] leading-tight tracking-tight text-[var(--color-ink)]">
                              {p.title}
                            </h2>
                            {p.excerpt && (
                              <p className="mt-2.5 text-[0.92rem] leading-relaxed text-[var(--color-muted)] line-clamp-3">
                                {p.excerpt}
                              </p>
                            )}
                            <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-[0.86rem] font-medium text-[var(--color-ink)] group-hover:text-[var(--color-clay-deep)] transition-colors">
                              {t.blog.readMore}
                              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                            </span>
                          </div>
                        </Link>
                      </li>
                    </Reveal>
                  ))}
                </ul>

                {/* 新增：底部分页器 */}
                {totalPages > 1 && (
                  <div className="mt-16 flex justify-center">
                    <nav className="inline-flex items-center space-x-1.5 bg-[var(--color-paper)] border border-[var(--color-line)] rounded-full px-3 py-2">
                      <button
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                          currentPage === 1
                            ? "text-[var(--color-muted)] opacity-50 cursor-not-allowed"
                            : "text-[var(--color-ink)] hover:bg-[var(--color-cream-dark)]"
                        }`}
                      >
                        ‹
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                            page === currentPage
                              ? "bg-[var(--color-ink)] text-[var(--color-cream)]"
                              : "text-[var(--color-ink-soft)] hover:bg-[var(--color-cream-dark)]"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                          currentPage === totalPages
                            ? "text-[var(--color-muted)] opacity-50 cursor-not-allowed"
                            : "text-[var(--color-ink)] hover:bg-[var(--color-cream-dark)]"
                        }`}
                      >
                        ›
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}