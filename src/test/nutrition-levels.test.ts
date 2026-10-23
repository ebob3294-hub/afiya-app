import { describe, expect, it } from "vitest";
import { levelFor, overallLevel } from "@/lib/nutrition";

/*
 * Kidney safety thresholds the app displays to patients (per 100 g / 100 ml).
 * Potassium: <100 safe, 100-225 caution, >225 avoid.
 * Phosphorus: <90 safe, 90-160 caution, >160 avoid.
 * Sodium: <120 safe, 120-600 caution, >600 avoid.
 */
describe("kidney nutrient traffic-light thresholds", () => {
  it("rates potassium below 100 mg as safe and above 225 mg as avoid", () => {
    expect(levelFor("potassium_mg", 99)).toBe("safe");
    expect(levelFor("potassium_mg", 100)).toBe("caution");
    expect(levelFor("potassium_mg", 225)).toBe("caution");
    expect(levelFor("potassium_mg", 226)).toBe("danger");
  });

  it("rates phosphorus below 90 mg as safe and above 160 mg as avoid", () => {
    expect(levelFor("phosphorus_mg", 89)).toBe("safe");
    expect(levelFor("phosphorus_mg", 90)).toBe("caution");
    expect(levelFor("phosphorus_mg", 160)).toBe("caution");
    expect(levelFor("phosphorus_mg", 161)).toBe("danger");
  });

  it("rates sodium below 120 mg as safe and above 600 mg as avoid", () => {
    expect(levelFor("sodium_mg", 119)).toBe("safe");
    expect(levelFor("sodium_mg", 120)).toBe("caution");
    expect(levelFor("sodium_mg", 600)).toBe("caution");
    expect(levelFor("sodium_mg", 601)).toBe("danger");
  });

  it("shows info (no verdict) for nutrients without kidney thresholds and missing values", () => {
    expect(levelFor("protein_g", 30)).toBe("info");
    expect(levelFor("potassium_mg", null)).toBe("info");
  });

  it("overall verdict is the worst of potassium, phosphorus, sodium and salt", () => {
    expect(
      overallLevel({
        calories: 100,
        protein_g: 5,
        carbs_g: 10,
        sugars_g: 1,
        fat_g: 1,
        fiber_g: 1,
        salt_g: 0.1,
        sodium_mg: 40,
        potassium_mg: 50,
        phosphorus_mg: 30,
      }),
    ).toBe("safe");

    expect(
      overallLevel({
        calories: 100,
        protein_g: 5,
        carbs_g: 10,
        sugars_g: 1,
        fat_g: 1,
        fiber_g: 1,
        salt_g: 0.1,
        sodium_mg: 40,
        potassium_mg: 300,
        phosphorus_mg: 30,
      }),
    ).toBe("danger");
  });
});
