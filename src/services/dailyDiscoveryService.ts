import AsyncStorage from "@react-native-async-storage/async-storage";
import { cropCatalog } from "../data/cropCatalog";
import { DailyDiscovery } from "../types/agro";

const DAILY_DISCOVERY_KEY = "sonar-daily-discovery-v1";

const toDateKey = (date = new Date()) => date.toISOString().slice(0, 10);

function pickCropIdByDate(dateKey: string): string {
  const seed = dateKey.split("-").map(Number).reduce((acc, n) => acc + n, 0);
  return cropCatalog[seed % cropCatalog.length].id;
}

export async function getDailyDiscoveryCached(date = new Date()): Promise<DailyDiscovery> {
  const dateKey = toDateKey(date);
  const cachedRaw = await AsyncStorage.getItem(DAILY_DISCOVERY_KEY);
  if (cachedRaw) {
    const cached = JSON.parse(cachedRaw) as DailyDiscovery;
    if (cached.dateKey === dateKey) return cached;
  }
  const next: DailyDiscovery = {
    dateKey,
    cropId: pickCropIdByDate(dateKey),
  };
  await AsyncStorage.setItem(DAILY_DISCOVERY_KEY, JSON.stringify(next));
  return next;
}
