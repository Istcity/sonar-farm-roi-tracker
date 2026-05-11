import { i18n } from "../i18n";
import { CropProfile } from "../types/agro";

export function getLocalizedCropName(crop: Pick<CropProfile, "id" | "name">): string {
  const key = `crops.${crop.id}`;
  const translated = i18n.t(key);
  if (translated && translated !== key) return translated;
  return crop.name;
}

const trSummaryById: Record<string, string> = {
  walnut: "Uzun vadeli, dogru yonetimde yuksek getirili meyve bahcesi urunu.",
  lavender: "Kurakliga dayanikli, yag ve kozmetik kanallarinda degeri yuksek nis urun.",
  quinoa: "Talebi artan, kurak kosullara uyumlu alternatif tahil urunu.",
  olive: "Yaglik ve sofralik pazari guclu Akdeniz uyumlu urun.",
  blueberry: "Premium pazarlarda degeri yuksek, dikkatli pH yonetimi isteyen urun.",
};

export function getLocalizedCropSummary(crop: Pick<CropProfile, "id" | "summary">): string {
  if (i18n.locale.startsWith("tr")) return trSummaryById[crop.id] || crop.summary;
  return crop.summary;
}

const trSoilById: Record<string, string> = {
  walnut: "Derin tinli, iyi drene olan toprak",
  lavender: "Kumlu-tinli, dusuk organik maddeye toleransli",
  quinoa: "Iyi drene olan tinli toprak",
  olive: "Kirecli ve drenaji iyi toprak",
  blueberry: "Asidik, organik maddece zengin toprak",
};

const trWaterNeed: Record<CropProfile["waterNeed"], string> = {
  low: "Dusuk",
  medium: "Orta",
  high: "Yuksek",
};

export function getLocalizedSoilInfo(crop: Pick<CropProfile, "id" | "idealSoil">): string {
  if (i18n.locale.startsWith("tr")) return trSoilById[crop.id] || crop.idealSoil;
  return crop.idealSoil;
}

export function getLocalizedWaterNeed(waterNeed: CropProfile["waterNeed"]): string {
  if (i18n.locale.startsWith("tr")) return trWaterNeed[waterNeed] || waterNeed;
  return waterNeed;
}
