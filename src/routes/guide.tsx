import { createFileRoute } from "@tanstack/react-router";
import { BookOpenText, Download, Smartphone } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useLang } from "@/lib/lang";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "دليل تثبيت التطبيق | عافية" },
      { name: "description", content: "كيفية تثبيت تطبيق عافية على أندرويد: تثبيت مباشر أو استخراج ملف APK." },
      { property: "og:title", content: "دليل تثبيت التطبيق | عافية" },
      { property: "og:description", content: "طريقتان لتثبيت تطبيق عافية على هاتف أندرويد." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GuidePage,
});

function StepList({ steps }: { steps: readonly string[] }) {
  return (
    <ol className="flex flex-col gap-3">
      {steps.map((s, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-base font-extrabold text-primary-foreground">
            {i + 1}
          </span>
          <p className="pt-1 text-base leading-relaxed text-foreground">{s}</p>
        </li>
      ))}
    </ol>
  );
}

function GuidePage() {
  const { t } = useLang();
  return (
    <AppShell title={t.guideTitle}>
      <div className="flex flex-col gap-5">
        <p className="text-base font-semibold leading-relaxed text-foreground">{t.gIntro}</p>

        <section className="rounded-3xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Smartphone className="size-6" />
            </span>
            <h2 className="text-lg font-extrabold text-foreground">{t.gOpt1Title}</h2>
          </div>
          <StepList steps={t.gOpt1Steps} />
        </section>

        <section className="rounded-3xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <Download className="size-6" />
            </span>
            <h2 className="text-lg font-extrabold text-foreground">{t.gOpt2Title}</h2>
          </div>
          <StepList steps={t.gOpt2Steps} />
          <p className="mt-4 rounded-2xl bg-muted px-4 py-3 text-sm font-semibold text-muted-foreground">{t.gNote2}</p>
        </section>

        <div className="flex items-start gap-3 rounded-3xl border border-safe/20 bg-safe/5 p-4">
          <BookOpenText className="mt-0.5 size-5 shrink-0 text-safe" />
          <p className="text-sm leading-relaxed text-foreground">{t.gNote}</p>
        </div>
      </div>
    </AppShell>
  );
}
