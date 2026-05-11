import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  DailyDiscovery,
  ProductCategory,
  ProductionSegment,
  SupportedCurrency,
  UserPreferenceProfile,
} from "../types/agro";

type AgroState = {
  preferences: UserPreferenceProfile;
  dailyDiscovery: DailyDiscovery | null;
  setSelectedCategories: (categories: ProductCategory[]) => void;
  toggleCategory: (category: ProductCategory) => void;
  setSelectedSegments: (segments: ProductionSegment[]) => void;
  toggleSegment: (segment: ProductionSegment) => void;
  setCurrency: (currency: SupportedCurrency) => void;
  setAllowNicheSuggestions: (allow: boolean) => void;
  setDailyDiscovery: (discovery: DailyDiscovery) => void;
};

const defaultPreferences: UserPreferenceProfile = {
  selectedCategories: ["fruit", "grain", "vegetable", "niche"],
  selectedSegments: ["openField", "greenhouse", "orchard", "hydroponic"],
  selectedCurrency: "TRY",
  allowNicheSuggestions: true,
};

export const useAgroStore = create<AgroState>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      dailyDiscovery: null,
      setSelectedCategories: (categories) =>
        set((state) => ({
          preferences: { ...state.preferences, selectedCategories: categories },
        })),
      toggleCategory: (category) =>
        set((state) => {
          const exists = state.preferences.selectedCategories.includes(category);
          const selectedCategories = exists
            ? state.preferences.selectedCategories.filter((c) => c !== category)
            : [...state.preferences.selectedCategories, category];
          return { preferences: { ...state.preferences, selectedCategories } };
        }),
      setSelectedSegments: (segments) =>
        set((state) => ({
          preferences: { ...state.preferences, selectedSegments: segments },
        })),
      toggleSegment: (segment) =>
        set((state) => {
          const exists = state.preferences.selectedSegments.includes(segment);
          const selectedSegments = exists
            ? state.preferences.selectedSegments.filter((s) => s !== segment)
            : [...state.preferences.selectedSegments, segment];
          return { preferences: { ...state.preferences, selectedSegments } };
        }),
      setCurrency: (selectedCurrency) =>
        set((state) => ({ preferences: { ...state.preferences, selectedCurrency } })),
      setAllowNicheSuggestions: (allowNicheSuggestions) =>
        set((state) => ({ preferences: { ...state.preferences, allowNicheSuggestions } })),
      setDailyDiscovery: (dailyDiscovery) => set({ dailyDiscovery }),
    }),
    {
      name: "sonar-agro-v1",
      storage: createJSONStorage(() => AsyncStorage),
      merge: (persisted, current) => {
        const p = persisted as Partial<AgroState> | undefined;
        if (!p || typeof p !== "object") return current;
        return {
          ...current,
          ...p,
          preferences: {
            ...defaultPreferences,
            ...(p.preferences || {}),
          },
        };
      },
    },
  ),
);
