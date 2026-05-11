import { LandParcel, M2_PER_DONUM, ProjectSummary } from "../types/store";

export function donumToM2(donum: number): number {
  return Math.max(0, donum) * M2_PER_DONUM;
}

export function sumParcelM2(parcels: LandParcel[]): number {
  return parcels.reduce((s, p) => s + Math.max(0, Number(p.areaM2) || 0), 0);
}

export function sumParcelDonum(parcels: LandParcel[]): number {
  return parcels.reduce((s, p) => s + Math.max(0, Number(p.areaDonums) || 0), 0);
}

/** Primary field + all parcels — used for unit economics. */
export function getTotalAreaM2(project: ProjectSummary): number {
  const primary = Math.max(0, Number(project.areaM2) || 0);
  return primary + sumParcelM2(project.parcels);
}

export function getCostPerM2(totalCost: number, project: ProjectSummary): number | null {
  const m2 = getTotalAreaM2(project);
  if (m2 <= 0) return null;
  return totalCost / m2;
}
