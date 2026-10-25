import { createFileRoute } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { FoodDetail } from "@/components/FoodDetail";
import { FOOD_CATEGORIES, FOOD_DB, dbFoodToInfo, type FoodCategory } from "@/lib/food-database";
import { useLang } from "@/lib/lang";
import { levelFor, overallLevel, formatValue } from "@/lib/nutrition";
import type { Level } from "@/lib/nutrition";

export const Route = createFileRoute("/foods")({
  head: () => ({
    meta: [
      { title: "الأطعمة الشائعة | عافية" },
      {
        name: "description",
        content: "قائمة أطعمة يومية جاهزة: السمك، الخبز، الخضر، الفواكه وغيرها مع البوتاسيوم والمغنيسيوم والسكر لكل 100 غرام.",
      },
      { property: "og:title", content: "الأطعمة الشائعة | عافية" },
      {
        property: "og:description",
        content: "قائمة أطعمة يومية جاهزة مع البوتاسيوم والمغنيسيوم والسكر لكل 100 غرام.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FoodsPage,
});

const CAT_LABEL: Record<FoodCategory, keyof ReturnType<typeof useLang>["t"]> = {
  fish: "catFish",
  meat: "catMeat",
  grains: "catGrains",
  vegetables: "catVegetables",
  fruits: "catFruits",
  dairy: "catDairy",
  legumes: "catLegumes",
  drinks: "catDrinks",
};

const PILL: Record<Level, string> = {
  safe: "bg-safe/10 text-safe",
  caution: "bg-caution/10 text-caution",
  danger: "bg-danger/10 text-danger",
  info: "bg-muted text-muted-foreground",
};

function FoodsPage() {
  const { lang, t } = useLang();
  const [cat, setCat] = useState<FoodCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FOOD_DB.filter((f) => {
      if (cat !== "all" && f.category !== cat) return false;
      if (!q) return true;
      return f.nameAr.toLowerCase().includes(q) || f.nameFr.toLowerCase().includes(q);
    });
  }, [cat, query]);

  const selected = selectedId ? FOOD_DB.find((f) => f.id === selectedId) : null;

  return (
    <AppShell title={t.foodsTitle}>
      {selected ? (
        <div className="flex flex-col gap-4">
          <FoodDetail food={dbFoodToInfo(selected)} />
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="mx-auto rounded-full bg-secondary px-6 py-2.5 text-base font-bold text-secondary-foreground transition-colors hover:bg-accent"
          >
            {t.back}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm leading-relaxed text-muted-foreground">{t.foodsDesc}</p>

          <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 rounded-2xl border border-input bg-card px-4">
            <SearchIcon className="size-5 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.foodsSearchPlaceholder}
              className="w-full bg-transparent py-3 text-base font-semibold text-foreground placeholder:font-normal placeholder:text-muted-foreground focus:outline-none"
            />
          </form>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCat("all")}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                cat === "all" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.catAll}
            </button>
            {FOOD_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                  cat === c ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {t[CAT_LABEL[c]]}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {filtered.map((f) => {
              const kLevel = levelFor("potassium_mg", f.nutrients.potassium_mg);
              const overall = overallLevel(f.nutrients);
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedId(f.id)}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 text-start transition-colors hover:bg-muted"
                >
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-base font-bold text-foreground">
                      {lang === "fr" ? f.nameFr : f.nameAr}
                    </span>
                    <span className="truncate text-sm text-muted-foreground">
                      {t[CAT_LABEL[f.category]]} · {formatValue(f.nutrients.magnesium_mg, "mg")} {t.n_magnesium} ·{" "}
                      {formatValue(f.nutrients.sugars_g, "g")} {t.n_sugars}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${PILL[overall]}`}
                  >
                    {formatValue(f.nutrients.potassium_mg, "mg")}
                  </span>
                  <span aria-hidden className={kLevel === "danger" ? "text-danger" : "hidden"}>
                    ⚠
                  </span>
                </button>
              );
            })}
            {filtered.length === 0 ? (
              <p className="py-6 text-center text-base font-semibold text-muted-foreground">{t.noResults}</p>
            ) : null}
          </div>
        </div>
      )}
    </AppShell>
  );
}
