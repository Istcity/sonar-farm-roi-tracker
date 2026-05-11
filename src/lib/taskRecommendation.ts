import { i18n } from "../i18n";
import { getUpcomingPlantingLabels } from "./plantingPlan";
import { soilDataCompleteness } from "./soilCropAdvice";
import { DailyTask, ProjectSummary } from "../types/store";
import { WeatherSnapshot } from "../types/weather";

export function recommendTasksByWeather(
  weather: WeatherSnapshot,
  previousTasks: DailyTask[],
): DailyTask[] {
  const labels = [i18n.t("tasks.baseWater"), i18n.t("tasks.baseScout")];

  if (weather.temperatureC <= 2) labels.push(i18n.t("tasks.frostCover"));
  if (weather.windKmh >= 28) {
    labels.push(i18n.t("tasks.sprayWaitWind"));
  } else {
    labels.push(i18n.t("tasks.sprayWindowOk"));
  }
  if (weather.precipitationChance >= 60) labels.push(i18n.t("tasks.drainCheck"));
  if (weather.humidity >= 80) labels.push(i18n.t("tasks.fungusWatch"));

  return labels.map((label) => {
    const existing = previousTasks.find((task) => task.label === label);
    return {
      id: existing?.id || label.toLowerCase().replace(/\s+/g, "-").slice(0, 48),
      label,
      done: existing?.done ?? false,
    };
  });
}

function soilTaskHint(project: ProjectSummary): string | null {
  if (soilDataCompleteness(project.soil) === "empty") {
    return i18n.t("tasks.soilEnterData");
  }
  return null;
}

export function buildAllRecommendedTasks(
  weather: WeatherSnapshot | null,
  previousTasks: DailyTask[],
  project: ProjectSummary,
): DailyTask[] {
  const byLabel = new Map<string, DailyTask>();

  if (weather) {
    const wtasks = recommendTasksByWeather(weather, previousTasks);
    for (const t of wtasks) byLabel.set(t.label, t);
  } else {
    for (const t of previousTasks) byLabel.set(t.label, t);
  }

  const extraLabels: string[] = [];
  const soilHint = soilTaskHint(project);
  if (soilHint) extraLabels.push(soilHint);
  extraLabels.push(...getUpcomingPlantingLabels(project, 14));

  for (const label of extraLabels) {
    if (!byLabel.has(label)) {
      const existing = previousTasks.find((task) => task.label === label);
      byLabel.set(label, {
        id: existing?.id || `x-${label.toLowerCase().replace(/\s+/g, "-").slice(0, 40)}`,
        label,
        done: existing?.done ?? false,
      });
    }
  }

  return Array.from(byLabel.values());
}
