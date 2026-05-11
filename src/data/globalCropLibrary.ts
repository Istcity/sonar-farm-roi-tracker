import { mockCrops } from "./mockCrops";

export type LibraryCrop = {
  id: string;
  ad: string;
  adEn: string;
  kategori: string;
  kategoriEn: string;
  kullanim: string[];
  bolgeler: string[];
  iklimler: string[];
  ozet: string;
  ozetEn: string;
  hasDetailedProfile: boolean;
};

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const majorGroups: Array<{
  kategori: string;
  kategoriEn: string;
  kullanim: string[];
  bolgeler: string[];
  iklimler: string[];
  crops: string[];
}> = [
  {
    kategori: "Tahil ve Pseudotahil",
    kategoriEn: "Cereals and Pseudocereals",
    kullanim: ["Gida", "Yem", "Sanayi"],
    bolgeler: ["Global"],
    iklimler: ["Iliman", "Kurak", "Tropikal"],
    crops: [
      "Wheat", "Rice", "Maize", "Barley", "Oat", "Rye", "Sorghum", "Millet", "Quinoa", "Buckwheat",
      "Triticale", "Fonio", "Teff", "Spelt", "Amaranth",
    ],
  },
  {
    kategori: "Baklagiller",
    kategoriEn: "Pulses and Legumes",
    kullanim: ["Gida", "Toprak Iyilestirme", "Yem"],
    bolgeler: ["Global"],
    iklimler: ["Iliman", "Kurak", "Tropikal"],
    crops: [
      "Chickpea", "Lentil", "Pea", "Dry Bean", "Faba Bean", "Soybean", "Mung Bean", "Cowpea", "Pigeon Pea",
      "Lupin", "Black Gram", "Kidney Bean", "Adzuki Bean", "Bambara Groundnut",
    ],
  },
  {
    kategori: "Yag Tohumlari",
    kategoriEn: "Oilseed Crops",
    kullanim: ["Yag", "Gida", "Biyoyakit", "Sanayi"],
    bolgeler: ["Global"],
    iklimler: ["Iliman", "Kurak", "Tropikal"],
    crops: [
      "Sunflower", "Canola", "Rapeseed", "Sesame", "Groundnut", "Safflower", "Flaxseed", "Castor", "Mustard",
      "Oil Palm", "Coconut", "Camelina", "Niger Seed",
    ],
  },
  {
    kategori: "Meyveler",
    kategoriEn: "Fruit Crops",
    kullanim: ["Taze Tuketim", "Isleme", "Ihracat"],
    bolgeler: ["Global"],
    iklimler: ["Iliman", "Akdeniz", "Tropikal"],
    crops: [
      "Apple", "Pear", "Peach", "Plum", "Apricot", "Cherry", "Grape", "Pomegranate", "Fig", "Persimmon", "Olive",
      "Date Palm", "Citrus", "Lemon", "Orange", "Mandarin", "Grapefruit", "Banana", "Mango", "Avocado", "Pineapple",
      "Papaya", "Guava", "Litchi", "Dragon Fruit", "Kiwi", "Blueberry", "Strawberry", "Raspberry", "Blackberry",
      "Cranberry", "Walnut", "Almond", "Hazelnut", "Pistachio", "Cashew", "Macadamia",
    ],
  },
  {
    kategori: "Sebzeler",
    kategoriEn: "Vegetable Crops",
    kullanim: ["Taze Tuketim", "Sera", "Isleme"],
    bolgeler: ["Global"],
    iklimler: ["Iliman", "Tropikal", "Serin"],
    crops: [
      "Tomato", "Pepper", "Eggplant", "Cucumber", "Zucchini", "Pumpkin", "Melon", "Watermelon", "Onion", "Garlic",
      "Leek", "Carrot", "Potato", "Sweet Potato", "Cassava", "Yam", "Beetroot", "Sugar Beet", "Turnip", "Radish",
      "Cabbage", "Cauliflower", "Broccoli", "Kale", "Spinach", "Lettuce", "Celery", "Artichoke", "Asparagus",
      "Okra", "Green Bean", "Pea (Fresh)", "Brussels Sprout",
    ],
  },
  {
    kategori: "Lif ve Endustriyel",
    kategoriEn: "Fiber and Industrial Crops",
    kullanim: ["Tekstil", "Sanayi", "Biyomalzeme"],
    bolgeler: ["Global"],
    iklimler: ["Iliman", "Tropikal", "Kurak"],
    crops: [
      "Cotton", "Jute", "Hemp", "Flax", "Kenaf", "Sisal", "Ramie", "Abaca", "Kapok", "Rubber", "Tobacco", "Hop",
      "Indigo", "Guayule",
    ],
  },
  {
    kategori: "Icek ve Uyarici Bitkiler",
    kategoriEn: "Beverage and Stimulant Crops",
    kullanim: ["Icecek", "Isleme", "Ihracat"],
    bolgeler: ["Global"],
    iklimler: ["Tropikal", "Yuksek Rakim", "Iliman"],
    crops: ["Coffee", "Tea", "Cocoa", "Yerba Mate", "Kola Nut", "Guarana"],
  },
  {
    kategori: "Baharat ve Tibbi Aromatik",
    kategoriEn: "Spice and Medicinal Aromatic Crops",
    kullanim: ["Baharat", "Tibbi", "Kozmetik", "Ucurucu Yag"],
    bolgeler: ["Global"],
    iklimler: ["Akdeniz", "Tropikal", "Iliman"],
    crops: [
      "Lavender", "Rosemary", "Thyme", "Sage", "Mint", "Basil", "Oregano", "Coriander", "Cumin", "Fennel", "Anise",
      "Dill", "Fenugreek", "Turmeric", "Ginger", "Cardamom", "Black Pepper", "Cinnamon", "Clove", "Vanilla",
      "Chamomile", "Echinacea", "Aloe Vera", "Ginseng", "Stevia", "Saffron", "Licorice",
    ],
  },
  {
    kategori: "Yem ve Mer'a Bitkileri",
    kategoriEn: "Forage and Pasture Crops",
    kullanim: ["Yem", "Toprak Koruma"],
    bolgeler: ["Global"],
    iklimler: ["Iliman", "Kurak", "Tropikal"],
    crops: [
      "Alfalfa", "Clover", "Vetch", "Sudan Grass", "Forage Sorghum", "Ryegrass", "Timothy Grass", "Bermuda Grass",
      "Napier Grass", "Silage Maize",
    ],
  },
];

