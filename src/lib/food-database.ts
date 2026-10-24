import type { FoodInfo, FoodNutrients } from "@/lib/nutrition";

export type FoodCategory =
  | "fish"
  | "meat"
  | "grains"
  | "vegetables"
  | "fruits"
  | "dairy"
  | "legumes"
  | "drinks";

export const FOOD_CATEGORIES: FoodCategory[] = [
  "fish",
  "meat",
  "grains",
  "vegetables",
  "fruits",
  "dairy",
  "legumes",
  "drinks",
];

/**
 * Built-in database of common everyday foods, values per 100 g (or 100 ml for drinks).
 * Approximate averages from standard food composition tables — kidney patients
 * should always confirm portions with their dietitian.
 */
export interface DbFood {
  id: string;
  nameAr: string;
  nameFr: string;
  category: FoodCategory;
  nutrients: FoodNutrients;
  notes?: { ar: string; fr: string };
}

const n = (
  calories: number | null,
  protein_g: number | null,
  carbs_g: number | null,
  sugars_g: number | null,
  fat_g: number | null,
  fiber_g: number | null,
  salt_g: number | null,
  sodium_mg: number | null,
  potassium_mg: number | null,
  phosphorus_mg: number | null,
  magnesium_mg: number | null,
): FoodNutrients => ({
  calories,
  protein_g,
  carbs_g,
  sugars_g,
  fat_g,
  fiber_g,
  salt_g,
  sodium_mg,
  potassium_mg,
  phosphorus_mg,
  magnesium_mg,
});

