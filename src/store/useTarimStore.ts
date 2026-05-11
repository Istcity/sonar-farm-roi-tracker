import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { donumToM2 } from "../lib/area";
import { buildAllRecommendedTasks } from "../lib/taskRecommendation";
import { CostItem, ProjectSummary, SoilAnalysis, TarimState } from "../types/store";

export const defaultExpenseCategories = ["gubre", "iscilik", "mazot", "ilaclama", "fidan", "sulama"];

const defaultSoil: SoilAnalysis = {
  ph: "",
  organicMatterPct: "",
  texture: "unknown",
  notes: "",
};

export const defaultProject: ProjectSummary = {
  name: "Gelibolu 10 Donum Ceviz Bahcesi",
  areaDonums: 10,
  areaM2: 10000,
  crop: "Ceviz",
  expectedHarvestYear: 2027,
  estimatedRevenue: 850000,
  plantingDateISO: null,
  soil: { ...defaultSoil },
  parcels: [],
};

function normalizeProject(raw?: Partial<ProjectSummary>): ProjectSummary {
  const donums = raw?.areaDonums ?? defaultProject.areaDonums;
  return {
    name: raw?.name ?? defaultProject.name,
    areaDonums: donums,
    areaM2: raw?.areaM2 ?? donumToM2(donums),
    crop: raw?.crop ?? defaultProject.crop,
    expectedHarvestYear: raw?.expectedHarvestYear ?? defaultProject.expectedHarvestYear,
    estimatedRevenue: raw?.estimatedRevenue ?? defaultProject.estimatedRevenue,
    plantingDateISO: raw?.plantingDateISO ?? null,
    soil: { ...defaultSoil, ...raw?.soil },
    parcels: Array.isArray(raw?.parcels) ? raw.parcels : [],
  };
}

export const useTarimStore = create<TarimState>()(
  persist(
    (set, get) => ({
      weatherCache: {
        locationName: "Gelibolu",
        temperatureC: 21,
        humidity: 56,
        windKmh: 18,
        precipitationChance: 30,
        updatedAt: new Date().toISOString(),
        forecast30d: [],
      },
      dailyTasks: [
        { id: "task-1", label: "Sulama kontrolünü yap", done: false },
        { id: "task-2", label: "Günlük arazi turu", done: false },
        { id: "task-3", label: "Fidan diplerini temizle", done: true },
        { id: "task-4", label: "Depo stoklarını kontrol et", done: false },
      ],
      project: { ...defaultProject },
      expenseCategories: [...defaultExpenseCategories],
      costs: [
        {
          id: "seed-1",
          category: "fidan",
          isCustomCategory: false,
          amount: 120000,
          date: "2026-02-11",
        },
        {
          id: "seed-2",
          category: "gubre",
          isCustomCategory: false,
          amount: 35000,
          date: "2026-03-20",
        },
        {
          id: "seed-3",
          category: "iscilik",
          isCustomCategory: false,
          amount: 55000,
          date: "2026-04-03",
        },
      ],
      setWeatherCache: (snapshot) =>
        set((state) => ({
          weatherCache: snapshot,
          dailyTasks: buildAllRecommendedTasks(snapshot, state.dailyTasks, state.project),
        })),
      toggleTask: (id) =>
        set((state) => ({
          dailyTasks: state.dailyTasks.map((task) =>
            task.id === id ? { ...task, done: !task.done } : task,
          ),
        })),
      addCustomExpenseCategory: (name) =>
        set((state) => {
          const normalized = name.trim().toLowerCase();
          if (!normalized) return state;
          if (state.expenseCategories.includes(normalized)) return state;
          return { expenseCategories: [...state.expenseCategories, normalized] };
        }),
      addCost: (item) =>
        set((state) => ({
          costs: [
            {
              id: Date.now().toString(),
              ...item,
              isCustomCategory: !defaultExpenseCategories.includes(item.category),
            },
            ...state.costs,
          ],
        })),
      deleteCost: (id) =>
        set((state) => ({
          costs: state.costs.filter((cost) => cost.id !== id),
        })),
      updateProject: (updates) =>
        set((state) => {
          const soil = updates.soil ? { ...state.project.soil, ...updates.soil } : state.project.soil;
          const parcels = updates.parcels ?? state.project.parcels;
          const project: ProjectSummary = { ...state.project, ...updates, soil, parcels };
          return {
            project,
            dailyTasks: buildAllRecommendedTasks(state.weatherCache, state.dailyTasks, project),
          };
        }),
      refreshTasksFromContext: () => {
        const state = get();
        set({
          dailyTasks: buildAllRecommendedTasks(state.weatherCache, state.dailyTasks, state.project),
        });
      },
    }),
    {
      name: "sonar-tarim-v2",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        weatherCache: state.weatherCache,
        dailyTasks: state.dailyTasks,
        project: state.project,
        costs: state.costs,
        expenseCategories: state.expenseCategories,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<TarimState> | undefined;
        if (!p || typeof p !== "object") return current as TarimState;
        return {
          ...(current as TarimState),
          ...p,
          project: normalizeProject((p as TarimState).project),
        } as TarimState;
      },
    },
  ),
);
