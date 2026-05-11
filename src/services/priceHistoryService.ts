import AsyncStorage from "@react-native-async-storage/async-storage";
import { priceHistoryDatasets, PriceSeriesDataset } from "../data/priceHistory";
import { getMockCropById } from "../data/mockCrops";
import { HistoricalData } from "../types/crop";

const CACHE_KEY = "sonar-price-history-v1";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24;
const REMOTE_DATASET_URL =
  "https://raw.githubusercontent.com/sonar-farm-roi/datasets/main/prices-v1.json";

type PriceSeriesResult = {
  series: HistoricalData[];
  source: string;
  updatedAt: string;
};

type CachedPayload = {
  fetchedAt: number;
  datasets: PriceSeriesDataset[];
};

async function readRemoteDatasets(): Promise<PriceSeriesDataset[] | null> {
  try {
    const now = Date.now();
    const cachedRaw = await AsyncStorage.getItem(CACHE_KEY);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw) as CachedPayload;
      if (cached?.datasets?.length && now - cached.fetchedAt < CACHE_TTL_MS) {
        return cached.datasets;
      }
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(REMOTE_DATASET_URL, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const json = (await res.json()) as { datasets?: PriceSeriesDataset[] };
    if (!json?.datasets?.length) return null;

    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt: now, datasets: json.datasets }));
    return json.datasets;
  } catch {
    return null;
  }
}

function pickDataset(
  cropId: string,
  countryCode: string,
  datasets: PriceSeriesDataset[],
): PriceSeriesDataset | null {
  const cc = (countryCode || "UN").toUpperCase();
  return (
    datasets.find((d) => d.cropId === cropId && d.countryCode.toUpperCase() === cc) ||
    datasets.find((d) => d.cropId === cropId && d.countryCode === "TR") ||
    null
  );
}

export async function getPriceSeriesByCountry(
  cropId: string,
  countryCode: string,
): Promise<PriceSeriesResult | null> {
  const remote = await readRemoteDatasets();
  const merged = remote?.length ? [...remote, ...priceHistoryDatasets] : priceHistoryDatasets;
  const selected = pickDataset(cropId, countryCode, merged);
  if (selected) {
    return {
      series: selected.data,
      source: selected.source,
      updatedAt: selected.updatedAt,
    };
  }

  const crop = getMockCropById(cropId);
  if (!crop?.historicalData?.length) return null;
  return {
    series: crop.historicalData,
    source: "Local static fallback (mockCrops)",
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}

