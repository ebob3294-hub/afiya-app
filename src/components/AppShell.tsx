import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, HeartPulse } from "lucide-react";
import type { ReactNode } from "react";
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

export function AppShell({ title, children }: { title?: string; children: ReactNode }) {
  const { lang, t } = useLang();
  const isHome = !title;
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-3">
          {isHome ? (
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <HeartPulse className="size-6" />
              </div>
              <div>
                <p className="text-lg font-extrabold leading-none text-foreground">{t.appName}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{t.appSub}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-2 text-sm font-bold text-secondary-foreground transition-colors hover:bg-accent"
              >
                {lang === "ar" ? <ArrowRight className="size-4" /> : <ArrowLeft className="size-4" />}
                {t.back}
              </Link>
              <h1 className="text-base font-extrabold text-foreground sm:text-lg">{title}</h1>
            </div>
          )}
          <LangToggle />
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-6">{children}</main>
    </div>
  );
}
