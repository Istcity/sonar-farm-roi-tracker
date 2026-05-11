export type Season = "spring" | "summer" | "autumn" | "winter";
export type ClimateZone = "tropical" | "arid" | "continental" | "temperate";
export type ProductCategory = "fruit" | "grain" | "vegetable" | "medicinal" | "industrial" | "niche";
export type ProductionSegment = "openField" | "greenhouse" | "orchard" | "hydroponic";
export type SupportedCurrency = "TRY" | "USD" | "EUR";

export type CropProfile = {
  id: string;
  name: string;
  category: ProductCategory;
  segment: ProductionSegment;
  niche: boolean;
  summary: string;
  idealSoil: string;
  idealPhRange: string;
  waterNeed: "low" | "medium" | "high";
  climateZones: ClimateZone[];
  sowingSeasons: Season[];
  avgYieldPerDonumKg: number;
  historicalYieldKg: number[];
  marketBasePriceTry: number;
};

export type UserPreferenceProfile = {
  selectedCategories: ProductCategory[];
  selectedSegments: ProductionSegment[];
  selectedCurrency: SupportedCurrency;
  allowNicheSuggestions: boolean;
};

export type DailyDiscovery = {
  dateKey: string;
  cropId: string;
};

export type MarketQuote = {
  cropId: string;
  currency: SupportedCurrency;
  unitPrice: number;
  source: string;
  updatedAt: string;
};
