import { ThemeName } from "../theme/palettes";
import { ProjectSummary } from "../types/store";
import { WeatherSnapshot } from "../types/weather";
import { i18n } from "../i18n";
import { soilDataCompleteness, suggestCropsForSoil } from "./soilCropAdvice";
import { getNextMilestoneSummary } from "./plantingPlan";

export type InsightKind = "warning" | "frost" | "wind" | "ok";

export type DailyAlertBundle = {
  kind: InsightKind;
  message: string;
  detail: string;
};

function weatherKindAndMessage(w: WeatherSnapshot | null): { kind: InsightKind; message: string } {
  if (!w) return { kind: "warning", message: i18n.t("insights.weatherPending") };
  if (w.temperatureC <= 2) return { kind: "frost", message: i18n.t("insights.frost") };
  if (w.windKmh >= 28) return { kind: "wind", message: i18n.t("insights.wind") };
  if (w.precipitationChance >= 60) return { kind: "warning", message: i18n.t("insights.rain") };
  return { kind: "ok", message: i18n.t("insights.ok") };
}

function soilAndCropLine(project: ProjectSummary, theme: ThemeName): string {
  const soil = project.soil;
  const level = soilDataCompleteness(soil);
  if (level === "empty") return i18n.t("insights.soilEmpty");
  if (level === "partial") {
    const hasPh = soil.ph.trim() !== "" && !Number.isNaN(parseFloat(soil.ph.replace(",", ".")));
    if (!hasPh) return i18n.t("insights.soilPartial");
  }
  const suggestions = suggestCropsForSoil(soil, theme);
  const top = suggestions[0];
  if (!top) return i18n.t("insights.soilPartial");
  return i18n.t("insights.suitableCrops", {
    crops: suggestions
      .slice(0, 3)
      .map((s) => i18n.t(`crops.${s.cropKey}`))
      .join(", "),
  });
}

export function buildDailyAlert(
  weather: WeatherSnapshot | null,
  project: ProjectSummary,
  theme: ThemeName,
): DailyAlertBundle {
  const { kind, message } = weatherKindAndMessage(weather);
  const parts: string[] = [];
  parts.push(soilAndCropLine(project, theme));
  const plan = getNextMilestoneSummary(project);
  if (plan) parts.push(plan);
  return { kind, message, detail: parts.filter(Boolean).join(" ") };
}
