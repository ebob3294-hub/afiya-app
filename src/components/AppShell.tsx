import { Link, useLocation } from "@tanstack/react-router";
import { Apple, Camera, HeartPulse, Home, ScanLine, Search } from "lucide-react";
import type { ReactNode } from "react";
import type { Dict } from "@/lib/i18n";
import { useLang } from "@/lib/lang";

function LangToggle() {
  const { lang, setLang } = useLang();
  const base = "rounded-full px-3 py-1.5 text-sm font-bold transition-colors";
  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1" role="group" aria-label="Language">
      <button
        type="button"
        onClick={() => setLang("ar")}
        className={`${base} ${lang === "ar" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
      >
        ع
      </button>
      <button
        type="button"
        onClick={() => setLang("fr")}
        className={`${base} ${lang === "fr" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
      >
        FR
      </button>
    </div>
  );
}

const TABS = [
  { to: "/", icon: Home, labelKey: "navHome" },
  { to: "/foods", icon: Apple, labelKey: "navFoods" },
  { to: "/search", icon: Search, labelKey: "navSearch" },
  { to: "/scan", icon: ScanLine, labelKey: "navScan" },
  { to: "/photo", icon: Camera, labelKey: "navPhoto" },
] as const satisfies readonly { to: "/" | "/foods" | "/search" | "/scan" | "/photo"; icon: typeof Home; labelKey: keyof Dict }[];

export function AppShell({ title, children }: { title?: string; children: ReactNode }) {
  const { t } = useLang();
  const pathname = useLocation({ select: (s) => s.pathname });
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto grid max-w-3xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <HeartPulse className="size-6" />
            </div>
            {title ? (
              <h1 className="truncate text-lg font-extrabold leading-tight text-foreground">{title}</h1>
            ) : (
              <div className="min-w-0">
                <p className="truncate text-lg font-extrabold leading-none text-foreground">{t.appName}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{t.appSub}</p>
              </div>
            )}
          </div>
          <div className="shrink-0">
            <LangToggle />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-32 pt-6">{children}</main>
      <nav
        className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 backdrop-blur"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Main"
      >
        <div className="mx-auto grid max-w-3xl grid-cols-5">
          {TABS.map((tab) => {
            const active = pathname === tab.to;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.to}
                to={tab.to}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 py-2 text-xs font-bold transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className={`flex items-center justify-center rounded-full px-4 py-1 ${active ? "bg-primary/10" : ""}`}>
                  <Icon className="size-5" />
                </span>
                {t[tab.labelKey]}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
