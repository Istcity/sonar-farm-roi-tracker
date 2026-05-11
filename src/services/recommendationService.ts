import { cropCatalog } from "../data/cropCatalog";
import { ClimateZone, CropProfile, ProductCategory, Season, UserPreferenceProfile } from "../types/agro";

const monthToSeason = (month: number): Season => {
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
};

const categoryAllowed = (crop: CropProfile, categories: ProductCategory[]) =>
  categories.length === 0 || categories.includes(crop.category);
const segmentAllowed = (crop: CropProfile, segments: UserPreferenceProfile["selectedSegments"]) =>
  segments.length === 0 || segments.includes(crop.segment);

export function recommendSuitableCrops(input: {
  climate: ClimateZone;
  now?: Date;
  preferences: UserPreferenceProfile;
}): CropProfile[] {
  const season = monthToSeason((input.now || new Date()).getMonth() + 1);
  return cropCatalog
    .filter((crop) => crop.climateZones.includes(input.climate))
    .filter((crop) => crop.sowingSeasons.includes(season))
    .filter((crop) => categoryAllowed(crop, input.preferences.selectedCategories))
    .filter((crop) => segmentAllowed(crop, input.preferences.selectedSegments))
    .filter((crop) => input.preferences.allowNicheSuggestions || !crop.niche)
    .sort((a, b) => Number(b.niche) - Number(a.niche) || b.avgYieldPerDonumKg - a.avgYieldPerDonumKg);
}

export function recommendNicheAlternatives(input: {
  climate: ClimateZone;
  now?: Date;
  preferences: UserPreferenceProfile;
}): CropProfile[] {
  return recommendSuitableCrops(input).filter((c) => c.niche).slice(0, 3);
}
