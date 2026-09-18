// src/components/LanguageToggle.tsx
import { useLang, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ 引入 useLocation
import { blogTranslationPairs, blogTranslationPairsReverse } from "@/lib/blogTranslationPairs";

export function LanguageToggle({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { lang } = useLang(); 
  const t = useT();
  const isDark = tone === "dark";
  const navigate = useNavigate();
  const { pathname } = useLocation(); // ✅ 获取当前路径

  const handleToggle = (code: 'en' | 'ms') => {
    // 如果已经在当前语言，就不做任何操作
    if (lang === code) return;

    // 跟 SeoHead/JsonLd 保持一致：先去掉尾部斜杠再比对，否则 "/blog/x/"
    // 这种带斜杠的网址会让下面所有 path === 'xxx' 判断和 slug 截取
    // 全部失效，退回一个错误的兜底网址。
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
    let newPath = '/';

    if (code === 'ms') {
      // 🔵 英文 (EN) 切换到 马来文 (BM)
      if (path === '/') newPath = '/bidai';
      else if (path === '/roller') newPath = '/bidai/roller';
      else if (path === '/venetian') newPath = '/bidai/venetian';
      else if (path === '/vertisheer') newPath = '/bidai/vertisheer';
      else if (path === '/process') newPath = '/bidai/proses';
      else if (path === '/configurator') newPath = '/bidai/reka';
      else if (path === '/contact') newPath = '/bidai/hubungi';
      else if (path === '/blog') newPath = '/bidai/jurnal';
      // 处理带 slug 的动态文章路由：英文和马来文文章是各自独立编号的，
      // 不是同一个 slug 换个语言前缀就对应得上（5 篇英文只有 3 篇有马来文
      // 对照版本）。直接替换前缀会跳到一个根本不存在的文章网址，显示
      // "找不到这篇文章"。改成查真正的翻译对照表，没有对照版本就退回
      // Journal 首页，而不是一个坏掉的文章链接。
      else if (path.startsWith('/blog/')) {
        const slug = path.slice('/blog/'.length);
        const msSlug = blogTranslationPairs[slug];
        newPath = msSlug ? `/bidai/jurnal/${msSlug}` : '/bidai/jurnal';
      }
      else newPath = '/bidai'; // 兜底
    } else {
      // 🔵 马来文 (BM) 切换到 英文 (EN)
      if (path === '/bidai') newPath = '/';
      else if (path === '/bidai/roller') newPath = '/roller';
      else if (path === '/bidai/venetian') newPath = '/venetian';
      else if (path === '/bidai/vertisheer') newPath = '/vertisheer';
      else if (path === '/bidai/proses') newPath = '/process';
      else if (path === '/bidai/reka') newPath = '/configurator';
      else if (path === '/bidai/hubungi') newPath = '/contact';
      else if (path === '/bidai/jurnal') newPath = '/blog';
      // 同上：查翻译对照表，没有对应的英文版本就退回 Journal 首页
      else if (path.startsWith('/bidai/jurnal/')) {
        const slug = path.slice('/bidai/jurnal/'.length);
        const enSlug = blogTranslationPairsReverse[slug];
        newPath = enSlug ? `/blog/${enSlug}` : '/blog';
      }
      else newPath = '/'; // 兜底
    }

    // 执行跳转
    navigate(newPath);
  };

  return (
    <div
      role="group"
      aria-label={t.langToggle?.label || "Toggle language"}
      className={cn(
        "relative inline-flex items-center rounded-full p-0.5 border text-[0.78rem] font-medium select-none",
        isDark
          ? "border-white/15 bg-white/[0.04]"
          : "border-[var(--color-line)] bg-[var(--color-paper)]",
      )}
    >
      {/* sliding thumb */}
      <span
        aria-hidden
        className={cn(
          "absolute top-0.5 bottom-0.5 w-[42%] rounded-full transition-all duration-300 ease-out",
          isDark ? "bg-[var(--color-clay)]" : "bg-[var(--color-ink)]",
          lang === "en" ? "left-0.5" : "left-[55%]",
        )}
      />
      {(["en", "ms"] as const).map((code) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => handleToggle(code)}
            aria-pressed={active}
            className={cn(
              "relative z-10 px-3 py-1 rounded-full transition-colors tracking-wide",
              active
                ? "text-[var(--color-cream)]"
                : isDark
                ? "text-[var(--color-cream)]/70 hover:text-[var(--color-cream)]"
                : "text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]",
            )}
          >
            {code === "en" ? (t.langToggle?.en || "EN") : (t.langToggle?.ms || "BM")}
          </button>
        );
      })}
    </div>
  );
}