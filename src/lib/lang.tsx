import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { dict, type Dict, type Lang } from "./i18n";

interface LangValue {
  lang: Lang;
  t: Dict;
  setLang: (l: Lang) => void;
}

const LangCtx = createContext<LangValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  // Server renders with the default (Arabic); a stored preference is applied
  // after hydration so SSR markup always matches the first client render.
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("afya-lang");
      if (saved === "ar" || saved === "fr") setLangState(saved);
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("afya-lang", l);
    } catch {
      /* storage unavailable */
    }
  };

  return <LangCtx.Provider value={{ lang, t: dict[lang], setLang }}>{children}</LangCtx.Provider>;
}

export function useLang(): LangValue {
  const v = useContext(LangCtx);
  if (!v) throw new Error("useLang must be used inside <LangProvider>");
  return v;
}
