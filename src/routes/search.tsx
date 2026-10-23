import { createFileRoute } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { FoodDetail } from "@/components/FoodDetail";
import { useLang } from "@/lib/lang";
import { searchProducts } from "@/lib/nutrition.functions";
import type { FoodInfo } from "@/lib/nutrition";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "البحث عن غذاء | عافية" },
      { name: "description", content: "ابحث عن أي منتج واعرف نسبة البوتاسيوم والفوسفور والبروتين والملح فيه." },
      { property: "og:title", content: "البحث عن غذاء | عافية" },
      { property: "og:description", content: "ابحث عن أي منتج واعرف قيمه الغذائية ومدى ملاءمته لمرضى الكلى." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchPage,
});

type Phase = "idle" | "loading" | "done" | "error";

function SearchPage() {
  const { t } = useLang();
  const doSearch = useServerFn(searchProducts);
  const [query, setQuery] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [results, setResults] = useState<FoodInfo[]>([]);
  const [selected, setSelected] = useState<FoodInfo | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q.length < 2) return;
    setPhase("loading");
    try {
      const r = await doSearch({ data: { query: q } });
      setResults(r);
      setSelected(null);
      setPhase("done");
    } catch {
      setPhase("error");
    }
  }

  return (
    <AppShell title={t.searchTitle}>
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="min-w-0 flex-1 rounded-2xl border border-input bg-card px-4 py-3 text-base font-semibold text-foreground placeholder:font-normal placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
        />
        <button
          type="submit"
          disabled={phase === "loading"}
          className="flex shrink-0 items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-base font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          <SearchIcon className="size-5" />
          <span className="hidden sm:inline">{t.searchBtn}</span>
        </button>
      </form>

      {phase === "loading" ? <p className="mt-6 text-center text-base font-semibold text-muted-foreground">{t.searching}</p> : null}
      {phase === "error" ? <p className="mt-6 text-center text-base font-semibold text-danger">{t.searchError}</p> : null}
      {phase === "done" && results.length === 0 ? (
        <p className="mt-6 text-center text-base font-semibold text-muted-foreground">{t.noResults}</p>
      ) : null}

      {selected ? (
        <div className="mt-6">
          <FoodDetail food={selected} />
        </div>
      ) : results.length > 0 ? (
        <div className="mt-6 flex flex-col gap-2">
          {results.map((f, i) => (
            <button
              key={`${f.name}-${i}`}
              type="button"
              onClick={() => setSelected(f)}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 text-start transition-colors hover:bg-muted"
            >
              {f.image ? (
                <img src={f.image} alt={f.name} loading="lazy" className="size-14 shrink-0 rounded-xl object-contain" />
              ) : null}
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-base font-bold text-foreground">{f.name}</span>
                {f.brand ? <span className="truncate text-sm text-muted-foreground">{f.brand}</span> : null}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </AppShell>
  );
}