const detailedIds = new Set(mockCrops.map((crop) => crop.id));
const detailedById = new Map(mockCrops.map((crop) => [crop.id, crop] as const));

const trNameByEnglish: Record<string, string> = {
  Wheat: "Bugday",
  Rice: "Pirinç",
  Maize: "Misir",
  Barley: "Arpa",
  Oat: "Yulaf",
  Rye: "Cavdar",
  Sorghum: "Sorgum",
  Millet: "Dari",
  Quinoa: "Kinoa",
  Buckwheat: "Karabugday",
  Triticale: "Tritikale",
  Chickpea: "Nohut",
  Lentil: "Mercimek",
  Pea: "Bezelye",
  "Dry Bean": "Kuru Fasulye",
  Soybean: "Soya Fasulyesi",
  Sunflower: "Aycicegi",
  Canola: "Kanola",
  Rapeseed: "Kolza",
  Sesame: "Susam",
  Groundnut: "Yer Fistigi",
  Mustard: "Hardal",
  Coconut: "Hindistan Cevizi",
  Apple: "Elma",
  Pear: "Armut",
  Peach: "Seftali",
  Plum: "Erik",
  Apricot: "Kayisi",
  Cherry: "Kiraz",
  Grape: "Uzum",
  Pomegranate: "Nar",
  Fig: "Incir",
  Olive: "Zeytin",
  Lemon: "Limon",
  Orange: "Portakal",
  Mandarin: "Mandalina",
  Grapefruit: "Greyfurt",
  Banana: "Muz",
  Mango: "Mango",
  Avocado: "Avokado",
  Pineapple: "Ananas",
  Papaya: "Papaya",
  Kiwi: "Kivi",
  Blueberry: "Yaban Mersini",
  Strawberry: "Cilek",
  Raspberry: "Ahududu",
  Blackberry: "Böğurtlen",
  Walnut: "Ceviz",
  Almond: "Badem",
  Hazelnut: "Findik",
  Pistachio: "Antep Fistigi",
  Tomato: "Domates",
  Pepper: "Biber",
  Eggplant: "Patlican",
  Cucumber: "Salatalik",
  Zucchini: "Kabak",
  Pumpkin: "Bal Kabagi",
  Melon: "Kavun",
  Watermelon: "Karpuz",
  Onion: "Sogan",
  Garlic: "Sarmisak",
  Leek: "Pirasa",
  Carrot: "Havuc",
  Potato: "Patates",
  "Sweet Potato": "Tatli Patates",
  Cabbage: "Lahana",
  Cauliflower: "Karnabahar",
  Broccoli: "Brokoli",
  Kale: "Kara Lahana",
  Spinach: "Ispanak",
  Lettuce: "Marul",
  Celery: "Kereviz",
  Artichoke: "Enginar",
  Asparagus: "Kuskonmaz",
  Okra: "Bamya",
  "Green Bean": "Taze Fasulye",
  Cotton: "Pamuk",
  Jute: "Jut",
  Hemp: "Kenevir",
  Flax: "Keten",
  Rubber: "Kaucuk",
  Tobacco: "Tutun",
  Coffee: "Kahve",
  Tea: "Cay",
  Cocoa: "Kakao",
  Lavender: "Lavanta",
  Rosemary: "Biberiye",
  Thyme: "Kekik",
  Sage: "Ada Cayi",
  Mint: "Nane",
  Basil: "Feslegen",
  Oregano: "Mercankosk",
  Coriander: "Kisnis",
  Cumin: "Kimyon",
  Fennel: "Rezene",
  Anise: "Anason",
  Dill: "Dereotu",
  Turmeric: "Zerdecal",
  Ginger: "Zencefil",
  Cardamom: "Kakule",
  Cinnamon: "Tarcin",
  Clove: "Karanfil",
  Vanilla: "Vanilya",
  Chamomile: "Papatya",
  "Aloe Vera": "Aloe Vera",
  Ginseng: "Ginseng",
  Stevia: "Stevia",
  Saffron: "Safran",
  Licorice: "Meyan Koku",
  Alfalfa: "Yonca",
  Clover: "Ucgol",
  Vetch: "Fig",
  Ryegrass: "Cim Otu",
  "Silage Maize": "Silajlik Misir",
};