export const FOOD_DB: DbFood[] = [
  // ---------- سمك / Poisson ----------
  {
    id: "fish-grilled",
    nameAr: "سمك مشوي",
    nameFr: "Poisson grillé",
    category: "fish",
    nutrients: n(128, 20, 0, 0, 4.5, 0, 0.3, 120, 360, 240, 30),
    notes: {
      ar: "السمك الطازج غني بالفوسفور والبوتاسيوم — اسأل طبيبك عن الكمية المسموحة أسبوعياً.",
      fr: "Le poisson frais est riche en phosphore et potassium — demandez la quantité autorisée à votre médecin.",
    },
  },
  {
    id: "fish-sardines",
    nameAr: "سردين معلب",
    nameFr: "Sardines en boîte",
    category: "fish",
    nutrients: n(208, 25, 0, 0, 11, 0, 1.25, 500, 397, 480, 39),
    notes: {
      ar: "معلبات السمك عالية جداً في الملح والفوسفور — يُفضّل تجنّبها أو غسلها جيداً قبل الأكل.",
      fr: "Les conserves de poisson sont très riches en sel et phosphore — à éviter ou bien rincer.",
    },
  },
  {
    id: "fish-tuna",
    nameAr: "تونة معلبة",
    nameFr: "Thon en boîte",
    category: "fish",
    nutrients: n(128, 26, 0, 0, 1, 0, 1.0, 400, 240, 300, 30),
    notes: {
      ar: "اختر المعلب في الماء واغسله لتقليل الملح، ولا تأكله كثيراً بسبب الفوسفور.",
      fr: "Choisissez au naturel dans l'eau et rincez pour réduire le sel; limitez la quantité (phosphore).",
    },
  },

  // ---------- لحوم / Viandes ----------
  {
    id: "meat-chicken",
    nameAr: "دجاج مشوي",
    nameFr: "Poulet grillé",
    category: "meat",
    nutrients: n(165, 31, 0, 0, 3.6, 0, 0.19, 74, 256, 190, 29),
    notes: {
      ar: "بدون جلد وبلا ملح زائد: خيار بروتين جيد لمرضى غسيل الكلى، بكمية يحددها الطبيب.",
      fr: "Sans peau ni sel ajouté : bonne source de protéines pour les dialysés, en quantité prescrite.",
    },
  },
  {
    id: "meat-beef",
    nameAr: "لحم بقري مشوي",
    nameFr: "Bœuf grillé",
    category: "meat",
    nutrients: n(250, 26, 0, 0, 15, 0, 0.15, 60, 318, 200, 21),
  },
  {
    id: "meat-sausage",
    nameAr: "نقانق",
    nameFr: "Saucisses",
    category: "meat",
    nutrients: n(300, 12, 1.5, 1.2, 27, 0, 2.5, 1000, 200, 150, 17),
    notes: {
      ar: "منتج مصنّع غني جداً بالملح — يُفضّل تجنّبه تماماً لمرضى الكلى.",
      fr: "Produit transformé très salé — à éviter totalement pour les reins.",
    },
  },

  // ---------- خبز وحبوب / Pains & céréales ----------
  {
    id: "grain-white-bread",
    nameAr: "خبز أبيض",
    nameFr: "Pain blanc",
    category: "grains",
    nutrients: n(265, 9, 49, 2, 3, 2.7, 1.2, 480, 100, 90, 22),
    notes: {
      ar: "الخبز الأبيض يحتوي ملحاً واضحاً؛ خبز القمح الكامل أغنى بالمغنيسيوم لكن يُؤكل بكميات محسوبة.",
      fr: "Le pain blanc contient beaucoup de sel; le pain complet est plus riche en magnésium.",
    },
  },
  {
    id: "grain-whole-bread",
    nameAr: "خبز القمح الكامل",
    nameFr: "Pain complet",
    category: "grains",
    nutrients: n(240, 10, 41, 3, 2, 6, 1.1, 450, 230, 190, 75),
  },
  {
    id: "grain-rice",
    nameAr: "أرز أبيض مطبوخ",
    nameFr: "Riz blanc cuit",
    category: "grains",
    nutrients: n(130, 2.7, 28, 0, 0.3, 0.4, 0.01, 1, 35, 43, 12),
    notes: {
      ar: "خيار آمن ومنخفض في البوتاسيوم والفوسفور — مناسب بكمية معتدلة لمرضى الكلى.",
      fr: "Choix sûr, faible en potassium et phosphore — adapté en quantité modérée.",
    },
  },
  {
    id: "grain-couscous",
    nameAr: "كوسكوس مطبوخ",
    nameFr: "Couscous cuit",
    category: "grains",
    nutrients: n(112, 3.8, 23, 0.1, 0.2, 1.4, 0.01, 5, 30, 32, 8),
  },
  {
    id: "grain-pasta",
    nameAr: "معكرونة مطبوخة",
    nameFr: "Pâtes cuites",
    category: "grains",
    nutrients: n(158, 5.8, 31, 0.6, 0.9, 1.8, 0.01, 1, 40, 48, 15),
  },
  {
    id: "grain-oats",
    nameAr: "شوفان",
    nameFr: "Flocons d'avoine",
    category: "grains",
    nutrients: n(389, 17, 66, 1, 7, 10, 0.01, 2, 360, 410, 177),
    notes: {
      ar: "غني بالفوسفور والمغنيسيوم — تناوله بكمية صغيرة فقط.",
      fr: "Riche en phosphore et magnésium — en très petites quantités.",
    },
  },

  // ---------- خضر / Légumes ----------
  {
    id: "veg-potato",
    nameAr: "بطاطا مسلوقة",
    nameFr: "Pomme de terre bouillie",
    category: "vegetables",
    nutrients: n(87, 1.9, 20, 0.9, 0.1, 1.8, 0.01, 4, 379, 44, 22),
    notes: {
      ar: "البطاطا عالية البوتاسيوم؛ تقليلها بالتقشير والنقع والسلق يخفض البوتاسيوم جزئياً.",
      fr: "La pomme de terre est riche en potassium; éplucher, tremper et bouillir le réduit partiellement.",
    },
  },
  {
    id: "veg-tomato",
    nameAr: "طماطم",
    nameFr: "Tomate",
    category: "vegetables",
    nutrients: n(18, 0.9, 3.9, 2.6, 0.2, 1.2, 0.01, 5, 237, 24, 11),
  },
  {
    id: "veg-carrot",
    nameAr: "جزر",
    nameFr: "Carotte",
    category: "vegetables",
    nutrients: n(41, 0.9, 10, 4.7, 0.2, 2.8, 0.17, 69, 320, 40, 12),
  },
  {
    id: "veg-cabbage",
    nameAr: "ملفوف (كرنب أبيض)",
    nameFr: "Chou blanc",
    category: "vegetables",
    nutrients: n(25, 1.3, 5.8, 3.2, 0.1, 2.5, 0.05, 18, 170, 26, 12),
    notes: {
      ar: "من الخضر المفضّلة لمرضى الكلى: قليل البوتاسيوم نسبياً.",
      fr: "L'un des légumes préférés pour les malades rénaux : potassium relativement bas.",
    },
  },
  {
    id: "veg-zucchini",
    nameAr: "كوسة",
    nameFr: "Courgette",
    category: "vegetables",
    nutrients: n(17, 1.2, 3.1, 2.5, 0.3, 1, 0.02, 8, 200, 34, 18),
  },
  {
    id: "veg-spinach",
    nameAr: "سبانخ",
    nameFr: "Épinards",
    category: "vegetables",
    nutrients: n(23, 2.9, 3.6, 0.4, 0.4, 2.2, 0.2, 79, 558, 49, 79),
    notes: {
      ar: "من أعلى الخضر في البوتاسيوم — يُفضّل تجنّبها لمرضى الكلى.",
      fr: "Parmi les légumes les plus riches en potassium — à éviter pour les reins.",
    },
  },
  {
    id: "veg-onion",
    nameAr: "بصلة",
    nameFr: "Oignon",
    category: "vegetables",
    nutrients: n(40, 1.1, 9.3, 4.2, 0.1, 1.7, 0.01, 4, 146, 29, 10),
  },
  {
    id: "veg-pepper",
    nameAr: "فلفل حلو",
    nameFr: "Poivron",
    category: "vegetables",
    nutrients: n(26, 1, 6, 4.2, 0.3, 2.1, 0.01, 2, 175, 26, 12),
  },
  {
    id: "veg-eggplant",
    nameAr: "باذنجان",
    nameFr: "Aubergine",
    category: "vegetables",
    nutrients: n(25, 1, 6, 3.5, 0.2, 3, 0.01, 2, 229, 25, 14),
  },

  // ---------- فواكه / Fruits ----------
  {
    id: "fruit-apple",
    nameAr: "تفاح",
    nameFr: "Pomme",
    category: "fruits",
    nutrients: n(52, 0.3, 14, 10.4, 0.2, 2.4, 0.01, 1, 107, 11, 5),
    notes: {
      ar: "فاكهة منخفضة البوتاسيوم — خيار جيد لمرضى الكلى، لكن مرضى السكري ينتبهون للسكر.",
      fr: "Fruit pauvre en potassium — bon choix pour les reins; attention au sucre pour les diabétiques.",
    },
  },
  {
    id: "fruit-banana",
    nameAr: "موز",
    nameFr: "Banane",
    category: "fruits",
    nutrients: n(89, 1.1, 23, 12, 0.3, 2.6, 0.01, 1, 358, 22, 27),
    notes: {
      ar: "غني جداً بالبوتاسيوم — يُفضّل تجنّبه لمرضى غسيل الكلى.",
      fr: "Très riche en potassium — à éviter pour les dialysés.",
    },
  },
  {
    id: "fruit-orange",
    nameAr: "برتقال",
    nameFr: "Orange",
    category: "fruits",
    nutrients: n(47, 0.9, 12, 9.4, 0.1, 2.4, 0.01, 0, 181, 14, 10),
  },
  {
    id: "fruit-grape",
    nameAr: "عنب",
    nameFr: "Raisin",
    category: "fruits",
    nutrients: n(69, 0.7, 18, 16, 0.2, 0.9, 0.01, 2, 191, 20, 7),
  },
  {
    id: "fruit-watermelon",
    nameAr: "بطيخ",
    nameFr: "Pastèque",
    category: "fruits",
    nutrients: n(30, 0.6, 7.6, 6.2, 0.2, 0.4, 0.01, 1, 112, 11, 10),
  },
  {
    id: "fruit-dates",
    nameAr: "تمر",
    nameFr: "Dattes",
    category: "fruits",
    nutrients: n(282, 2.5, 75, 63, 0.4, 8, 0.01, 2, 696, 62, 54),
    notes: {
      ar: "أعلى الفواكه في البوتاسيوم والسكر — يمنع لمرضى الكلى ويُقيّد بشدة لمرضى السكري.",
      fr: "Le plus riche en potassium et sucre — interdit pour les reins et très limité pour le diabète.",
    },
  },
  {
    id: "fruit-avocado",
    nameAr: "أفوكادو",
    nameFr: "Avocat",
    category: "fruits",
    nutrients: n(160, 2, 9, 0.7, 15, 7, 0.01, 7, 485, 52, 29),
    notes: {
      ar: "غني بالبوتاسيوم — يُفضّل تجنّبه لمرضى الكلى رغم فوائده للقلب.",
      fr: "Riche en potassium — à éviter pour les reins malgré ses bienfaits cardiaques.",
    },
  },

  // ---------- ألبان / Produits laitiers ----------
  {
    id: "dairy-milk",
    nameAr: "حليب كامل",
    nameFr: "Lait entier",
    category: "dairy",
    nutrients: n(61, 3.2, 4.8, 4.8, 3.3, 0, 0.11, 43, 143, 93, 10),
    notes: {
      ar: "الحليب غني بالفوسفور؛ المسموح عادة كوب صغير يومياً بحسب حالتك.",
      fr: "Le lait est riche en phosphore; généralement un petit verre par jour selon votre cas.",
    },
  },
  {
    id: "dairy-yogurt",
    nameAr: "زبادي طبيعي",
    nameFr: "Yaourt nature",
    category: "dairy",
    nutrients: n(61, 3.5, 4.7, 4.7, 3.3, 0, 0.12, 47, 155, 95, 12),
  },
  {
    id: "dairy-fresh-cheese",
    nameAr: "جبن أبيض طري",
    nameFr: "Fromage blanc",
    category: "dairy",
    nutrients: n(70, 8, 3.5, 3.5, 2, 0, 0.1, 40, 110, 100, 8),
  },
  {
    id: "dairy-hard-cheese",
    nameAr: "جبن صلب",
    nameFr: "Fromage à pâte dure",
    category: "dairy",
    nutrients: n(400, 25, 2, 1, 33, 0, 2.5, 1000, 90, 500, 30),
    notes: {
      ar: "الجبن الصلب غني جداً بالملح والفوسفور — تجنّبه أو كمية صغيرة جداً.",
      fr: "Fromage très riche en sel et phosphore — à éviter ou très petite quantité.",
    },
  },

  // ---------- بقوليات ومكسرات / Légumineuses & noix ----------
  {
    id: "leg-lentils",
    nameAr: "عدس مطبوخ",
    nameFr: "Lentilles cuites",
    category: "legumes",
    nutrients: n(116, 9, 20, 1.8, 0.4, 8, 0.01, 2, 369, 180, 36),
    notes: {
      ar: "البقوليات عموماً غنية بالبوتاسيوم والفوسفور — كمية صغيرة فقط وباستشارة الطبيب.",
      fr: "Les légumineuses sont riches en potassium et phosphore — petites quantités seulement.",
    },
  },
  {
    id: "leg-chickpeas",
    nameAr: "حمص مطبوخ",
    nameFr: "Pois chiches cuits",
    category: "legumes",
    nutrients: n(164, 8.9, 27, 4.8, 2.6, 7.6, 0.02, 7, 270, 170, 48),
  },
  {
    id: "leg-almonds",
    nameAr: "لوز",
    nameFr: "Amandes",
    category: "legumes",
    nutrients: n(579, 21, 22, 4.4, 50, 12, 0.01, 1, 733, 480, 270),
    notes: {
      ar: "المكسرات من أعلى الأطعمة في البوتاسيوم والفوسفور والمغنيسيوم — يمنع لمرضى الكلى.",
      fr: "Les noix comptent parmi les aliments les plus riches en potassium, phosphore et magnésium — interdits.",
    },
  },
  {
    id: "leg-peanuts",
    nameAr: "فول سوداني",
    nameFr: "Cacahuètes",
    category: "legumes",
    nutrients: n(567, 26, 16, 4.2, 49, 8.5, 0.01, 5, 705, 400, 170),
  },

  // ---------- مشروبات / Boissons ----------
  {
    id: "drink-water",
    nameAr: "ماء",
    nameFr: "Eau",
    category: "drinks",
    nutrients: n(0, 0, 0, 0, 0, 0, 0, 4, 1, 0, 2),
    notes: {
      ar: "لمرضى غسيل الكلى توجد كمية مياه محددة يومياً — اتبع توجيه طبيبك.",
      fr: "Pour les dialysés, la quantité d'eau quotidienne est limitée — suivez votre médecin.",
    },
  },
  {
    id: "drink-coffee",
    nameAr: "قهوة سادة",
    nameFr: "Café noir",
    category: "drinks",
    nutrients: n(2, 0.1, 0, 0, 0.1, 0, 0, 2, 49, 2, 3),
  },
  {
    id: "drink-tea",
    nameAr: "شاي سادة",
    nameFr: "Thé nature",
    category: "drinks",
    nutrients: n(1, 0, 0.3, 0, 0, 0, 0, 3, 37, 1, 3),
  },
  {
    id: "drink-cola",
    nameAr: "مشروب غازي (كولا)",
    nameFr: "Soda (cola)",
    category: "drinks",
    nutrients: n(42, 0, 10.6, 10.6, 0, 0, 0.01, 4, 2, 15, 1),
    notes: {
      ar: "سكر مرتفع وحمض الفوسفوريك — ضار للسكري والكلى معاً؛ يُفضّل تجنّبه.",
      fr: "Sucre élevé et acide phosphorique — néfaste pour le diabète et les reins; à éviter.",
    },
  },
];

export function dbFoodToInfo(f: DbFood): FoodInfo {
  return {
    name: f.nameAr,
    nameFr: f.nameFr,
    brand: null,
    image: null,
    nutrients: f.nutrients,
    notes: f.notes ?? null,
    source: "builtin",
  };
}
