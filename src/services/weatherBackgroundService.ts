import * as BackgroundFetch from "expo-background-fetch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import { fetchWeatherByCoords } from "../lib/weather";
import { recommendSuitableCrops } from "./recommendationService";
import { ClimateZone, UserPreferenceProfile } from "../types/agro";

const TASK_NAME = "sonar-daily-weather-task";
const AGRO_STORE_KEY = "sonar-agro-v1";

const defaultPrefs: UserPreferenceProfile = {
  selectedCategories: ["fruit", "grain", "vegetable", "niche"],
  selectedSegments: ["openField", "greenhouse", "orchard", "hydroponic"],
  selectedCurrency: "TRY",
  allowNicheSuggestions: true,
};

function climateFromLatitude(lat: number): ClimateZone {
  const abs = Math.abs(lat);
  if (abs < 23.5) return "tropical";
  if (abs > 35 && abs < 47) return "continental";
  return "temperate";
}

async function readPreferences(): Promise<UserPreferenceProfile> {
  try {
    const raw = await AsyncStorage.getItem(AGRO_STORE_KEY);
    if (!raw) return defaultPrefs;
    const parsed = JSON.parse(raw) as { state?: { preferences?: UserPreferenceProfile } };
    return parsed?.state?.preferences || defaultPrefs;
  } catch {
    return defaultPrefs;
  }
}

function riskHeadline(weather: { temperatureC: number; humidity: number; windKmh: number }) {
  if (weather.temperatureC <= 2) return "Frost risk detected this morning.";
  if (weather.humidity >= 85) return "High humidity: monitor fungal disease risk.";
  if (weather.windKmh >= 30) return "Strong wind expected: review spraying schedule.";
  return "Daily weather check is ready.";
}

if (!TaskManager.isTaskDefined(TASK_NAME)) {
  TaskManager.defineTask(TASK_NAME, async () => {
    try {
      const locPerm = await Location.getForegroundPermissionsAsync();
      if (locPerm.status !== "granted") return BackgroundFetch.BackgroundFetchResult.NoData;
      const pos = await Location.getCurrentPositionAsync({});
      const geo = await Location.reverseGeocodeAsync({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
      const place = geo?.[0]?.city || geo?.[0]?.region || "Local area";
      const prefs = await readPreferences();
      const climate = climateFromLatitude(pos.coords.latitude);
      const picks = recommendSuitableCrops({ climate, preferences: prefs }).slice(0, 2);
      const weather = await fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude, place);
      const picksLine = picks.length > 0 ? ` Suggested crops: ${picks.map((p) => p.name).join(", ")}.` : "";
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "SONAR Morning Brief",
          body: `${place}: ${weather.temperatureC}°C, RH ${weather.humidity}%, wind ${weather.windKmh} km/h. ${riskHeadline(weather)}${picksLine}`,
        },
        trigger: null,
      });
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch {
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  });
}

export async function ensureMorningWeatherTaskRegistered() {
  await Notifications.requestPermissionsAsync();
  const status = await BackgroundFetch.getStatusAsync();
  if (
    status === BackgroundFetch.BackgroundFetchStatus.Restricted ||
    status === BackgroundFetch.BackgroundFetchStatus.Denied
  ) {
    return;
  }
  const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
  if (!isRegistered) {
    await BackgroundFetch.registerTaskAsync(TASK_NAME, {
      minimumInterval: 60 * 60 * 24,
      stopOnTerminate: false,
      startOnBoot: true,
    });
  }
}
