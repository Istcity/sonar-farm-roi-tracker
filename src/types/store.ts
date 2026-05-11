import { WeatherSnapshot } from "./weather";

export type DailyTask = {
  id: string;
  label: string;
  done: boolean;
};

/** Turkey: 1 dönüm ≈ 1000 m² (standard app assumption; editable separately). */
export const M2_PER_DONUM = 1000;

export type SoilTexture = "unknown" | "clay" | "loam" | "sandy";

export type SoilAnalysis = {
  ph: string;
  organicMatterPct: string;
  texture: SoilTexture;
  notes: string;
};

export type LandParcel = {
  id: string;
  name: string;
  areaDonums: number;
  areaM2: number;
};

export type ProjectSummary = {
  name: string;
  areaDonums: number;
  /** Total primary field m² (independent of dönüm; user can sync from dönüm). */
  areaM2: number;
  crop: string;
  expectedHarvestYear: number;
  estimatedRevenue: number;
  /** ISO date YYYY-MM-DD when main crop was planted / will be planted. */
  plantingDateISO: string | null;
  soil: SoilAnalysis;
  /** Extra plots; areas add to totals for m² cost. */
  parcels: LandParcel[];
};

export type CostItem = {
  id: string;
  category: string;
  isCustomCategory: boolean;
  amount: number;
  date: string;
  note?: string;
};

export type TarimState = {
  weatherCache: WeatherSnapshot | null;
  dailyTasks: DailyTask[];
  project: ProjectSummary;
  costs: CostItem[];
  expenseCategories: string[];
  setWeatherCache: (snapshot: WeatherSnapshot) => void;
  toggleTask: (id: string) => void;
  addCost: (item: Omit<CostItem, "id" | "isCustomCategory">) => void;
  deleteCost: (id: string) => void;
  addCustomExpenseCategory: (name: string) => void;
  updateProject: (updates: Partial<ProjectSummary>) => void;
  refreshTasksFromContext: () => void;
};
