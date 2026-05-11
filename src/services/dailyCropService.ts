import AsyncStorage from "@react-native-async-storage/async-storage";
import { mockCrops } from "../data/mockCrops";
import { Crop } from "../types/crop";

const DAILY_KEY = "sonar-daily-crop-v1";

type CachedDaily = {
  dateKey: string;
  cropId: string;
};

const dateKeyOf = (date = new Date()) => date.toISOString().slice(0, 10);

function pickCropForDate(dateKey: string): Crop {
  const seed = dateKey.split("-").reduce((sum, s) => sum + Number(s), 0);
  return mockCrops[seed % mockCrops.length];
}

export async function getDailyCrop(date = new Date()): Promise<Crop> {
  const dateKey = dateKeyOf(date);
  const raw = await AsyncStorage.getItem(DAILY_KEY);
  if (raw) {
    const cached = JSON.parse(raw) as CachedDaily;
    if (cached.dateKey === dateKey) {
      const found = mockCrops.find((c) => c.id === cached.cropId);
      if (found) return found;
    }
  }
  const crop = pickCropForDate(dateKey);
  const payload: CachedDaily = { dateKey, cropId: crop.id };
  await AsyncStorage.setItem(DAILY_KEY, JSON.stringify(payload));
  return crop;
}
