import { generateChatCompletion } from "@lovable.dev/ai-gateway";
import { z } from "zod";
import type { FoodInfo, FoodNutrients } from "./nutrition";

const OFF = "https://world.openfoodfacts.org";
const FIELDS = "product_name,product_name_ar,product_name_fr,brands,image_front_small_url,nutriments";
const HEADERS = { "User-Agent": "Afya - kidney-friendly nutrition helper - v1" };

type OffProduct = Record<string, unknown> & { nutriments?: Record<string, unknown> };

function num(v: unknown): number | null {
  const n = typeof v === "string" ? parseFloat(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) ? n : null;
}

/** OFF stores mineral values per 100 g in grams by default; convert to mg. */
function toMg(v: unknown, unit: unknown): number | null {
  const n = num(v);
  if (n == null) return null;
  const u = typeof unit === "string" ? unit.toLowerCase() : "";
  if (u === "mg") return n;
  if (u === "µg" || u === "ug") return n / 1000;
  return n * 1000;
}

export function mapProduct(p: OffProduct): FoodInfo | null {
  const name = (p.product_name as string) || (p.product_name_fr as string) || (p.brands as string) || "";
  if (!name.trim()) return null;
  const nu = p.nutriments ?? {};
  const kJ = num(nu["energy_100g"]);
  const nutrients: FoodNutrients = {
    calories: num(nu["energy-kcal_100g"]) ?? (kJ != null ? kJ / 4.184 : null),
    protein_g: num(nu["proteins_100g"]),
    carbs_g: num(nu["carbohydrates_100g"]),
    sugars_g: num(nu["sugars_100g"]),
    fat_g: num(nu["fat_100g"]),
    fiber_g: num(nu["fiber_100g"]),
    salt_g: num(nu["salt_100g"]),
    sodium_mg: toMg(nu["sodium_100g"], nu["sodium_unit"]),
    potassium_mg: toMg(nu["potassium_100g"], nu["potassium_unit"]),
    phosphorus_mg: toMg(nu["phosphorus_100g"], nu["phosphorus_unit"]),
  };
  const brandRaw = (p.brands as string) || "";
  return {
    name: name.trim(),
    nameFr: (p.product_name_fr as string) || null,
    brand: brandRaw.split(",")[0]?.trim() || null,
    image: (p.image_front_small_url as string) || null,
    nutrients,
    notes: null,
    source: "barcode",
  };
}

export async function fetchProductByCode(code: string): Promise<FoodInfo | null> {
  try {
    const res = await fetch(
      `${OFF}/api/v2/product/${encodeURIComponent(code)}.json?fields=${FIELDS}`,
      { headers: HEADERS },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { status?: number; product?: OffProduct };
    if (json.status !== 1 || !json.product) return null;
    return mapProduct(json.product);
  } catch {
    return null;
  }
}

export async function searchProductsByQuery(query: string): Promise<FoodInfo[]> {
  try {
    const res = await fetch(
      `${OFF}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=12&fields=${FIELDS}`,
      { headers: HEADERS },
    );
    if (!res.ok) return [];
    const json = (await res.json()) as { products?: OffProduct[] };
    const seen = new Set<string>();
    const out: FoodInfo[] = [];
    for (const p of json.products ?? []) {
      const f = mapProduct(p);
      if (f && !seen.has(f.name)) {
        seen.add(f.name);
        out.push(f);
      }
    }
    return out.slice(0, 10);
  } catch {
    return [];
  }
}

// ---------- AI label reading ----------

const AiLabelSchema = z.object({
  found: z.boolean(),
  product_name: z.string().nullable().optional(),
  product_name_fr: z.string().nullable().optional(),
  per_100g: z
    .object({
      calories: z.coerce.number().nullable().optional(),
      protein_g: z.coerce.number().nullable().optional(),
      carbs_g: z.coerce.number().nullable().optional(),
      sugars_g: z.coerce.number().nullable().optional(),
      fat_g: z.coerce.number().nullable().optional(),
      fiber_g: z.coerce.number().nullable().optional(),
      salt_g: z.coerce.number().nullable().optional(),
      sodium_mg: z.coerce.number().nullable().optional(),
      potassium_mg: z.coerce.number().nullable().optional(),
      phosphorus_mg: z.coerce.number().nullable().optional(),
    })
    .nullable()
    .optional(),
  notes: z
    .object({ ar: z.string(), fr: z.string() })
    .nullable()
    .optional(),
});

const SYSTEM_PROMPT = `You read photos of food packaging nutrition labels for people with chronic kidney disease (CKD), dialysis patients and diabetics.
Reply ONLY with minified JSON — no markdown fences, no explanation.
Schema: {"found":boolean,"product_name":string|null,"product_name_fr":string|null,"per_100g":{"calories":number|null,"protein_g":number|null,"carbs_g":number|null,"sugars_g":number|null,"fat_g":number|null,"fiber_g":number|null,"salt_g":number|null,"sodium_mg":number|null,"potassium_mg":number|null,"phosphorus_mg":number|null},"notes":{"ar":string,"fr":string}}
Values must be per 100 g or per 100 ml. Convert units yourself: kJ to kcal (divide by 4.184), grams of minerals to mg (multiply by 1000). Use null when a value is not on the label.
If the image contains no nutrition information at all, set found=false and leave everything else null.
notes: 1-2 short, simple sentences of advice about potassium/phosphorus/sodium/sugar for a kidney or diabetic patient — in Arabic ("ar") and French ("fr").`;

export async function analyzeLabelImage(
  dataUrl: string,
): Promise<{ ok: true; food: FoodInfo } | { ok: false; reason: "no_label" | "error" }> {
  try {
    const res = await generateChatCompletion({
      model: "openai/gpt-6-astra",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: "Read the nutrition information in this photo." },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
    });
    const text = res.choices?.[0]?.message?.content ?? "";
    const cleaned = text.replace(/```(?:json)?/g, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start < 0 || end <= start) return { ok: false, reason: "error" };
    const parsed = AiLabelSchema.safeParse(JSON.parse(cleaned.slice(start, end + 1)));
    if (!parsed.success || !parsed.data.found) return { ok: false, reason: "no_label" };
    const d = parsed.data;
    const p = d.per_100g ?? {};
    const nutrients: FoodNutrients = {
      calories: p.calories ?? null,
      protein_g: p.protein_g ?? null,
      carbs_g: p.carbs_g ?? null,
      sugars_g: p.sugars_g ?? null,
      fat_g: p.fat_g ?? null,
      fiber_g: p.fiber_g ?? null,
      salt_g: p.salt_g ?? null,
      sodium_mg: p.sodium_mg ?? null,
      potassium_mg: p.potassium_mg ?? null,
      phosphorus_mg: p.phosphorus_mg ?? null,
    };
    const food: FoodInfo = {
      name: d.product_name?.trim() || "",
      nameFr: d.product_name_fr?.trim() || null,
      brand: null,
      image: null,
      nutrients,
      notes: d.notes ? { ar: d.notes.ar, fr: d.notes.fr } : null,
      source: "ai",
    };
    return { ok: true, food };
  } catch (err) {
    console.error("AI label analysis failed:", err);
    return { ok: false, reason: "error" };
  }
}
