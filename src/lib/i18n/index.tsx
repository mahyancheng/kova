import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { en, type Dict } from "./en";
import { ms } from "./ms";

export type Lang = "en" | "ms";

const dictionaries: Record<Lang, Dict> = { en: en as unknown as Dict, ms };

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
}>({ lang: "en", setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  // 判断当前是否是马来文专属的 URL
  const isMalayUrl = pathname === "/bidai" || pathname.startsWith("/bidai/");

  // 核心修复：语言 100% 根据网址决定！没有任何“中立”路由，也没有缓存记忆干扰。
  // 只要是 /bidai 开头的就是 ms，其他所有情况（/process, /roller, / 等）统统是 en！
  const lang: Lang = isMalayUrl ? "ms" : "en";

  // 将当前正确的语言同步到 HTML 标签，这对 SEO 非常重要
  useEffect(() => {
    document.documentElement.lang = dictionaries[lang].meta.htmlLang;
  }, [lang]);

  // 我们保留一个空的 setLang 函数，以防其他组件（比如 LanguageToggle）调用它。
  // 现在的实际语言切换已经由 LanguageToggle 里的 `navigate(newPath)` 来完美处理了。
  const setLang = (l: Lang) => {
    try {
      localStorage.setItem("kova-lang", l);
    } catch {
      /* ignore */
    }
  };

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

export function useT(): Dict {
  const { lang } = useContext(LangContext);
  return dictionaries[lang];
}