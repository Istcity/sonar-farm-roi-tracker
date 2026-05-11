import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ThemeName, themePalettes } from "../theme/palettes";

type ThemeState = {
  countryCode: string;
  locale: string;
  themeName: ThemeName;
  setLocale: (locale: string) => void;
  setThemeByCountry: (countryCode?: string) => void;
  setThemeName: (themeName: ThemeName) => void;
};

const tropicalCountries = ["BR", "ID", "MY", "TH", "PH", "VN", "CO", "NG"];
const aridCountries = ["AE", "SA", "EG", "DZ", "MA", "JO", "TN", "QA"];

const resolveThemeByCountry = (countryCode?: string): ThemeName => {
  if (!countryCode) return "continental";
  const normalized = countryCode.toUpperCase();
  if (tropicalCountries.includes(normalized)) return "tropical";
  if (aridCountries.includes(normalized)) return "arid";
  return "continental";
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      countryCode: "UN",
      locale: "en",
      themeName: "tropical",
      setLocale: (locale) => set({ locale }),
      setThemeName: (themeName) => set({ themeName }),
      setThemeByCountry: (countryCode) =>
        set({
          countryCode: (countryCode || "UN").toUpperCase(),
          themeName: resolveThemeByCountry(countryCode),
        }),
    }),
    {
      name: "sonar-theme-v1",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export const getThemePalette = (themeName: ThemeName) => themePalettes[themeName];