const derivedGlobalLibrary: LibraryCrop[] = majorGroups.flatMap((group) =>
  group.crops.map((cropNameEn) => {
    const id = slugify(cropNameEn);
    const detailed = detailedById.get(id);
    const ad = detailed?.ad || trNameByEnglish[cropNameEn] || cropNameEn;
    return {
      id,
      ad,
      adEn: cropNameEn,
      kategori: group.kategori,
      kategoriEn: group.kategoriEn,
      kullanim: group.kullanim,
      bolgeler: group.bolgeler,
      iklimler: group.iklimler,
      ozet: `${cropNameEn} urunu ${group.kategori.toLowerCase()} grubunda yer alir ve ${group.kullanim[0].toLowerCase()} odakli deger sunar.`,
      ozetEn: `${cropNameEn} belongs to ${group.kategoriEn.toLowerCase()} and is commonly used for ${group.kullanim[0].toLowerCase()}.`,
      hasDetailedProfile: detailedIds.has(id),
    };
  }),
);

const detailedFromMock: LibraryCrop[] = mockCrops.map((crop) => ({
  id: crop.id,
  ad: crop.ad,
  adEn: crop.adEn,
  kategori: crop.kategori,
  kategoriEn: crop.kategoriEn || crop.kategori,
  kullanim: ["Gida"],
  bolgeler: ["Global"],
  iklimler: ["Iliman"],
  ozet: crop.ozet,
  ozetEn: crop.ozetEn || crop.ozet,
  hasDetailedProfile: true,
}));

const byId = new Map<string, LibraryCrop>();
[...derivedGlobalLibrary, ...detailedFromMock].forEach((item) => {
  const existing = byId.get(item.id);
  if (!existing || item.hasDetailedProfile) byId.set(item.id, item);
});

export const globalCropLibrary: LibraryCrop[] = Array.from(byId.values()).sort((a, b) =>
  a.adEn.localeCompare(b.adEn),
);

export const globalCropGroups = Array.from(new Set(globalCropLibrary.map((item) => item.kategoriEn)));
