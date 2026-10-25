export type Level = "safe" | "caution" | "danger" | "info";

export interface FoodNutrients {
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  sugars_g: number | null;
  fat_g: number | null;
  fiber_g: number | null;
  salt_g: number | null;
  sodium_mg: number | null;
  potassium_mg: number | null;
  phosphorus_mg: number | null;
  magnesium_mg: number | null;
}

export interface FoodInfo {
  name: string;
  nameFr?: string | null;
  brand?: string | null;
  image?: string | null;
  nutrients: FoodNutrients;
  notes?: { ar: string; fr: string } | null;
  source?: "barcode" | "ai" | "builtin";
}

/*
 * Traffic-light thresholds per 100 g / 100 ml for kidney patients.
 * Sources: common renal-diet guidance (potassium <100 mg low,
 * >225 mg high; phosphorus <90 mg low, >160 mg high; sodium >600 mg high).
 */
export function levelFor(key: keyof FoodNutrients, v: number | null | undefined): Level {
  if (v == null || !Number.isFinite(v)) return "info";
  switch (key) {
    case "potassium_mg":
      return v < 100 ? "safe" : v <= 225 ? "caution" : "danger";
    case "phosphorus_mg":
      return v < 90 ? "safe" : v <= 160 ? "caution" : "danger";
    case "sodium_mg":
      return v < 120 ? "safe" : v <= 600 ? "caution" : "danger";
    case "salt_g":
      return v < 0.3 ? "safe" : v <= 1.5 ? "caution" : "danger";
    default:
      return "info";
  }
}

const SEVERITY: Level[] = ["info", "safe", "caution", "danger"];
type Verdict = Exclude<Level, "info">;

export function overallLevel(n: FoodNutrients): Verdict {
  const keys: (keyof FoodNutrients)[] = ["potassium_mg", "phosphorus_mg", "sodium_mg", "salt_g"];
  return keys.reduce<Verdict>((worst, k) => {
    const l = levelFor(k, n[k]);
    if (l === "info") return worst;
    return SEVERITY.indexOf(l) > SEVERITY.indexOf(worst) ? l : worst;
  }, "safe");
}

export function formatValue(v: number | null | undefined, unit: "kcal" | "g" | "mg"): string {
  if (v == null || !Number.isFinite(v)) return "—";
  if (unit === "mg") return Math.round(v).toLocaleString("en-US");
  const rounded = Math.round(v * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}
