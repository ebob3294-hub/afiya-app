import { CheckCircle2, ShieldAlert, Sparkles, TriangleAlert } from "lucide-react";
import { useLang } from "@/lib/lang";
import { levelFor, overallLevel, type FoodInfo, type FoodNutrients, type Level } from "@/lib/nutrition";
import { NutrientRow } from "./NutrientRow";

const ROWS: { key: keyof FoodNutrients; unit: "kcal" | "g" | "mg"; labelKey: string; showProteinNote?: boolean }[] = [
  { key: "calories", unit: "kcal", labelKey: "n_calories" },
  { key: "potassium_mg", unit: "mg", labelKey: "n_potassium" },
  { key: "phosphorus_mg", unit: "mg", labelKey: "n_phosphorus" },
  { key: "protein_g", unit: "g", labelKey: "n_protein", showProteinNote: true },
  { key: "sodium_mg", unit: "mg", labelKey: "n_sodium" },
  { key: "salt_g", unit: "g", labelKey: "n_salt" },
  { key: "sugars_g", unit: "g", labelKey: "n_sugars" },
  { key: "carbs_g", unit: "g", labelKey: "n_carbs" },
  { key: "fat_g", unit: "g", labelKey: "n_fat" },
  { key: "fiber_g", unit: "g", labelKey: "n_fiber" },
];

const BANNER: Record<Exclude<Level, "info">, { icon: typeof ShieldAlert; cls: string }> = {
  danger: { icon: ShieldAlert, cls: "bg-danger/10 text-danger border-danger/20" },
  caution: { icon: TriangleAlert, cls: "bg-caution/10 text-caution border-caution/20" },
  safe: { icon: CheckCircle2, cls: "bg-safe/10 text-safe border-safe/20" },
};

export function FoodDetail({ food }: { food: FoodInfo }) {
  const { lang, t } = useLang();
  const overall = overallLevel(food.nutrients);
  const banner = BANNER[overall];
  const BannerIcon = banner.icon;
  const name = lang === "fr" && food.nameFr ? food.nameFr : food.name;

  return (
    <section className="flex flex-col gap-4">
      <div className="rounded-3xl border border-border bg-card p-5 text-center">
        {food.image ? (
          <img
            src={food.image}
            alt={name}
            loading="lazy"
            className="mx-auto mb-3 max-h-44 rounded-2xl object-contain"
          />
        ) : null}
        <h2 className="text-xl font-extrabold text-foreground">{name}</h2>
        {food.brand ? <p className="mt-1 text-sm text-muted-foreground">{food.brand}</p> : null}
        <p className="mt-2 text-xs text-muted-foreground">
          {food.source === "ai" ? t.sourceAi : t.sourceBarcode} · {t.per100g}
        </p>
      </div>

      <div className={`flex items-start gap-3 rounded-3xl border p-4 ${banner.cls}`}>
        <BannerIcon className="mt-0.5 size-6 shrink-0" />
        <p className="text-base font-bold">
          {overall === "danger" ? t.avoidBanner : overall === "caution" ? t.cautionBanner : t.safeBanner}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {ROWS.map((r) => (
          <div key={r.key}>
            <NutrientRow
              label={t[r.labelKey as keyof typeof t] as string}
              value={food.nutrients[r.key]}
              unit={r.unit}
              level={levelFor(r.key, food.nutrients[r.key])}
            />
            {r.showProteinNote && food.nutrients.protein_g != null ? (
              <p className="mt-1 px-4 text-xs text-muted-foreground">{t.proteinNote}</p>
            ) : null}
          </div>
        ))}
      </div>

      {food.notes ? (
        <div className="flex items-start gap-3 rounded-3xl border border-primary/20 bg-primary/5 p-4">
          <Sparkles className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-bold text-foreground">{t.aiNotes}</p>
            <p className="mt-1 text-sm text-foreground">{lang === "fr" ? food.notes.fr : food.notes.ar}</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
