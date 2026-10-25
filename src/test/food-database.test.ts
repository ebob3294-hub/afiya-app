import { describe, expect, it } from "vitest";
import { FOOD_CATEGORIES, FOOD_DB, dbFoodToInfo } from "@/lib/food-database";
import { levelFor, overallLevel } from "@/lib/nutrition";

describe("food database", () => {
  it("has complete bilingual names and valid categories for every food", () => {
    for (const f of FOOD_DB) {
      expect(f.nameAr.trim().length).toBeGreaterThan(0);
      expect(f.nameFr.trim().length).toBeGreaterThan(0);
      expect(FOOD_CATEGORIES).toContain(f.category);
      const { calories, protein_g, carbs_g, sugars_g, fat_g, fiber_g, salt_g, sodium_mg, potassium_mg, phosphorus_mg, magnesium_mg } =
        f.nutrients;
      for (const v of [calories, protein_g, carbs_g, sugars_g, fat_g, fiber_g, salt_g, sodium_mg, potassium_mg, phosphorus_mg, magnesium_mg]) {
        expect(v).not.toBeNull();
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1000);
      }
    }
  });

  it("marks high-potassium foods (banana, dates, spinach) as danger", () => {
    const ids = ["fruit-banana", "fruit-dates", "veg-spinach", "leg-almonds"];
    for (const id of ids) {
      const f = FOOD_DB.find((x) => x.id === id);
      expect(f).toBeDefined();
      expect(levelFor("potassium_mg", f!.nutrients.potassium_mg)).toBe("danger");
      expect(overallLevel(f!.nutrients)).toBe("danger");
    }
  });

  it("marks low-potassium staples (rice, couscous, water) as safe overall", () => {
    const ids = ["grain-rice", "grain-couscous", "drink-water"];
    for (const id of ids) {
      const f = FOOD_DB.find((x) => x.id === id);
      expect(f).toBeDefined();
      expect(overallLevel(f!.nutrients)).toBe("safe");
    }
  });

  it("places apple just over the potassium caution threshold", () => {
    const apple = FOOD_DB.find((x) => x.id === "fruit-apple")!;
    expect(apple.nutrients.potassium_mg).toBe(107);
    expect(levelFor("potassium_mg", apple.nutrients.potassium_mg)).toBe("caution");
  });

  it("converts a db food to FoodInfo with builtin source", () => {
    const apple = FOOD_DB.find((x) => x.id === "fruit-apple")!;
    const info = dbFoodToInfo(apple);
    expect(info.name).toBe("تفاح");
    expect(info.nameFr).toBe("Pomme");
    expect(info.source).toBe("builtin");
    expect(info.nutrients.potassium_mg).toBe(107);
    expect(info.nutrients.magnesium_mg).toBe(5);
  });
});
