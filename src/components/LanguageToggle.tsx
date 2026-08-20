// src/components/LanguageToggle.tsx
import { useLang, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ 引入 useLocation

export function LanguageToggle({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { lang } = useLang(); 
  const t = useT();
  const isDark = tone === "dark";
  const navigate = useNavigate();
  const { pathname } = useLocation(); // ✅ 获取当前路径

  const handleToggle = (code: 'en' | 'ms') => {
    // 如果已经在当前语言，就不做任何操作
    if (lang === code) return;
    
    let newPath = '/';

    if (code === 'ms') {
      // 🔵 英文 (EN) 切换到 马来文 (BM)
      if (pathname === '/') newPath = '/bidai';
      else if (pathname === '/roller') newPath = '/bidai/roller';
      else if (pathname === '/venetian') newPath = '/bidai/venetian';
      else if (pathname === '/vertisheer') newPath = '/bidai/vertisheer';
      else if (pathname === '/process') newPath = '/bidai/proses';
      else if (pathname === '/configurator') newPath = '/bidai/reka';
      else if (pathname === '/contact') newPath = '/bidai/hubungi';
      else if (pathname === '/blog') newPath = '/bidai/jurnal';
      // 处理带 slug 的动态文章路由
      else if (pathname.startsWith('/blog/')) newPath = pathname.replace('/blog/', '/bidai/jurnal/');
      else newPath = '/bidai'; // 兜底
    } else {
      // 🔵 马来文 (BM) 切换到 英文 (EN)
      if (pathname === '/bidai') newPath = '/';
      else if (pathname === '/bidai/roller') newPath = '/roller';
      else if (pathname === '/bidai/venetian') newPath = '/venetian';
      else if (pathname === '/bidai/vertisheer') newPath = '/vertisheer';
      else if (pathname === '/bidai/proses') newPath = '/process';
      else if (pathname === '/bidai/reka') newPath = '/configurator';
      else if (pathname === '/bidai/hubungi') newPath = '/contact';
      else if (pathname === '/bidai/jurnal') newPath = '/blog';
      // 处理带 slug 的动态文章路由
      else if (pathname.startsWith('/bidai/jurnal/')) newPath = pathname.replace('/bidai/jurnal/', '/blog/');
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