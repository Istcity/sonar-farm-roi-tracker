import { i18n } from "../i18n";
import { formatDate } from "./formatters";
import { ProjectSummary } from "../types/store";

export type PlantingMilestone = {
  daysAfterPlanting: number;
  labelKey: string;
};

const GENERIC: PlantingMilestone[] = [
  { daysAfterPlanting: 1, labelKey: "planting.m1" },
  { daysAfterPlanting: 7, labelKey: "planting.m7" },
  { daysAfterPlanting: 30, labelKey: "planting.m30" },
  { daysAfterPlanting: 90, labelKey: "planting.m90" },
  { daysAfterPlanting: 180, labelKey: "planting.m180" },
];

const WALNUT_EXTRA: PlantingMilestone[] = [
  { daysAfterPlanting: 14, labelKey: "planting.walnut.d14" },
  { daysAfterPlanting: 60, labelKey: "planting.walnut.d60" },
  { daysAfterPlanting: 365, labelKey: "planting.walnut.y1" },
];

function cropMilestones(crop: string): PlantingMilestone[] {
  const c = crop.toLowerCase();
  if (c.includes("ceviz") || c.includes("walnut")) {
    return [...GENERIC, ...WALNUT_EXTRA].sort((a, b) => a.daysAfterPlanting - b.daysAfterPlanting);
  }
  return [...GENERIC].sort((a, b) => a.daysAfterPlanting - b.daysAfterPlanting);
}

export function getMilestonesForProject(project: ProjectSummary): PlantingMilestone[] {
  return cropMilestones(project.crop);
}

/** Days since planting; negative if planting is in the future. */
export function daysSincePlanting(plantingDateISO: string | null, now = new Date()): number | null {
  if (!plantingDateISO) return null;
  const t = new Date(plantingDateISO).getTime();
  if (Number.isNaN(t)) return null;
  return Math.floor((now.getTime() - t) / 86400000);
}

/** Next milestone label within lookahead days (for tasks / alerts). */
export function getUpcomingPlantingLabels(
  project: ProjectSummary,
  lookaheadDays = 10,
  now = new Date(),
): string[] {
  if (!project.plantingDateISO) return [];
  const days = daysSincePlanting(project.plantingDateISO, now);
  if (days === null) return [];
  const milestones = getMilestonesForProject(project);
  const labels: string[] = [];
  for (const m of milestones) {
    const delta = m.daysAfterPlanting - days;
    if (delta >= 0 && delta <= lookaheadDays) {
      labels.push(i18n.t(m.labelKey));
    }
  }
  return labels;
}

export function getNextMilestoneSummary(project: ProjectSummary, now = new Date()): string | null {
  if (!project.plantingDateISO) return null;
  const days = daysSincePlanting(project.plantingDateISO, now);
  if (days === null || days < 0) {
    return i18n.t("planting.prePlant", { date: formatDate(project.plantingDateISO) });
  }
  const milestones = getMilestonesForProject(project);
  const next = milestones.find((m) => m.daysAfterPlanting > days);
  if (!next) return i18n.t("planting.planComplete");
  const dueIn = next.daysAfterPlanting - days;
  return i18n.t("planting.nextMilestone", {
    label: i18n.t(next.labelKey),
    days: dueIn,
  });
}
