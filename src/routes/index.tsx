import { createFileRoute, Link } from "@tanstack/react-router";
import { Apple, Camera, Info, ScanLine, Search } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { AppShell } from "@/components/AppShell";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "عافية | تغذية آمنة لمرضى الكلى والسكري",
      },
      {
        name: "description",
        content:
          "افحص البوتاسيوم والفوسفور والبروتين والملح في أي منتج: بحث، مسح باركود، أو تصوير الملصق بالذكاء الاصطناعي.",
      },
      { property: "og:title", content: "عافية | تغذية آمنة لمرضى الكلى والسكري" },
      {
        property: "og:description",
        content: "افحص البوتاسيوم والفوسفور والبروتين والملح في أي منتج: بحث، مسح باركود، أو تصوير الملصق.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const ACTIONS = [
  { to: "/foods", icon: Apple, titleKey: "foodsTitle", descKey: "foodsDesc" },
  { to: "/search", icon: Search, titleKey: "searchTitle", descKey: "searchDesc" },
  { to: "/scan", icon: ScanLine, titleKey: "scanTitle", descKey: "scanDesc" },
  { to: "/photo", icon: Camera, titleKey: "photoTitle", descKey: "photoDesc" },
] as const;

function Index() {
  const { t } = useLang();
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="overflow-hidden rounded-3xl border border-border bg-card">
          <img
            src={hero}
            alt={t.appName}
            width={1024}
            height={640}
            className="w-full object-cover"
          />
          <p className="px-5 py-4 text-center text-base font-semibold leading-relaxed text-foreground">
            {t.appTagline}
          </p>
        </div>

        <h2 className="text-center text-xl font-extrabold text-foreground">{t.homeTitle}</h2>

        <div className="flex flex-col gap-3">
          {ACTIONS.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="flex items-center gap-4 rounded-3xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <a.icon className="size-7" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-lg font-extrabold text-foreground">{t[a.titleKey]}</span>
                <span className="text-sm text-muted-foreground">{t[a.descKey]}</span>
              </span>
            </Link>
          ))}

        </div>

        <div className="flex items-start gap-3 rounded-3xl border border-caution/20 bg-caution/5 p-4">
          <Info className="mt-0.5 size-5 shrink-0 text-caution" />
          <p className="text-sm leading-relaxed text-foreground">{t.disclaimer}</p>
        </div>
      </div>
    </AppShell>
  );
}
