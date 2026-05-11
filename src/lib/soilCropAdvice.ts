import { ThemeName } from "../theme/palettes";
import { SoilAnalysis } from "../types/store";

export type CropSuggestion = {
  cropKey: string;
  reasonKey: string;
};

function parsePh(ph: string): number | null {
  const n = parseFloat(ph.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function parseOm(om: string): number | null {
  const n = parseFloat(om.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

/** Heuristic suggestions — not agronomic certification; for planning hints only. */
export function suggestCropsForSoil(soil: SoilAnalysis, theme: ThemeName): CropSuggestion[] {
  const ph = parsePh(soil.ph);
  const om = parseOm(soil.organicMatterPct);
  const texture = soil.texture;
  const out: CropSuggestion[] = [];

  const push = (cropKey: string, reasonKey: string) => {
    if (!out.some((o) => o.cropKey === cropKey)) out.push({ cropKey, reasonKey });
  };

  if (ph !== null) {
    if (ph >= 6.0 && ph <= 7.2) {
      push("walnut", "soil.reason.phNeutral");
      push("olive", "soil.reason.phNeutral");
      push("apple", "soil.reason.phNeutral");
    } else if (ph < 6.0) {
      push("potato", "soil.reason.phAcid");
      push("corn", "soil.reason.phAcid");
    } else {
      push("barley", "soil.reason.phAlkaline");
      push("sugarbeet", "soil.reason.phAlkaline");
    }
  }

  if (om !== null) {
    if (om >= 2.5) push("corn", "soil.reason.organicHigh");
    if (om < 1.5) push("legume", "soil.reason.organicLow");
  }

  if (texture === "clay") {
    push("rice", "soil.reason.textureClay");
    push("wheat", "soil.reason.textureClay");
  } else if (texture === "sandy") {
    push("melon", "soil.reason.textureSandy");
    push("peanut", "soil.reason.textureSandy");
  } else if (texture === "loam") {
    push("tomato", "soil.reason.textureLoam");
    push("vineyard", "soil.reason.textureLoam");
  }

  if (theme === "arid") {
    push("olive", "soil.reason.climateArid");
    push("almond", "soil.reason.climateArid");
  } else if (theme === "tropical") {
    push("citrus", "soil.reason.climateTropical");
    push("banana", "soil.reason.climateTropical");
  } else {
    push("canola", "soil.reason.climateContinental");
    push("sunflower", "soil.reason.climateContinental");
  }

  if (out.length === 0) {
    push("mixed", "soil.reason.generic");
  }

  return out.slice(0, 6);
}

export function soilDataCompleteness(soil: SoilAnalysis): "empty" | "partial" | "ok" {
  const hasPh = parsePh(soil.ph) !== null;
  const hasOm = parseOm(soil.organicMatterPct) !== null;
  const hasTex = soil.texture !== "unknown";
  if (hasPh && (hasOm || hasTex)) return "ok";
  if (hasPh || hasOm || hasTex || soil.notes.trim().length > 0) return "partial";
  return "empty";
}
