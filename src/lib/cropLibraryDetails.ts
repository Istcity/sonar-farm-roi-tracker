import { getMockCropById } from "../data/mockCrops";
import { LibraryCrop } from "../data/globalCropLibrary";

export type UnifiedCropDetail = {
  ph: string;
  waterNeed: string;
  soilTypes: string[];
  sowingPeriod: string;
  harvestPeriod: string;
  climateNote: string;
};

const waterHintByClimate = (climates: string[], isTR: boolean): string => {
  if (climates.includes("Kurak")) return isTR ? "Dusuk - Orta" : "Low - Medium";
  if (climates.includes("Tropikal")) return isTR ? "Orta - Yuksek" : "Medium - High";
  return isTR ? "Orta" : "Medium";
};

export const getUnifiedCropDetail = (crop: LibraryCrop, isTR: boolean): UnifiedCropDetail => {
  const detailed = getMockCropById(crop.id);
  if (detailed) {
    const req = isTR ? detailed.gereksinimler : { ...detailed.gereksinimler, ...detailed.gereksinimlerEn };
    return {
      ph: req.ph,
      waterNeed: req.su,
      soilTypes: req.toprakTipi || detailed.gereksinimler.toprakTipi,
      sowingPeriod: req.ekimDonemi || (isTR ? "Bolgeye gore degisir" : "Varies by region"),
      harvestPeriod: req.hasatDonemi || (isTR ? "Bolgeye gore degisir" : "Varies by region"),
      climateNote: req.iklimNotu || (isTR ? "Yerel iklim verisi ile birlikte degerlendirin." : "Evaluate with local climate data."),
    };
  }

  return {
    ph: "6.0 - 7.5",
    waterNeed: waterHintByClimate(crop.iklimler, isTR),
    soilTypes: isTR ? ["Tınlı", "Iyi drene", "Organik madde dengeli"] : ["Loam", "Well-drained", "Balanced organic matter"],
    sowingPeriod: isTR ? "Bolge ve ceside gore degisir" : "Varies by region and cultivar",
    harvestPeriod: isTR ? "Bolge ve sezon takvimine gore degisir" : "Varies by region and season",
    climateNote: isTR
      ? `${crop.iklimler.join(", ")} kosullari icin uygunluk analizi yapin.`
      : `Assess suitability for ${crop.iklimler.join(", ")} conditions.`,
  };
};
